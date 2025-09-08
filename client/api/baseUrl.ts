// Centralized base URL and build environment helpers
// This file isolates env parsing so other modules (config, endpoints) can import it
const getEnvVar = (key: string, fallback: string = ''): string => {
  const env: any = import.meta.env as any;
  // Support both VITE_* and REACT_APP_* style keys
  if (env[key] != null && env[key] !== '') return env[key] as string;
  if (key.startsWith('REACT_APP_')) {
    const viteKey = key.replace(/^REACT_APP_/, 'VITE_');
    if (env[viteKey] != null && env[viteKey] !== '') return env[viteKey] as string;
  }
  return fallback;
};

export const BUILD_ENV = parseInt(getEnvVar('REACT_APP_BUILD_ENV', getEnvVar('VITE_BUILD_ENV', '0')));

const baseUrls: Record<number, string> = {
  0: getEnvVar('REACT_APP_LOCAL_BACKEND_URL', getEnvVar('VITE_LOCAL_BACKEND_URL', '')),
  1: getEnvVar('REACT_APP_STAGING_BACKEND_URL', getEnvVar('VITE_STAGING_BACKEND_URL', '')),
  2: getEnvVar('REACT_APP_PROD_BACKEND_URL', getEnvVar('VITE_PROD_BACKEND_URL', '')),
};

const stripTrailingSlash = (u: string) => (u ? u.replace(/\/+$/u, '') : u);

const resolved = getEnvVar('VITE_API_BASE_URL', '') || baseUrls[BUILD_ENV as keyof typeof baseUrls] || '';
if (!resolved) {
  // Fail fast during development so env is configured explicitly
  if ((import.meta.env as any).MODE !== 'production') {
    // eslint-disable-next-line no-console
    console.error('[baseUrl] API base URL is not set. Please define VITE_API_BASE_URL or the environment-specific backend URL in your .env file.');
  }
}

export const API_BASE_URL = stripTrailingSlash(resolved);

export default API_BASE_URL;
