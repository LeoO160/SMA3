import fetch from 'node-fetch';

// Configuração do Supabase
const supabaseUrl = 'https://zdorqehmnrmzlvwbqabx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpkb3JxZWhtbnJtemx2d2JxYWJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIyNTYyMTksImV4cCI6MjA1NzgzMjIxOX0.oIxNrnVrw7A7ThpDAHbmeplbl_legve6oshZdrH0Oos';

async function runMigration() {
  console.log('Iniciando migração para adicionar coluna created_link...');

  try {
    // Ler o arquivo SQL
    const sqlQuery = `
      -- Verifica se a coluna created_link existe na tabela memorias
      DO $$
      DECLARE
          column_exists BOOLEAN;
      BEGIN
          -- Verifica se a coluna existe
          SELECT COUNT(*) > 0 INTO column_exists
          FROM information_schema.columns
          WHERE table_name = 'memorias'
          AND column_name = 'created_link';

          -- Se a coluna não existir, cria ela
          IF NOT column_exists THEN
              -- Adicionar a coluna created_link
              EXECUTE 'ALTER TABLE memorias ADD COLUMN created_link TEXT';
              RAISE NOTICE 'Coluna created_link foi criada com sucesso na tabela memorias.';
          ELSE
              RAISE NOTICE 'A coluna created_link já existe na tabela memorias.';
          END IF;
      END $$;

      -- Teste para confirmar que a coluna existe após a operação
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'memorias'
      AND column_name = 'created_link';
    `;

    // Executar a query SQL
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      },
      body: JSON.stringify({
        sql_query: sqlQuery
      })
    });

    if (!response.ok) {
      throw new Error(`Erro ao executar migração: ${await response.text()}`);
    }

    const result = await response.json();
    console.log('Migração concluída com sucesso!');
    console.log('Resultado:', result);

  } catch (error) {
    console.error('Erro durante a migração:', error);
  }
}

// Executar a migração
runMigration(); 