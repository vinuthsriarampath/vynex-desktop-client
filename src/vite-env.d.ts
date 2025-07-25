/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_BASE_URL?: string;
    readonly VITE_GITHUB_PAT?: string;
    readonly VITE_GITHUB_BASE_URL?: string;
    readonly VITE_GITHUB_USERNAME?: string;
    readonly VITE_SUPABASE_ANON_KEY?: string;
    readonly VITE_SUPABASE_URL?: string;
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }