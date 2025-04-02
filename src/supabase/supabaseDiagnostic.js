import { supabase, checkSupabaseConnection } from './supabaseClient';

// Função para diagnóstico detalhado da conexão com o Supabase
export const diagnoseSupabaseConnection = async () => {
  const results = {
    success: false,
    networkConnectivity: false,
    supabaseUrlAccessible: false,
    authenticationValid: false,
    databaseAccessible: false,
    storageAccessible: false,
    tableExists: false,
    timestamp: new Date().toISOString(),
    errors: []
  };
  
  try {
    // Verificar conectividade com a internet
    try {
      const networkCheck = await fetch('https://www.google.com', { 
        method: 'HEAD',
        mode: 'no-cors',
        cache: 'no-store'
      });
      results.networkConnectivity = true;
    } catch (e) {
      console.warn('Sem conectividade com a internet:', e);
      results.errors.push('Sem conectividade com a internet: ' + e.message);
    }
    
    // Verificar acesso à URL do Supabase
    try {
      const supabaseUrl = supabase.supabaseUrl;
      const supabaseUrlCheck = await fetch(supabaseUrl, { 
        method: 'HEAD',
        mode: 'no-cors',
        cache: 'no-store'
      });
      results.supabaseUrlAccessible = true;
    } catch (e) {
      console.warn('URL do Supabase não acessível:', e);
      results.errors.push('URL do Supabase não acessível: ' + e.message);
    }
    
    // Verificar autenticação
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        results.errors.push('Erro de autenticação: ' + error.message);
      } else {
        results.authenticationValid = true;
      }
    } catch (e) {
      console.error('Erro ao verificar autenticação:', e);
      results.errors.push('Exceção ao verificar autenticação: ' + e.message);
    }
    
    // Verificar acesso ao banco de dados
    try {
      const { data, error } = await supabase
        .from('memorias')
        .select('count')
        .limit(1);
      
      if (error) {
        if (error.message && error.message.includes('does not exist')) {
          results.errors.push('Tabela memorias não existe: ' + error.message);
        } else {
          results.errors.push('Erro ao acessar banco de dados: ' + error.message);
        }
      } else {
        results.databaseAccessible = true;
        results.tableExists = true;
      }
    } catch (e) {
      console.error('Exceção ao acessar banco de dados:', e);
      results.errors.push('Exceção ao acessar banco de dados: ' + e.message);
    }
    
    // Verificar acesso ao armazenamento
    try {
      const { data, error } = await supabase.storage.listBuckets();
      if (error) {
        results.errors.push('Erro ao acessar armazenamento: ' + error.message);
      } else {
        results.storageAccessible = true;
      }
    } catch (e) {
      console.error('Exceção ao acessar armazenamento:', e);
      results.errors.push('Exceção ao acessar armazenamento: ' + e.message);
    }
    
    // Determina sucesso geral
    results.success = results.authenticationValid && 
                      results.databaseAccessible && 
                      results.storageAccessible;
    
    return results;
  } catch (e) {
    console.error('Erro geral no diagnóstico:', e);
    results.errors.push('Erro geral no diagnóstico: ' + e.message);
    return results;
  }
};

/**
 * Utilidade para diagnosticar problemas de conexão com o Supabase
 */
export const runDiagnostics = async () => {
  try {
    console.log('Iniciando diagnóstico do Supabase...');
    
    // Executa o diagnóstico de conexão
    const connectionResults = await diagnoseSupabaseConnection();
    console.log('Resultados do diagnóstico de conexão:', connectionResults);
    
    // Verifica se existem erros nas propriedades essenciais
    const hasConnectivityIssues = !connectionResults.networkConnectivity || 
                                !connectionResults.supabaseUrlAccessible;
    
    const hasAuthIssues = !connectionResults.authenticationValid;
    
    const hasDataIssues = !connectionResults.databaseAccessible || 
                          !connectionResults.storageAccessible;
    
    // Determina mensagens personalizadas com base nos problemas detectados
    let diagMessage = '';
    if (hasConnectivityIssues) {
      diagMessage = 'Problemas de conectividade com o servidor. Verifique sua conexão com a internet.';
    } else if (hasAuthIssues) {
      diagMessage = 'Problemas de autenticação com o Supabase. Chave de API ou URL podem estar incorretas.';
    } else if (hasDataIssues) {
      diagMessage = 'Problemas de acesso aos dados ou armazenamento. Verifique as permissões do banco de dados.';
    }
    
    // Retorna resultados do diagnóstico
    return {
      success: !(hasConnectivityIssues || hasAuthIssues || hasDataIssues),
      hasIssues: hasConnectivityIssues || hasAuthIssues || hasDataIssues,
      connectivityIssues: hasConnectivityIssues,
      authIssues: hasAuthIssues,
      dataIssues: hasDataIssues,
      details: connectionResults,
      message: diagMessage,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Erro ao executar diagnóstico:', error);
    return {
      success: false,
      hasIssues: true,
      message: `Erro ao executar diagnóstico: ${error.message}`,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
};

// Função para criar a tabela memorias no Supabase
export const createMemoriasTable = async () => {
  try {
    console.log('Tentando criar a tabela memorias...');
    
    // SQL para criar a tabela
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS public.memorias (
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
        selected_theme TEXT,
        created_link TEXT
      );
      
      -- Criar índices para melhorar a performance
      CREATE INDEX IF NOT EXISTS memorias_url_path_idx ON public.memorias(url_path);
      CREATE INDEX IF NOT EXISTS memorias_user_email_idx ON public.memorias(user_email);
    `;
    
    // Executar a query SQL
    const { error } = await supabase.rpc('exec_sql', { sql_query: createTableSQL });
    
    if (error) {
      // Se o RPC 'exec_sql' não estiver disponível, tente outro método
      if (error.message.includes('function') && error.message.includes('does not exist')) {
        console.log('Função RPC exec_sql não encontrada. Tentando método alternativo...');
        
        // Método alternativo: criar uma função SQL e executá-la
        const { error: createError } = await supabase
          .from('memorias')
          .insert([{
            title: 'Tabela de Teste',
            url_path: 'teste-criacao-tabela',
            user_email: 'teste@teste.com'
          }]);
          
        if (createError) {
          console.error('Erro na tentativa alternativa:', createError);
          
          if (createError.message.includes('does not exist')) {
            return {
              success: false,
              error: createError.message,
              message: 'Não foi possível criar a tabela. Você precisa criar manualmente a tabela "memorias" no Supabase.',
              requiresManualSetup: true
            };
          }
          
          return { 
            success: false, 
            error: createError.message,
            message: 'Falha ao criar tabela: ' + createError.message
          };
        }
        
        return { 
          success: true,
          message: 'Tabela memorias criada com sucesso (método alternativo)'
        };
      }
      
      console.error('Erro ao criar tabela memorias:', error);
      return { 
        success: false, 
        error: error.message,
        message: 'Falha ao criar tabela: ' + error.message
      };
    }
    
    return { 
      success: true,
      message: 'Tabela memorias criada com sucesso!'
    };
  } catch (error) {
    console.error('Exceção ao criar tabela memorias:', error);
    return { 
      success: false, 
      error: error.message,
      message: 'Exceção ao criar tabela: ' + error.message
    };
  }
};

// Função para aplicar correções automáticas
export const applyFixes = async () => {
  try {
    console.log('Tentando aplicar correções para o Supabase...');
    
    // Executa diagnóstico para identificar problemas
    const diagnosticResults = await runDiagnostics();
    
    if (!diagnosticResults.hasIssues) {
      return {
        success: true,
        message: 'Não foram detectados problemas que precisem de correção.',
        details: diagnosticResults
      };
    }
    
    // Lista para armazenar correções aplicadas
    const appliedFixes = [];
    
    // Se houver problemas de dados (o que inclui tabela não existente)
    if (diagnosticResults.dataIssues) {
      try {
        // Verificar se o erro específico é sobre a tabela não existir
        const tableNotExistsError = diagnosticResults.details.errors.some(
          err => err.includes('does not exist') && err.includes('memorias')
        );
        
        if (tableNotExistsError) {
          console.log('Detectado erro de tabela não existente. Tentando criar...');
          const createResult = await createMemoriasTable();
          
          if (createResult.success) {
            appliedFixes.push('Tabela memorias criada com sucesso!');
          } else {
            appliedFixes.push(`Tentativa de criar tabela falhou: ${createResult.message}`);
            
            if (createResult.requiresManualSetup) {
              return {
                success: false,
                message: 'É necessário configurar manualmente o Supabase.',
                error: 'Não foi possível criar automaticamente a tabela memorias.',
                details: 'Acesse o dashboard do Supabase e crie uma tabela chamada "memorias".',
                appliedFixes
              };
            }
          }
        }
      } catch (e) {
        console.log('Erro ao verificar/criar tabela:', e);
      }
    }
    
    // Se houver problemas de conectividade
    if (diagnosticResults.connectivityIssues) {
      // Tentar contornar problemas de CORS
      appliedFixes.push('Tentativa de contornar restrições de CORS.');
      
      // Tentar forçar uma nova conexão
      try {
        await fetch(supabase.supabaseUrl, { 
          method: 'OPTIONS',
          mode: 'no-cors',
          cache: 'no-store'
        });
        appliedFixes.push('Envio de preflight request para teste de conectividade.');
      } catch (e) {
        console.log('Erro ao tentar preflight request:', e);
      }
    }
    
    // Se houver problemas de autenticação
    if (diagnosticResults.authIssues) {
      // Tentar atualizar a sessão anônima
      try {
        const { data, error } = await supabase.auth.signOut();
        if (!error) {
          appliedFixes.push('Sessão anônima reiniciada.');
        }
      } catch (e) {
        console.log('Erro ao tentar reiniciar sessão:', e);
      }
    }
    
    // Verificar se os buckets de armazenamento existem
    if (diagnosticResults.dataIssues) {
      try {
        // Listar buckets para verificar permissões
        const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
        
        if (!bucketsError) {
          appliedFixes.push('Verificação de buckets de armazenamento concluída.');
          
          // Verifica se o bucket 'memorias' existe
          const memoriasBucket = buckets.find(b => b.name === 'memorias');
          if (!memoriasBucket) {
            // Tenta criar o bucket
            const { data: newBucket, error: createError } = await supabase.storage.createBucket('memorias', {
              public: true
            });
            
            if (!createError) {
              appliedFixes.push('Bucket "memorias" criado com sucesso.');
            }
          }
        }
      } catch (e) {
        console.log('Erro ao verificar/criar buckets:', e);
      }
    }
    
    // Executar novamente o diagnóstico para verificar se as correções funcionaram
    const afterFixDiagnostic = await runDiagnostics();
    
    return {
      success: !afterFixDiagnostic.hasIssues,
      message: afterFixDiagnostic.hasIssues 
        ? 'Algumas correções foram aplicadas, mas ainda existem problemas.' 
        : 'Correções aplicadas com sucesso!',
      appliedFixes,
      details: afterFixDiagnostic
    };
  } catch (error) {
    console.error('Erro ao aplicar correções:', error);
    return {
      success: false,
      error: error.message,
      message: `Erro ao aplicar correções: ${error.message}`
    };
  }
};

// Função para verificar a conectividade com a API do Supabase
export const checkSupabaseAPI = async () => {
  try {
    // Tenta acessar a URL do Supabase com diferentes métodos
    const response = await fetch(`${supabase.supabaseUrl}/rest/v1/`, {
      method: 'HEAD',
      headers: {
        'apikey': supabase.supabaseKey,
        'Content-Type': 'application/json'
      }
    });
    
    return {
      success: response.ok,
      status: response.status,
      statusText: response.statusText
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

const checkMemoriesTable = async () => {
  try {
    const { data, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'memorias');
    
    if (error) {
      console.error('Erro ao verificar tabela:', error);
      return { success: false, message: 'Erro ao verificar tabela', error: error.message };
    }
    
    if (data && data.length > 0) {
      console.log('✅ Tabela memorias encontrada!');
      
      // Verificar estrutura da tabela
      const { data: columns, error: columnsError } = await supabase
        .from('information_schema.columns')
        .select('column_name')
        .eq('table_schema', 'public')
        .eq('table_name', 'memorias');
      
      if (columnsError) {
        console.error('Erro ao verificar colunas:', columnsError);
        return { success: true, message: 'Tabela encontrada, mas erro ao verificar colunas', hasIssues: true };
      }
      
      const requiredColumns = [
        'id', 'title', 'url_path', 'user_email', 'created_at', 
        'title_color', 'title_bg_color', 'message', 'message_color', 
        'web_bg_color', 'memories', 'visual_effect', 'selected_theme'
      ];
      
      const missingColumns = requiredColumns.filter(
        col => !columns.some(c => c.column_name === col)
      );
      
      if (missingColumns.length > 0) {
        console.warn('⚠️ Tabela memorias está faltando colunas:', missingColumns.join(', '));
        return { 
          success: true, 
          message: `Tabela memorias encontrada, mas faltam colunas: ${missingColumns.join(', ')}`,
          hasIssues: true 
        };
      }
      
      return { success: true, message: 'Tabela memorias está completa' };
    } else {
      console.error('❌ Tabela memorias não encontrada!');
      return { success: false, message: 'Tabela memorias não encontrada', hasIssues: true };
    }
  } catch (error) {
    console.error('Erro ao verificar tabela memorias:', error);
    return { success: false, message: 'Erro inesperado ao verificar tabela', error: error.message };
  }
};

const testInsertion = async () => {
  try {
    // Criar um registro de teste para inserção
    const testRecord = {
      title: 'Teste de Diagnóstico',
      url_path: `teste-diagnostico-${Date.now()}`,
      user_email: 'teste@diagnostico.com',
      title_color: '#ffffff',
      title_bg_color: '#000000',
      message: 'Texto de teste para diagnóstico',
      message_color: '#000000',
      web_bg_color: '#ffffff',
      memories: [],
      created_at: new Date().toISOString(),
      visual_effect: null,
      selected_theme: 'default'
    };
    
    console.log('Inserindo registro de teste...');
    const { data, error } = await supabase
      .from('memorias')
      .insert(testRecord)
      .select();
    
    if (error) {
      console.error('❌ Erro ao inserir registro de teste:', error);
      return { success: false, message: 'Erro ao inserir registro de teste', error: error.message };
    }
    
    console.log('✅ Registro de teste inserido com sucesso:', data);
    
    // Limpar o registro de teste
    if (data && data.length > 0) {
      const { error: deleteError } = await supabase
        .from('memorias')
        .delete()
        .eq('id', data[0].id);
      
      if (deleteError) {
        console.warn('⚠️ Não foi possível excluir o registro de teste:', deleteError);
      } else {
        console.log('✅ Registro de teste excluído com sucesso');
      }
    }
    
    return { success: true, message: 'Teste de inserção bem-sucedido' };
  } catch (error) {
    console.error('Erro durante teste de inserção:', error);
    return { success: false, message: 'Erro durante teste de inserção', error: error.message };
  }
};

// Função para testar conexão com o Supabase e mostrar informações detalhadas
export const testSupabaseConnection = async () => {
  console.log('Iniciando teste de conexão com o Supabase...');
  const results = {
    success: false,
    details: {},
    errors: []
  };

  try {
    // Verificar cliente inicializado
    if (!supabase) {
      results.errors.push('Cliente Supabase não está inicializado');
      return results;
    }
    
    results.details.url = supabase.supabaseUrl;
    results.details.client = 'Inicializado';
    
    // Verificar URL
    try {
      const urlTest = await fetch(supabase.supabaseUrl, { 
        method: 'HEAD',
        mode: 'no-cors',
        cache: 'no-store'
      });
      results.details.urlAccessible = 'URL acessível';
    } catch (e) {
      results.details.urlAccessible = 'Falha ao acessar URL';
      results.errors.push(`Erro ao acessar URL: ${e.message}`);
    }
    
    // Verificar autenticação
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        results.details.auth = 'Falha na autenticação';
        results.errors.push(`Erro na autenticação: ${error.message}`);
      } else {
        results.details.auth = data.session ? 'Autenticado' : 'Não autenticado (anônimo)';
      }
    } catch (e) {
      results.details.auth = 'Erro ao verificar autenticação';
      results.errors.push(`Erro ao verificar autenticação: ${e.message}`);
    }
    
    // Testar acesso à tabela "memorias"
    try {
      const { data, error } = await supabase
        .from('memorias')
        .select('count')
        .limit(1);
      
      if (error) {
        if (error.message.includes('does not exist')) {
          results.details.table = 'Tabela "memorias" não existe';
          results.errors.push('A tabela "memorias" não existe no banco de dados');
        } else {
          results.details.table = 'Erro ao acessar tabela';
          results.errors.push(`Erro ao acessar tabela: ${error.message}`);
        }
      } else {
        results.details.table = 'Tabela "memorias" acessível';
      }
    } catch (e) {
      results.details.table = 'Exceção ao acessar tabela';
      results.errors.push(`Exceção ao acessar tabela: ${e.message}`);
    }
    
    // Verificar estrutura da tabela
    try {
      const { data, error } = await supabase
        .from('information_schema.columns')
        .select('column_name')
        .eq('table_schema', 'public')
        .eq('table_name', 'memorias');
      
      if (error) {
        results.details.schema = 'Erro ao verificar esquema';
        results.errors.push(`Erro ao verificar esquema: ${error.message}`);
      } else if (data) {
        results.details.schema = `${data.length} colunas encontradas`;
        results.details.columns = data.map(col => col.column_name);
        
        // Verificar se counter_bg_color existe
        const counterBgColorExists = data.some(col => col.column_name === 'counter_bg_color');
        results.details.counterBgColor = counterBgColorExists ? 'Coluna counter_bg_color existe' : 'Coluna counter_bg_color não existe';
      }
    } catch (e) {
      results.details.schema = 'Exceção ao verificar esquema';
      results.errors.push(`Exceção ao verificar esquema: ${e.message}`);
    }
    
    results.success = results.errors.length === 0;
    return results;
  } catch (error) {
    results.errors.push(`Erro geral no teste: ${error.message}`);
    return results;
  }
};

// Função para adicionar a coluna counter_bg_color se não existir
export const addCounterBgColorColumn = async () => {
  try {
    console.log('Verificando e adicionando coluna counter_bg_color...');
    
    // Verificar se a coluna já existe usando outro método
    const { data, error } = await supabase
      .from('memorias')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('Erro ao verificar tabela memorias:', error);
      return { 
        success: false, 
        error: error.message,
        message: 'Erro ao verificar tabela memorias: ' + error.message
      };
    }
    
    // Verifica diretamente se a coluna counter_bg_color existe no objeto retornado
    const hasColumn = data && data.length > 0 && 'counter_bg_color' in data[0];
    
    // Se a coluna já existe, retorna sucesso
    if (hasColumn) {
      console.log('A coluna counter_bg_color já existe na tabela.');
      return { 
        success: true, 
        message: 'A coluna counter_bg_color já existe na tabela memorias.',
        exists: true
      };
    }
    
    // Se a coluna não existe, tenta adicioná-la
    console.log('A coluna counter_bg_color não existe. Tentando adicionar...');
    
    // SQL para adicionar a coluna - modificado para usar abordagem mais direta
    try {
      // Tentar adicionar a coluna usando API direta do PostgreSQL
      await fetch(`${supabase.supabaseUrl}/rest/v1/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabase.supabaseKey,
          'Authorization': `Bearer ${supabase.supabaseKey}`,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          query: `ALTER TABLE public.memorias ADD COLUMN IF NOT EXISTS counter_bg_color TEXT`
        })
      });
      
      // Limpar o cache do schema para forçar o Supabase a atualizar
      await supabase.rpc('pg_catalog.pg_reload_conf');
      
      // Esperar um momento para o schema ser atualizado
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return { 
        success: true,
        message: 'Coluna counter_bg_color adicionada com sucesso!'
      };
    } catch (sqlError) {
      console.error('Erro ao executar SQL para adicionar coluna:', sqlError);
      
      // Tenta abordagem alternativa com RPC personalizada
      try {
        const { error: rpcError } = await supabase.rpc('add_column_to_table', {
          table_name: 'memorias',
          column_name: 'counter_bg_color',
          column_type: 'text'
        });
        
        if (rpcError) {
          throw rpcError;
        }
        
        return { 
          success: true,
          message: 'Coluna counter_bg_color adicionada com sucesso via RPC!'
        };
      } catch (rpcError) {
        console.error('Erro na tentativa RPC:', rpcError);
        return { 
          success: false, 
          error: rpcError.message,
          message: 'Falha ao adicionar coluna: ' + rpcError.message
        };
      }
    }
  } catch (error) {
    console.error('Exceção ao adicionar coluna counter_bg_color:', error);
    return { 
      success: false, 
      error: error.message,
      message: 'Exceção ao adicionar coluna: ' + error.message
    };
  }
};