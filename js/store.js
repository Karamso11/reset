// Where logs are saved: Supabase when config.js is filled in, otherwise this browser.
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config.js';

export const cloud = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
let client = null;
const LOCAL_KEY = 'reset.logs.v1';

export async function init() {
  if (!cloud) return;
  const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');
  client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

export async function currentUser() {
  if (!cloud) return { id: 'local', email: 'this browser' };
  const { data } = await client.auth.getSession();
  return data.session ? data.session.user : null;
}

export async function signIn(email, password) {
  const { error } = await client.auth.signInWithPassword({ email, password });
  if (error) throw error;
}

export async function signUp(email, password) {
  const { data, error } = await client.auth.signUp({ email, password });
  if (error) throw error;
  return data.session ? 'signed-in' : 'check-email';
}

export async function signOut() {
  if (client) await client.auth.signOut();
}

function readLocal() {
  try { return JSON.parse(localStorage.getItem(LOCAL_KEY) || '{}'); } catch { return {}; }
}
function writeLocal(all) {
  try { localStorage.setItem(LOCAL_KEY, JSON.stringify(all)); } catch { /* storage blocked */ }
}

export async function getLogs() {
  if (!cloud) return Object.values(readLocal()).sort((a, b) => a.date.localeCompare(b.date));
  const { data, error } = await client.from('logs').select('*').order('date');
  if (error) throw error;
  return data;
}

export async function saveLog(row) {
  if (!cloud) {
    const all = readLocal();
    all[row.date] = { ...row, updated_at: new Date().toISOString() };
    writeLocal(all);
    return;
  }
  const user = await currentUser();
  const { error } = await client.from('logs')
    .upsert({ ...row, user_id: user.id, updated_at: new Date().toISOString() }, { onConflict: 'user_id,date' });
  if (error) throw error;
}
