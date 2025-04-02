# Guia de Solução de Problemas do Supabase

Este guia ajudará a resolver problemas comuns na integração com o Supabase.

## Erro "Failed to fetch"

Este erro geralmente ocorre quando:
1. Não há conexão com a internet
2. O servidor do Supabase está inacessível
3. Há problemas com as políticas de segurança (CORS, RLS)

### Solução:

1. **Verifique sua conexão com a internet**
   - Teste acessando outros sites
   - Verifique se você está conectado a uma rede com firewall restritivo

2. **Verifique as configurações de permissão do bucket**
   - Acesse o Supabase Dashboard
   - Vá para "Storage" > "memorias"
   - Na aba "Policies", verifique se há uma política para permitir uploads anônimos:

```sql
-- Exemplo de política para permitir uploads anônimos
CREATE POLICY "Permitir uploads anônimos"
ON storage.objects
FOR INSERT TO anon
WITH CHECK (
  bucket_id = 'memorias'
);
```

3. **Verifique as configurações de RLS (Row Level Security)**
   - Acesse o SQL Editor no Dashboard do Supabase
   - Execute o seguinte comando para verificar se a tabela `memories` está com RLS ativado:

```sql
SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';
```

   - Se `rowsecurity` estiver `true` para a tabela `memories`, você precisa criar políticas apropriadas:

```sql
-- Política para permitir inserções anônimas
CREATE POLICY "Permitir inserções anônimas"
ON public.memories
FOR INSERT TO anon
WITH CHECK (true);

-- Política para permitir leitura anônima
CREATE POLICY "Permitir leitura anônima"
ON public.memories
FOR SELECT TO anon
USING (true);
```

4. **Crie o bucket "memorias" se não existir**
   - No Dashboard do Supabase, acesse "Storage"
   - Clique em "Novo Bucket"
   - Nomeie como "memorias"
   - Marque "Public" para permitir acesso público

## Verificando a estrutura do banco de dados

Execute este comando no SQL Editor para criar ou verificar a tabela `memories`:

```sql
-- Tabela para armazenar memórias
CREATE TABLE IF NOT EXISTS public.memories (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  url_path TEXT NOT NULL UNIQUE,
  user_email TEXT NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice para busca mais rápida por url_path
CREATE INDEX IF NOT EXISTS memories_url_path_idx ON public.memories(url_path);

-- Índice para busca mais rápida por email
CREATE INDEX IF NOT EXISTS memories_user_email_idx ON public.memories(user_email);
```

## Habilitando logs de debug

Para ajudar a identificar problemas, habilite o modo de debug no cliente Supabase:

1. Edite o arquivo `src/supabase/supabaseClient.js`
2. Modifique a criação do cliente para incluir a opção de debug:

```javascript
// Criar e exportar o cliente Supabase com debug ativado
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    debug: true
  }
});
```

## Testando a conexão manualmente

Execute este código no console do navegador para testar a conexão com o Supabase:

```javascript
(async () => {
  const { data, error } = await supabase.from('memories').select('count', { count: 'exact', head: true });
  console.log('Supabase connection test:', { data, error });
})();
```

Se receber um erro, isso pode ajudar a identificar o problema específico.

## Verificando permissões CORS

1. Acesse "Project Settings" > "API" no dashboard do Supabase
2. Na seção "API Settings", verifique se o "API URL" corresponde exatamente ao que está no seu código
3. Garanta que o domínio da sua aplicação esteja listado em "Allowed origins" (ou use `*` para testes) 