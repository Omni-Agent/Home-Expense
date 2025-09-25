import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://avorsnajpdrhhkkqyajn.supabase.co"
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2b3JzbmFqcGRyaGhra3F5YWpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1NjUxODgsImV4cCI6MjA3NDE0MTE4OH0.PNGpfFsX-siDElM7KKrM3uAYSIZbqaVKG1i_KEMLklM"

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("[v0] Missing Supabase environment variables:", {
      url: !!supabaseUrl,
      key: !!supabaseAnonKey,
      env: process.env,
    })
    throw new Error("Supabase environment variables are not available. Please check your project configuration.")
  }

  console.log("[v0] Supabase client created successfully")
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
