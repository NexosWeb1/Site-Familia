// Cliente único do Supabase, compartilhado por todo o app.
//
// A URL e a anon key vêm de variáveis de ambiente (ver .env.example) —
// nunca cole esses valores direto no código. O Vite só expõe pro
// navegador variáveis prefixadas com VITE_, e só as que estiverem no
// arquivo .env (que você cria localmente, copiando .env.example).
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // Falha alto e claro em vez de deixar o site quebrar silenciosamente
  // com um erro de rede confuso lá na hora de buscar dados.
  throw new Error(
    'Supabase não configurado: crie um arquivo .env na raiz do projeto ' +
    '(copie .env.example) com VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY ' +
    'do seu projeto Supabase, e reinicie "npm run dev".'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
