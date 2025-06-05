interface ImportMetaEnv {
  readonly VITE_APP_URL: string
  readonly VITE_API_URL: string
  readonly VITE_CACHE_API_URL: string
  readonly VITE_CLARITY_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
} 