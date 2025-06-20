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

    // Create user in Supabase Auth
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

    // Create user profile in database
    const userProfileData = {
      id: user.id,
      user_id: user.id,
      name: fullName,
      email: email,
      token_identifier: user.id,
      full_name: fullName,
    };

    const { error: profileError } = await supabase
      .from('users')
      .insert(userProfileData);

    if (profileError) {
      console.error('Profile creation error:', profileError);
      return NextResponse.json(
        { error: profileError.message },
        { status: 500 }
      );
    }

    // Verify user was created
    const { data: verifyUser, error: verifyError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (verifyError || !verifyUser) {
      return NextResponse.json(
        { error: 'User created but verification failed' },
        { status: 500 }
      );
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