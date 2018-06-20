export const port = process.env.APP_PORT || '8080'
export const domain = process.env.APP_DOMAIN || 'taskman.localhost'
export const httpOrigin = `http://${domain}:${port}`