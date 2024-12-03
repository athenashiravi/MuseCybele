import { createClient } from "@supabase/supabase-js";

// Replace these with your actual Supabase Project URL and Public API Key
const SUPABASE_URL = "https://bksoxskirghdhzepmhvl.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJrc294c2tpcmdoZGh6ZXBtaHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMxNjA0NDYsImV4cCI6MjA0ODczNjQ0Nn0.l2TUSRCSpRkScty8xlUjux0Y6dVjYcdudwh4LQRFXZk";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
