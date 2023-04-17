export function getApiBaseUrl(): string {
  let apiBaseUrl = 'https://threatcode.io/api';
  if (process.env.THREATCODE_API) {
    if (process.env.THREATCODE_API.endsWith('/api')) {
      apiBaseUrl = process.env.THREATCODE_API;
    } else if (process.env.THREATCODE_API.endsWith('/api/v1')) {
      // threatcode CI environment - we use `.../api/v1` though the norm is just `.../api`
      apiBaseUrl = process.env.THREATCODE_API.replace('/v1', '');
    } else {
      console.warn(
        'Malformed THREATCODE_API value. Using default: https://threatcode.io/api',
      );
    }
  }
  return apiBaseUrl;
}
