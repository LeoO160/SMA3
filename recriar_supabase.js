// Script para recriar a tabela "memorias" e configurar o storage do Supabase
// Execute este script com Node.js após instalar o pacote node-fetch

// Configuração - Substitua pelas suas credenciais do Supabase
const supabaseUrl = 'https://zdorqehmnrmzlvwbqabx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpkb3JxZWhtbnJtemx2d2JxYWJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIyNTYyMTksImV4cCI6MjA1NzgzMjIxOX0.oIxNrnVrw7A7ThpDAHbmeplbl_legve6oshZdrH0Oos';

async function recriarTabela() {
  console.log('Iniciando processo de recriação da tabela e configuração do storage...');

  try {
    // 1. Remover a tabela existente, se houver
    console.log('Removendo tabela "memorias" existente...');
    const dropTableResponse = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      },
      body: JSON.stringify({
        sql_query: 'DROP TABLE IF EXISTS public.memorias CASCADE;'
      })
    });

    if (!dropTableResponse.ok) {
      console.warn('Aviso ao remover tabela:', await dropTableResponse.text());
    } else {
      console.log('Tabela removida com sucesso ou não existia.');
    }

    // 2. Criar a tabela memorias com todas as colunas necessárias
    console.log('Criando tabela "memorias"...');
    const createTableResponse = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      },
      body: JSON.stringify({
        sql_query: `
          CREATE TABLE public.memorias (
            id SERIAL PRIMARY KEY,
            title TEXT NOT NULL,
            url_path TEXT NOT NULL UNIQUE,
            user_email TEXT NOT NULL,
            title_color TEXT,
            title_bg_color TEXT,
            show_title_card BOOLEAN,
            style JSONB,
            time_text TEXT,
            counter_color TEXT,
            counter_font TEXT,
            counter_bg_color TEXT,
            show_counter_card BOOLEAN,
            show_animation BOOLEAN,
            selected_emoji TEXT,
            message TEXT,
            message_color TEXT,
            message_font TEXT,
            message_style JSONB,
            message_bg_color TEXT,
            show_message_card BOOLEAN,
            web_bg_color TEXT,
            music_url TEXT,
            music_type INTEGER,
            video_id TEXT,
            music_info JSONB,
            track_id TEXT,
            memories JSONB,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            visual_effect TEXT,
            selected_theme TEXT
          );

          -- Criar índices para melhorar a performance
          CREATE INDEX memorias_url_path_idx ON public.memorias(url_path);
          CREATE INDEX memorias_user_email_idx ON public.memorias(user_email);
        `
      })
    });

    if (!createTableResponse.ok) {
      throw new Error(`Erro ao criar tabela: ${await createTableResponse.text()}`);
    }

    console.log('Tabela "memorias" criada com sucesso!');

    // 3. Criar políticas de acesso (RLS) para a tabela
    console.log('Configurando políticas de acesso para a tabela...');
    const policyResponse = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      },
      body: JSON.stringify({
        sql_query: `
          -- Habilitar RLS na tabela
          ALTER TABLE public.memorias ENABLE ROW LEVEL SECURITY;

          -- Criar política para permitir acesso anônimo para leitura
          DROP POLICY IF EXISTS "Permitir leitura anônima" ON public.memorias;
          CREATE POLICY "Permitir leitura anônima" ON public.memorias
              FOR SELECT USING (true);

          -- Criar política para permitir inserção anônima
          DROP POLICY IF EXISTS "Permitir inserção anônima" ON public.memorias;
          CREATE POLICY "Permitir inserção anônima" ON public.memorias
              FOR INSERT WITH CHECK (true);

          -- Criar política para permitir atualização anônima
          DROP POLICY IF EXISTS "Permitir atualização anônima" ON public.memorias;
          CREATE POLICY "Permitir atualização anônima" ON public.memorias
              FOR UPDATE USING (true);

          -- Criar política para permitir exclusão anônima
          DROP POLICY IF EXISTS "Permitir exclusão anônima" ON public.memorias;
          CREATE POLICY "Permitir exclusão anônima" ON public.memorias
              FOR DELETE USING (true);
        `
      })
    });

    if (!policyResponse.ok) {
      console.warn('Aviso ao configurar políticas:', await policyResponse.text());
    } else {
      console.log('Políticas de acesso configuradas com sucesso!');
    }

    // 4. Verificar se o bucket de storage existe e, se não, criá-lo
    console.log('Verificando e criando bucket de storage "memorias"...');
    
    // Listar buckets existentes
    const listBucketsResponse = await fetch(`${supabaseUrl}/storage/v1/bucket`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      }
    });

    if (!listBucketsResponse.ok) {
      throw new Error(`Erro ao listar buckets: ${await listBucketsResponse.text()}`);
    }

    const buckets = await listBucketsResponse.json();
    const memoriasBucketExists = buckets.some(bucket => bucket.name === 'memorias');

    if (memoriasBucketExists) {
      console.log('O bucket "memorias" já existe. Recriando...');
      
      // Remover bucket existente
      const deleteBucketResponse = await fetch(`${supabaseUrl}/storage/v1/bucket/memorias`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`
        }
      });

      if (!deleteBucketResponse.ok) {
        console.warn('Aviso ao remover bucket:', await deleteBucketResponse.text());
      } else {
        console.log('Bucket removido com sucesso.');
      }
    }

    // Criar bucket
    const createBucketResponse = await fetch(`${supabaseUrl}/storage/v1/bucket`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      },
      body: JSON.stringify({
        name: 'memorias',
        public: true,
        file_size_limit: 10485760, // 10MB
        allowed_mime_types: ['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/svg+xml']
      })
    });

    if (!createBucketResponse.ok) {
      throw new Error(`Erro ao criar bucket: ${await createBucketResponse.text()}`);
    }

    console.log('Bucket "memorias" criado com sucesso!');

    // 5. Configurar políticas de acesso para o storage
    console.log('Configurando políticas de acesso para o storage...');
    const storagePolicyResponse = await fetch(`${supabaseUrl}/storage/v1/bucket/memorias/policy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      },
      body: JSON.stringify([
        {
          name: 'Permitir leitura pública',
          definition: {
            role: '*',
            operations: ['SELECT']
          }
        },
        {
          name: 'Permitir inserção anônima',
          definition: {
            role: 'anon',
            operations: ['INSERT']
          }
        },
        {
          name: 'Permitir atualização anônima',
          definition: {
            role: 'anon',
            operations: ['UPDATE']
          }
        },
        {
          name: 'Permitir exclusão anônima',
          definition: {
            role: 'anon',
            operations: ['DELETE']
          }
        }
      ])
    });

    if (!storagePolicyResponse.ok) {
      console.warn('Aviso ao configurar políticas do storage:', await storagePolicyResponse.text());
    } else {
      console.log('Políticas de acesso do storage configuradas com sucesso!');
    }

    console.log('===== PROCESSO CONCLUÍDO COM SUCESSO =====');
    console.log('Tabela "memorias", índices e bucket de storage foram configurados.');
    console.log('Você pode agora usar o aplicativo normalmente.');
    
  } catch (error) {
    console.error('ERRO DURANTE O PROCESSO:', error);
  }
}

// Para executar o script:
// 1. Salve este arquivo como recriar_supabase.js
// 2. Instale o pacote node-fetch: npm install node-fetch
// 3. Execute: node recriar_supabase.js

module.exports = { recriarTabela };

// Se executado diretamente (não importado)
if (require.main === module) {
  recriarTabela();
} 