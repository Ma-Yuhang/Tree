/// <reference types="vite/client" />

declare module '*.tsx' {
  const content: { readonly [key: string]: string }
  export default content
}
