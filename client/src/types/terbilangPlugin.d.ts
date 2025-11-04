// src/types/terbilangPlugin.d.ts
declare module '@/plugins/terbilangPlugin' {
  const plugin: {
    install: (app: import('vue').App) => void;
  };
  export default plugin;
}
