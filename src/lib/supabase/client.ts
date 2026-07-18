import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

// This is a static export (output: 'export'), so there's no server to read
// env vars at request time — NEXT_PUBLIC_* values get baked into the JS
// bundle at BUILD time. Set them before running `npm run build`, not after
// deploying. See .env.local.example.
//
// Deliberately not throwing here if they're missing: this file gets
// evaluated during `next build`'s static prerender of client components,
// and a hard throw at import time would break the build entirely rather
// than failing gracefully in the browser. Queries just no-op with a
// console error instead — see lib/supabase/queries.ts.
export const supabase =
  supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;