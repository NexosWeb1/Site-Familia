// Config mínima. O Vite já expõe automaticamente qualquer variável de
// ambiente prefixada com VITE_ (ver .env.example) para o código do
// navegador via `import.meta.env` — não precisa de nada especial aqui
// pra isso funcionar. Só existe este arquivo pra deixar explícito que o
// projeto usa Vite, caso precise de mais configuração no futuro.
import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist'
  }
});
