// Este é um script para recriar a tabela no Supabase
// Utilizando ESM (ECMAScript Modules)

import fetch from 'node-fetch';

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
            message_style TEXT,
            message_bg_color TEXT,
            show_message_card BOOLEAN,
            web_bg_color TEXT,
            music_url TEXT,
            music_type TEXT,
            video_id TEXT,
            music_info JSONB,
            track_id TEXT,
            memories JSONB,
            created_at TIMESTAMP DEFAULT NOW(),
            visual_effect TEXT,
            selected_theme TEXT
          );
          
          CREATE INDEX idx_memorias_url_path ON public.memorias(url_path);
          CREATE INDEX idx_memorias_user_email ON public.memorias(user_email);
          CREATE INDEX idx_memorias_created_at ON public.memorias(created_at);
        `
      })
    });

    if (!createTableResponse.ok) {
      throw new Error(`Erro ao criar tabela: ${await createTableResponse.text()}`);
    }

    console.log('Tabela "memorias" criada com sucesso!');

    // 3. Configurar Storage - Verificar se o bucket existe e criar se não existir
    console.log('Verificando e configurando Storage...');
    
    // Primeiro verificar buckets existentes
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
      console.log('Bucket "memorias" já existe.');
    } else {
      console.log('Criando bucket "memorias"...');
      
      // Criar o bucket
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
          file_size_limit: 10485760  // 10MB
        })
      });

      if (!createBucketResponse.ok) {
        throw new Error(`Erro ao criar bucket: ${await createBucketResponse.text()}`);
      }

      console.log('Bucket "memorias" criado com sucesso!');

      // Configurar políticas de acesso público ao bucket
      console.log('Configurando políticas de acesso ao bucket...');
      
      // Política para leitura pública
      const readPolicyResponse = await fetch(`${supabaseUrl}/storage/v1/policies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`
        },
        body: JSON.stringify({
          name: 'Public Read',
          definition: {
            bucket_id: 'memorias',
            operation: 'READ',
            expression: 'true'
          }
        })
      });

      if (!readPolicyResponse.ok) {
        console.warn('Aviso ao configurar política de leitura:', await readPolicyResponse.text());
      }

      // Política para inserção autenticada
      const insertPolicyResponse = await fetch(`${supabaseUrl}/storage/v1/policies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`
        },
        body: JSON.stringify({
          name: 'Authenticated Insert',
          definition: {
            bucket_id: 'memorias',
            operation: 'INSERT',
            expression: 'true' // ou uma condição como 'authenticated'
          }
        })
      });

      if (!insertPolicyResponse.ok) {
        console.warn('Aviso ao configurar política de inserção:', await insertPolicyResponse.text());
      }
    }

    console.log('\nConfiguração completa!');
    console.log('Tabela "memorias" e storage configurados com sucesso.');
    console.log('\nAgora você pode iniciar o aplicativo Memories');

  } catch (error) {
    console.error('Erro durante o processo de configuração:', error);
    console.error('Detalhes:', error.message);
  }
}

// Executar a função
recriarTabela().catch(error => {
  console.error('Erro fatal:', error);
}); 