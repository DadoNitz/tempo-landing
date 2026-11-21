// Files in public/img, listed at build time by vite.config.ts, so a missing picture never costs a 404.
declare const __IMGS__: string[]

export const has = (name: string) => __IMGS__.includes(name)
export const img = (name: string, fallback: string) => `img/${has(name) ? name : fallback}`
