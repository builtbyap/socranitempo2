const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigrations() {
  console.log('🚀 Running database migrations...');

  try {
    // Read migration files
    const initialSetupPath = path.join(__dirname, '../supabase/migrations/initial-setup.sql');
    const applicationTablesPath = path.join(__dirname, '../supabase/migrations/application-tables.sql');

    if (!fs.existsSync(initialSetupPath)) {
      console.error('❌ Initial setup migration not found');
      process.exit(1);
    }

    if (!fs.existsSync(applicationTablesPath)) {
      console.error('❌ Application tables migration not found');
      process.exit(1);
    }

    const initialSetup = fs.readFileSync(initialSetupPath, 'utf8');
    const applicationTables = fs.readFileSync(applicationTablesPath, 'utf8');

    console.log('📝 Running initial setup migration...');
    const { error: error1 } = await supabase.rpc('exec_sql', { sql: initialSetup });
    
    if (error1) {
      console.error('❌ Error running initial setup migration:', error1);
      console.log('💡 You may need to run this manually in the Supabase SQL Editor');
    } else {
      console.log('✅ Initial setup migration completed');
    }

    console.log('📝 Running application tables migration...');
    const { error: error2 } = await supabase.rpc('exec_sql', { sql: applicationTables });
    
    if (error2) {
      console.error('❌ Error running application tables migration:', error2);
      console.log('💡 You may need to run this manually in the Supabase SQL Editor');
    } else {
      console.log('✅ Application tables migration completed');
    }

    console.log('');
    console.log('🎉 Migration process completed!');
    console.log('');
    console.log('📋 Next steps:');
    console.log('1. Verify tables were created in your Supabase dashboard');
    console.log('2. Run: node scripts/setup-database.js');
    console.log('3. Test the application');

  } catch (error) {
    console.error('❌ Error running migrations:', error);
    console.log('');
    console.log('💡 Manual migration instructions:');
    console.log('1. Go to your Supabase dashboard');
    console.log('2. Navigate to SQL Editor');
    console.log('3. Copy and paste the contents of:');
    console.log('   - supabase/migrations/initial-setup.sql');
    console.log('   - supabase/migrations/application-tables.sql');
    console.log('4. Run each migration');
  }
}

// Run migrations
runMigrations(); 