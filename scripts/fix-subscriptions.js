const { createClient } = require('@supabase/supabase-js');

// This script fixes subscription status issues in the database
// Run this to ensure all subscriptions are properly linked to users

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixSubscriptions() {
  console.log('🔧 Starting subscription fix process...');

  try {
    // Get all users
    console.log('📋 Fetching all users...');
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, user_id, email, subscription');

    if (usersError) {
      console.error('Error fetching users:', usersError);
      return;
    }

    console.log(`Found ${users.length} users`);

    // Get all subscriptions
    console.log('📋 Fetching all subscriptions...');
    const { data: subscriptions, error: subscriptionsError } = await supabase
      .from('subscriptions')
      .select('*');

    if (subscriptionsError) {
      console.error('Error fetching subscriptions:', subscriptionsError);
      return;
    }

    console.log(`Found ${subscriptions.length} subscriptions`);

    // Fix each user's subscription status
    for (const user of users) {
      console.log(`\n👤 Processing user: ${user.email} (ID: ${user.id}, user_id: ${user.user_id})`);

      // Find subscriptions for this user
      const userSubscriptions = subscriptions.filter(sub => 
        sub.user_id === user.user_id || sub.user_id === user.id
      );

      console.log(`Found ${userSubscriptions.length} subscriptions for this user`);

      if (userSubscriptions.length > 0) {
        // Check if any are active
        const activeSubscriptions = userSubscriptions.filter(sub => sub.status === 'active');
        
        if (activeSubscriptions.length > 0) {
          console.log(`✅ User has ${activeSubscriptions.length} active subscription(s)`);
          
          // Update user's subscription field
          const { error: updateError } = await supabase
            .from('users')
            .update({ subscription: 'active' })
            .eq('id', user.id);

          if (updateError) {
            console.error(`❌ Failed to update user subscription field:`, updateError);
          } else {
            console.log(`✅ Updated user subscription field to 'active'`);
          }

          // Ensure all subscriptions have correct user_id
          for (const subscription of userSubscriptions) {
            if (subscription.user_id !== user.user_id) {
              console.log(`🔄 Fixing subscription user_id from ${subscription.user_id} to ${user.user_id}`);
              
              const { error: fixError } = await supabase
                .from('subscriptions')
                .update({ user_id: user.user_id })
                .eq('id', subscription.id);

              if (fixError) {
                console.error(`❌ Failed to fix subscription user_id:`, fixError);
              } else {
                console.log(`✅ Fixed subscription user_id`);
              }
            }
          }
        } else {
          console.log(`⚠️ User has subscriptions but none are active`);
          
          // Update user's subscription field to null
          const { error: updateError } = await supabase
            .from('users')
            .update({ subscription: null })
            .eq('id', user.id);

          if (updateError) {
            console.error(`❌ Failed to update user subscription field:`, updateError);
          } else {
            console.log(`✅ Updated user subscription field to null`);
          }
        }
      } else {
        console.log(`❌ User has no subscriptions`);
        
        // Update user's subscription field to null
        const { error: updateError } = await supabase
          .from('users')
          .update({ subscription: null })
          .eq('id', user.id);

        if (updateError) {
          console.error(`❌ Failed to update user subscription field:`, updateError);
        } else {
          console.log(`✅ Updated user subscription field to null`);
        }
      }
    }

    console.log('\n🎉 Subscription fix process completed!');
    console.log('\n📊 Summary:');
    console.log(`- Processed ${users.length} users`);
    console.log(`- Found ${subscriptions.length} total subscriptions`);
    
    // Final verification
    console.log('\n🔍 Running final verification...');
    const { data: finalUsers, error: finalError } = await supabase
      .from('users')
      .select('email, subscription')
      .eq('subscription', 'active');

    if (finalError) {
      console.error('Error in final verification:', finalError);
    } else {
      console.log(`✅ Found ${finalUsers.length} users with active subscriptions`);
    }

  } catch (error) {
    console.error('❌ Error during subscription fix:', error);
    process.exit(1);
  }
}

// Run the fix
fixSubscriptions(); 