const { createClient } = require('@supabase/supabase-js');

// This script sets up the database with sample data
// Run this after applying the migrations

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupDatabase() {
  console.log('🚀 Setting up database with sample data...');

  try {
    // Add sample jobs
    console.log('📝 Adding sample jobs...');
    const sampleJobs = [
      {
        company_name: 'Google',
        job_title: 'Senior Software Engineer',
        description: 'Join our team to build next-generation applications',
        location: 'Mountain View, CA',
        salary_range: '$150,000 - $200,000',
        requirements: '5+ years experience, React, Node.js',
        benefits: 'Health insurance, 401k, free meals',
        job_url: 'https://careers.google.com/jobs/senior-engineer',
        is_active: true
      },
      {
        company_name: 'Microsoft',
        job_title: 'Frontend Developer',
        description: 'Build beautiful user interfaces for our products',
        location: 'Redmond, WA',
        salary_range: '$120,000 - $160,000',
        requirements: '3+ years experience, TypeScript, React',
        benefits: 'Health insurance, stock options, flexible hours',
        job_url: 'https://careers.microsoft.com/jobs/frontend',
        is_active: true
      },
      {
        company_name: 'Apple',
        job_title: 'iOS Developer',
        description: 'Create amazing iOS applications',
        location: 'Cupertino, CA',
        salary_range: '$140,000 - $180,000',
        requirements: '4+ years experience, Swift, iOS SDK',
        benefits: 'Health insurance, employee discount, gym membership',
        job_url: 'https://jobs.apple.com/ios-developer',
        is_active: true
      },
      {
        company_name: 'Amazon',
        job_title: 'Full Stack Engineer',
        description: 'Build scalable web applications',
        location: 'Seattle, WA',
        salary_range: '$130,000 - $170,000',
        requirements: '3+ years experience, JavaScript, AWS',
        benefits: 'Health insurance, 401k, stock options',
        job_url: 'https://amazon.jobs/full-stack-engineer',
        is_active: true
      },
      {
        company_name: 'Netflix',
        job_title: 'Backend Engineer',
        description: 'Scale our streaming platform',
        location: 'Los Gatos, CA',
        salary_range: '$160,000 - $220,000',
        requirements: '5+ years experience, Java, microservices',
        benefits: 'Health insurance, unlimited vacation, free Netflix',
        job_url: 'https://jobs.netflix.com/backend-engineer',
        is_active: true
      }
    ];

    for (const job of sampleJobs) {
      const { error } = await supabase
        .from('jobs')
        .insert(job);
      
      if (error) {
        console.error('Error inserting job:', error);
      } else {
        console.log(`✅ Added job: ${job.job_title} at ${job.company_name}`);
      }
    }

    console.log('✅ Database setup completed!');
    console.log('');
    console.log('📊 Sample data added:');
    console.log('- 5 sample jobs from top tech companies');
    console.log('');
    console.log('🔧 Next steps:');
    console.log('1. Create a user account through the sign-up page');
    console.log('2. The user will automatically get a free tier subscription');
    console.log('3. Test the dashboard functionality');
    console.log('4. Add applications, network connections, and other data');

  } catch (error) {
    console.error('❌ Error setting up database:', error);
    process.exit(1);
  }
}

// Run the setup
setupDatabase(); 