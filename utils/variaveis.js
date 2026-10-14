const configLocal = JSON.parse(open('../config/config.local.json'));

export function pegarBaseUrl() {
  return baseUrl = __ENV.BASE_URL || configLocal.BaseUrl;
    
}