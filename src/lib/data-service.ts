import { createClient } from "../../supabase/client";
import { TablesInsert, TablesUpdate } from "@/types/supabase";

export class DataService {
  private static getClient() {
    return createClient();
  }

  // User Profile Operations
  static async getUserProfile(userId: string) {
    const supabase = this.getClient();
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) throw error;
    return data;
  }

  static async getUserExtendedProfile(userId: string) {
    const supabase = this.getClient();
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
    return data;
  }

  // User Statistics
  static async getUserStats(userId: string) {
    const supabase = this.getClient();
    const { data, error } = await supabase
      .rpc('get_user_stats', { user_uuid: userId });
    
    if (error) throw error;
    return data;
  }

  // Recent Activity
  static async getRecentActivity(userId: string, limit: number = 10) {
    const supabase = this.getClient();
    const { data, error } = await supabase
      .rpc('get_recent_activity', { 
        user_uuid: userId, 
        limit_count: limit 
      });
    
    if (error) throw error;
    return data;
  }

  // Applications Operations
  static async getApplications(userId: string) {
    const supabase = this.getClient();
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .eq('user_id', userId)
      .order('applied_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  static async getApplication(id: string) {
    const supabase = this.getClient();
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  static async createApplication(application: TablesInsert<'applications'>) {
    const supabase = this.getClient();
    const { data, error } = await supabase
      .from('applications')
      .insert(application)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async updateApplication(id: string, updates: Partial<TablesUpdate<'applications'>>) {
    const supabase = this.getClient();
    const { data, error } = await supabase
      .from('applications')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Jobs Operations
  static async getJobs(limit: number = 50) {
    const supabase = this.getClient();
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('is_active', true)
      .order('posted_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data;
  }

  static async getJob(id: string) {
    const supabase = this.getClient();
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  // Network Connections Operations
  static async getNetworkConnections(userId: string) {
    const supabase = this.getClient();
    const { data, error } = await supabase
      .from('network_connections')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  static async createNetworkConnection(connection: TablesInsert<'network_connections'>) {
    const supabase = this.getClient();
    const { data, error } = await supabase
      .from('network_connections')
      .insert(connection)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Messages Operations
  static async getMessages(userId: string) {
    const supabase = this.getClient();
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:users!messages_sender_id_fkey(name, email),
        recipient:users!messages_recipient_id_fkey(name, email)
      `)
      .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
      .order('sent_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  static async getUnreadMessages(userId: string) {
    const supabase = this.getClient();
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('recipient_id', userId)
      .eq('is_read', false)
      .order('sent_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  static async sendMessage(message: TablesInsert<'messages'>) {
    const supabase = this.getClient();
    const { data, error } = await supabase
      .from('messages')
      .insert(message)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async markMessageAsRead(messageId: string) {
    const supabase = this.getClient();
    const { data, error } = await supabase
      .from('messages')
      .update({ 
        is_read: true, 
        read_at: new Date().toISOString() 
      })
      .eq('id', messageId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Interviews Operations
  static async getInterviews(userId: string) {
    const supabase = this.getClient();
    const { data, error } = await supabase
      .from('interviews')
      .select(`
        *,
        application:applications(company_name, job_title)
      `)
      .eq('user_id', userId)
      .order('scheduled_at', { ascending: true });
    
    if (error) throw error;
    return data;
  }

  static async createInterview(interview: TablesInsert<'interviews'>) {
    const supabase = this.getClient();
    const { data, error } = await supabase
      .from('interviews')
      .insert(interview)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Referrals Operations
  static async getReferrals(userId: string) {
    const supabase = this.getClient();
    const { data, error } = await supabase
      .from('referrals')
      .select(`
        *,
        referrer:users!referrals_referrer_id_fkey(name, email),
        referred_user:users!referrals_referred_user_id_fkey(name, email)
      `)
      .or(`referrer_id.eq.${userId},referred_user_id.eq.${userId}`)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  static async createReferral(referral: TablesInsert<'referrals'>) {
    const supabase = this.getClient();
    const { data, error } = await supabase
      .from('referrals')
      .insert(referral)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Subscription Operations
  static async getUserSubscription(userId: string) {
    const supabase = this.getClient();
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  // Dashboard Data Aggregation
  static async getDashboardData(userId: string) {
    try {
      const [stats, recentActivity, applications, interviews] = await Promise.all([
        this.getUserStats(userId),
        this.getRecentActivity(userId, 5),
        this.getApplications(userId),
        this.getInterviews(userId)
      ]);

      return {
        stats,
        recentActivity,
        applications: applications.slice(0, 5), // Latest 5 applications
        interviews: interviews.slice(0, 5), // Next 5 interviews
        hasActiveSubscription: await this.checkUserSubscription(userId)
      };
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw error;
    }
  }

  // Helper method for subscription check
  static async checkUserSubscription(userId: string): Promise<boolean> {
    try {
      const subscription = await this.getUserSubscription(userId);
      return !!subscription;
    } catch {
      return false;
    }
  }

  // Search and Filter Operations
  static async searchJobs(query: string, location?: string) {
    const supabase = this.getClient();
    let queryBuilder = supabase
      .from('jobs')
      .select('*')
      .eq('is_active', true)
      .or(`company_name.ilike.%${query}%,job_title.ilike.%${query}%,description.ilike.%${query}%`);

    if (location) {
      queryBuilder = queryBuilder.ilike('location', `%${location}%`);
    }

    const { data, error } = await queryBuilder
      .order('posted_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async getApplicationsByStatus(userId: string, status: string) {
    const supabase = this.getClient();
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .eq('user_id', userId)
      .eq('status', status)
      .order('applied_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  // Analytics and Reporting
  static async getApplicationStats(userId: string) {
    const supabase = this.getClient();
    const { data, error } = await supabase
      .from('applications')
      .select('status, applied_at')
      .eq('user_id', userId);
    
    if (error) throw error;

    const stats = {
      total: data.length,
      byStatus: {} as Record<string, number>,
      byMonth: {} as Record<string, number>
    };

    data.forEach((app: { status: string; applied_at: string }) => {
      // Count by status
      stats.byStatus[app.status] = (stats.byStatus[app.status] || 0) + 1;
      
      // Count by month
      const month = new Date(app.applied_at).toISOString().slice(0, 7);
      stats.byMonth[month] = (stats.byMonth[month] || 0) + 1;
    });

    return stats;
  }
} 