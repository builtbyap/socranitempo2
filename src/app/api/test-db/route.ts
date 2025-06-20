import { createClient } from "../../../../supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();
    
    // Test 1: Check if we can connect and query
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')
      .limit(5);
    
    // Test 2: Check subscriptions table
    const { data: subscriptions, error: subscriptionsError } = await supabase
      .from('subscriptions')
      .select('*')
      .limit(5);
    
    // Test 3: Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    return NextResponse.json({
      success: true,
      users: { data: users, error: usersError },
      subscriptions: { data: subscriptions, error: subscriptionsError },
      currentUser: { user, error: userError },
      message: "Database connection test completed"
    });
    
  } catch (error) {
    console.error("API test failed:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: "Database connection test failed"
    }, { status: 500 });
  }
}

export async function POST() {
  try {
    const supabase = await createClient();
    
    // Test data insertion
    const testUserData = {
      id: 'test-' + Date.now(),
      user_id: 'test-' + Date.now(),
      name: 'Test User',
      email: 'test@example.com',
      token_identifier: 'test@example.com',
      full_name: 'Test User',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    const testSubscriptionData = {
      user_id: testUserData.user_id,
      status: 'active',
      price_id: 'test_free_tier',
      stripe_price_id: 'test_free_tier',
      currency: 'usd',
      interval: 'year',
      current_period_start: Math.floor(Date.now() / 1000),
      current_period_end: Math.floor((Date.now() + 365 * 24 * 60 * 60 * 1000) / 1000),
      cancel_at_period_end: false,
      amount: 0,
      started_at: Math.floor(Date.now() / 1000),
      ends_at: null,
      ended_at: null,
      canceled_at: null,
      customer_cancellation_reason: null,
      customer_cancellation_comment: null,
      metadata: { plan: 'test_free_tier', source: 'api_test' },
      custom_field_data: null,
      customer_id: null,
    };
    
    // Try to insert test user
    const { data: userInsert, error: userInsertError } = await supabase
      .from('users')
      .insert(testUserData)
      .select();
    
    // Try to insert test subscription
    const { data: subscriptionInsert, error: subscriptionInsertError } = await supabase
      .from('subscriptions')
      .insert(testSubscriptionData)
      .select();
    
    return NextResponse.json({
      success: true,
      userInsert: { data: userInsert, error: userInsertError },
      subscriptionInsert: { data: subscriptionInsert, error: subscriptionInsertError },
      message: "Data insertion test completed"
    });
    
  } catch (error) {
    console.error("API insertion test failed:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: "Data insertion test failed"
    }, { status: 500 });
  }
} 