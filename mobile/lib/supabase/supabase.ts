import { createClient } from '@supabase/supabase-js';

const url = 'https://axcycfnoiggotaskscyc.supabase.co';
const anonKey = 'sb_publishable_YOEP3xnzYMFa-F7TWvAjUA_UfTmaUCC';

export const supabase = createClient(url, anonKey);
