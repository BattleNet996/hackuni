import { createClient } from '@supabase/supabase-js';

function canonicalizeHackathonStatus(value) {
  const normalized = String(value || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[|｜·•,，.。:：/\\()（）_\-]/g, '');

  if (
    normalized === 'open' ||
    normalized === 'opening' ||
    normalized === 'upcoming' ||
    normalized === 'registering' ||
    normalized === 'registrationopen' ||
    normalized === '报名中' ||
    normalized === '报名' ||
    normalized === '未开始'
  ) {
    return 'open';
  }

  if (
    normalized === 'live' ||
    normalized === 'ongoing' ||
    normalized === 'running' ||
    normalized === 'inprogress' ||
    normalized === '进行中' ||
    normalized === '活动中'
  ) {
    return 'live';
  }

  return 'ended';
}

async function main() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data, error } = await supabase
    .from('hackathons')
    .select('id,registration_status');

  if (error) {
    throw error;
  }

  const rows = data || [];
  const updates = rows.filter((row) => canonicalizeHackathonStatus(row.registration_status) !== row.registration_status);

  if (updates.length === 0) {
    console.log('No hackathon statuses needed normalization.');
    return;
  }

  for (const row of updates) {
    const nextStatus = canonicalizeHackathonStatus(row.registration_status);
    const { error: updateError } = await supabase
      .from('hackathons')
      .update({ registration_status: nextStatus })
      .eq('id', row.id);

    if (updateError) {
      throw updateError;
    }

    console.log(`Normalized ${row.id}: ${row.registration_status} -> ${nextStatus}`);
  }

  console.log(`Normalized ${updates.length} hackathon statuses.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
