// This file helps TypeScript recognize CSS modules and Tailwind directives
declare module '*.css' {
  const content: { [className: string]: string }
  export default content
}

// Declare Tailwind directives so IDE won't show errors
declare namespace React {
  interface CSSProperties {
    [key: `--${string}`]: string | number
  }
} 