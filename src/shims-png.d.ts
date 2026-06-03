// Required so TypeScript understands PNG imports (illustrationSet1/2)
declare module '*.png' {
  const src: string
  export default src
}
