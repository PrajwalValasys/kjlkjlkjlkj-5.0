/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ENCRYPTION_KEY: string
  readonly VITE_RECAPTCHA_SITE_KEY: string
  readonly VITE_LINKEDIN_CLIENT_ID: string
  readonly REACT_APP_LOCAL_BACKEND_URL: string
  readonly REACT_APP_STAGING_BACKEND_URL: string
  readonly REACT_APP_PROD_BACKEND_URL: string
  readonly REACT_APP_BUILD_ENV: string
  readonly REACT_APP_API_TIMEOUT: string
  readonly REACT_APP_API_VERSION: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
