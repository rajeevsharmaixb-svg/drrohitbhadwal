import { createClient } from './supabase/client';

const supabase = createClient();

export async function logAdminAction(action: string, details: any = {}) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from('admin_logs').insert({
      admin_id: user.id,
      action,
      details
    });
  } catch (error) {
    console.error('Audit log failed', error);
  }
}
