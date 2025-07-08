/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_BASE_URL?: string;
    readonly VITE_GITHUB_PAT?: string;
    readonly VITE_GITHUB_BASE?: string;
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }