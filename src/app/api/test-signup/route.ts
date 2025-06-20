import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '../../../../supabase/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const email = formData.get('email')?.toString();
    const password = formData.get('password')?.toString();
    const fullName = formData.get('full_name')?.toString();

    console.log('Test sign-up data received:', { email, fullName, passwordLength: password?.length });

    if (!email || !password || !fullName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Create user in Supabase Auth (the database trigger will handle creating the user profile)
    const { data: { user }, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          email: email,
        }
      },
    });

    if (authError) {
      console.error('Auth error:', authError);
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      );
    }

    if (!user) {
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      );
    }

    // Wait a moment for the database trigger to create the user profile
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Verify user was created by the trigger
    const { data: verifyUser, error: verifyError } = await supabase
      .from('users')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (verifyError || !verifyUser) {
      console.log('Trigger may have failed, attempting manual user creation...');
      
      // Fallback: manually create the user profile
      const userProfileData = {
        id: user.id,
        user_id: user.id,
        name: fullName,
        email: email,
        token_identifier: user.id,
        full_name: fullName,
      };

      const { error: manualInsertError } = await supabase
        .from('users')
        .insert(userProfileData);

      if (manualInsertError) {
        console.error('Manual user creation failed:', manualInsertError);
        return NextResponse.json(
          { error: 'User created but profile setup failed' },
          { status: 500 }
        );
      }

      console.log('User profile created manually');
    } else {
      console.log('User verified in database:', verifyUser);
    }

    return NextResponse.json({
      success: true,
      message: 'Test sign-up successful',
      user: {
        id: verifyUser.id,
        email: verifyUser.email,
        name: verifyUser.name || verifyUser.full_name,
        created_at: verifyUser.created_at
      }
    });

  } catch (error) {
    console.error('Test sign-up error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 