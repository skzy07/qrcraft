import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SUPABASE_URL = 'https://tedsjcpxtuezwmbdlsua.supabase.co'
const SUPABASE_KEY = 'sb_publishable_tOhoniF0SMtAH-E9YdZ-jg_GraeJNYZ'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

export async function getUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function getUserPlan(userId) {
  const { data } = await supabase
    .from('subscriptions')
    .select('status')
    .eq('user_id', userId)
    .single()
  return data?.status || 'free'
}

export async function getTodayQRCount(userId) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const { count } = await supabase
    .from('qr_codes')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('created_at', today.toISOString())
  return count || 0
}
