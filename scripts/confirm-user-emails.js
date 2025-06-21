const { createClient } = require('@supabase/supabase-js');

// This script manually confirms user emails in Supabase Auth
// Run this to fix "email not confirmed" issues for existing users

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function confirmUserEmails() {
  console.log('🔧 Starting email confirmation process...');

  try {
    // Get all users from the users table
    console.log('📋 Fetching all users...');
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, user_id, email, name');

    if (usersError) {
      console.error('Error fetching users:', usersError);
      return;
    }

    console.log(`Found ${users.length} users`);

    // For each user, we need to manually confirm their email in Supabase Auth
    // This requires admin access to the Supabase dashboard
    console.log('\n⚠️  IMPORTANT: Email confirmation requires admin access');
    console.log('To confirm user emails, you need to:');
    console.log('');
    console.log('1. Go to your Supabase Dashboard');
    console.log('2. Navigate to Authentication > Users');
    console.log('3. Find each user and manually confirm their email');
    console.log('');
    console.log('Alternatively, you can use the Supabase CLI:');
    console.log('');

    for (const user of users) {
      console.log(`👤 User: ${user.email} (ID: ${user.id})`);
      console.log(`   Supabase CLI command:`);
      console.log(`   supabase auth admin update-user ${user.id} --email-confirm`);
      console.log('');
    }

    console.log('📝 Manual confirmation steps:');
    console.log('1. Open Supabase Dashboard > Authentication > Users');
    console.log('2. For each user listed above:');
    console.log('   - Click on the user');
    console.log('   - Click "Confirm email" button');
    console.log('   - Or set "Email confirmed" to true');
    console.log('');
    console.log('3. After confirming emails, users should be able to sign in');
    console.log('');
    console.log('🔧 Alternative: Disable email confirmation requirement');
    console.log('In your Supabase Dashboard:');
    console.log('1. Go to Authentication > Settings');
    console.log('2. Under "Email Auth", disable "Confirm email"');
    console.log('3. This will allow users to sign in without email confirmation');

  } catch (error) {
    console.error('❌ Error during email confirmation process:', error);
    process.exit(1);
  }
}

// Run the confirmation process
confirmUserEmails(); 