import 'vite/client';

declare module '*.svg' {
  const content: any;
  export default content;
}
