import { createClient } from '@supabase/supabase-js';

// Os valores abaixo devem ser substituídos pelos seus valores reais do Supabase
const supabaseUrl = 'https://zdorqehmnrmzlvwbqabx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpkb3JxZWhtbnJtemx2d2JxYWJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIyNTYyMTksImV4cCI6MjA1NzgzMjIxOX0.oIxNrnVrw7A7ThpDAHbmeplbl_legve6oshZdrH0Oos';

// Criar e exportar o cliente Supabase com debug ativado
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    debug: true
  }
});

// Função para verificar a conexão com o Supabase
export const checkSupabaseConnection = async () => {
  try {
    // Verifica se o cliente Supabase está inicializado
    if (!supabase) {
      throw new Error('Cliente Supabase não inicializado');
    }

    // Tenta fazer uma consulta simples para verificar a conexão
    const { data, error } = await supabase
      .from('memorias')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('Erro ao verificar conexão:', error);
      return { connected: false, error };
    }
    
    return { connected: true };
  } catch (error) {
    console.error('Erro ao verificar conexão:', error);
    return { connected: false, error };
  }
};

// Função para verificar e criar o bucket de armazenamento
export const ensureStorageBucket = async () => {
  try {
    // Verifica se o bucket existe
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets.some(b => b.name === 'memorias');
    
    if (!bucketExists) {
      console.log('Bucket "memorias" não existe. Tentando criar...');
      // Tenta criar o bucket
      const { data: createBucketData, error: createBucketError } = await supabase.storage.createBucket('memorias', {
        public: true,
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/svg+xml'],
        fileSizeLimit: 10485760 // 10MB
      });
      
      if (createBucketError) {
        console.error('Erro ao criar bucket:', createBucketError);
        throw new Error('Falha ao criar bucket de armazenamento');
      }
      
      console.log('Bucket "memorias" criado com sucesso:', createBucketData);
      return true;
    }
    
    return true;
  } catch (error) {
    console.error('Erro ao verificar/criar bucket:', error);
    throw new Error('Erro ao verificar bucket de armazenamento');
  }
};

// Função para fazer upload de uma imagem para o Supabase
export const uploadImage = async (file, folderPath) => {
  try {
    console.log('Iniciando upload de imagem:', { file: typeof file, folderPath });
    
    // Primeiro verifica a conexão com o Supabase
    const { connected } = await checkSupabaseConnection();
    if (!connected) {
      throw new Error('Sem conexão com o servidor');
    }
    
    // Verifica e cria o bucket se necessário
    await ensureStorageBucket();
    
    // Converter blob URL para Blob
    let blob;
    if (typeof file === 'object' && file.file && file.url) {
      // Se recebeu um objeto de memória com file e url
      blob = file.file;
      console.log('Usando arquivo do objeto memory:', { name: file.name, type: file.file.type });
    } else if (file.startsWith('blob:')) {
      try {
        console.log('Convertendo blob URL para Blob');
        const response = await fetch(file);
        if (!response.ok) {
          console.error(`Erro ao buscar blob: ${response.status}`);
          throw new Error(`Erro ao buscar blob: ${response.status}`);
        }
        blob = await response.blob();
        console.log('Blob obtido com sucesso:', { type: blob.type, size: blob.size });
      } catch (error) {
        console.error('Erro ao converter blob URL:', error);
        throw new Error('Falha ao processar a imagem');
      }
    } else if (file.startsWith('data:')) {
      // Se já for base64, converte para Blob
      try {
        console.log('Convertendo base64 para Blob');
        const byteString = atob(file.split(',')[1]);
        const mimeType = file.split(',')[0].split(':')[1].split(';')[0];
        const arrayBuffer = new ArrayBuffer(byteString.length);
        const bytes = new Uint8Array(arrayBuffer);
        
        for (let i = 0; i < byteString.length; i++) {
          bytes[i] = byteString.charCodeAt(i);
        }
        
        blob = new Blob([arrayBuffer], { type: mimeType });
        console.log('Blob criado a partir de base64:', { type: blob.type, size: blob.size });
      } catch (error) {
        console.error('Erro ao converter base64:', error);
        throw new Error('Falha ao processar a imagem em formato base64');
      }
    } else {
      console.error('Formato de arquivo não suportado:', file.substring(0, 30) + '...');
      throw new Error('Formato de arquivo não suportado');
    }
    
    if (!blob) {
      console.error('Não foi possível criar o blob');
      throw new Error('Falha ao processar a imagem');
    }
    
    // Verificar se o blob é válido
    if (!(blob instanceof Blob) || blob.size === 0) {
      console.error('Blob inválido ou vazio:', blob);
      throw new Error('Arquivo inválido ou vazio');
    }
    
    // Gerar nome único para o arquivo com extensão apropriada
    const extension = blob.type.split('/')[1] || 'jpg';
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${extension}`;
    const filePath = `${folderPath}/${fileName}`;
    
    console.log(`Iniciando upload para ${filePath}`);
    
    // Fazer upload para o Supabase com timeout mais longo
    const uploadPromise = supabase.storage
      .from('memorias')
      .upload(filePath, blob, {
        cacheControl: '3600',
        upsert: true, // Substitui se já existir
        contentType: blob.type // Define o tipo de conteúdo explicitamente
      });
    
    // Adiciona um timeout para evitar que a operação fique pendente indefinidamente
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Timeout ao fazer upload')), 30000); // 30 segundos
    });
    
    // Usa race para implementar um timeout
    const { data, error } = await Promise.race([uploadPromise, timeoutPromise]);
    
    if (error) {
      console.error('Erro no upload:', error);
      throw error;
    }
    
    console.log('Upload concluído com sucesso:', data);
    
    // Obter URL pública do arquivo
    const { data: urlData } = supabase.storage
      .from('memorias')
      .getPublicUrl(filePath);
    
    if (!urlData || !urlData.publicUrl) {
      console.error('Erro ao obter URL pública:', urlData);
      throw new Error('Não foi possível obter a URL pública do arquivo');
    }
    
    console.log('URL pública obtida:', urlData.publicUrl);
    return urlData.publicUrl;
  } catch (error) {
    console.error('Erro no upload da imagem:', error);
    throw error; // Propaga o erro para ser tratado pelo componente
  }
};

// Função para salvar os dados da memória no Supabase
export const saveMemory = async (memoryData) => {
  try {
    console.log('Salvando memória no Supabase:', memoryData.urlPath);
    
    // Verificar se estamos conectados ao Supabase
    const { connected } = await checkSupabaseConnection();
    if (!connected) {
      console.error('Sem conexão com Supabase!');
      return { success: false, error: new Error('Sem conexão com o servidor') };
    }
    
    // Prepara os dados para salvar
    const dataToSave = {
      title: memoryData.title,
      title_color: memoryData.titleColor,
      title_bg_color: memoryData.titleBgColor,
      show_title_card: memoryData.showTitleCard,
      style: memoryData.style,
      time_text: memoryData.timeText,
      counter_color: memoryData.counterColor,
      counter_font: memoryData.counterFont,
      counter_bg_color: memoryData.counterBgColor,
      show_counter_card: memoryData.showCounterCard,
      show_animation: memoryData.showAnimation,
      selected_emoji: memoryData.selectedEmoji,
      message: memoryData.message,
      message_color: memoryData.messageColor,
      message_font: memoryData.messageFont,
      message_style: memoryData.messageStyle,
      message_bg_color: memoryData.messageBgColor,
      show_message_card: memoryData.showMessageCard,
      web_bg_color: memoryData.webBgColor,
      music_url: memoryData.musicUrl,
      music_type: memoryData.musicType,
      video_id: memoryData.videoId,
      music_info: memoryData.musicInfo,
      track_id: memoryData.trackId,
      memories: memoryData.memories,
      user_email: memoryData.userEmail,
      created_at: memoryData.createdAt,
      url_path: memoryData.urlPath,
      visual_effect: memoryData.visualEffect,
      selected_theme: memoryData.selectedTheme,
      created_link: memoryData.created_link
    };
    
    // Fazer o upload para o Supabase
    const { data, error } = await supabase
      .from('memorias')
      .insert([dataToSave])
      .select();
    
    if (error) {
      console.error('Erro ao salvar no Supabase:', error);
      return { success: false, error };
    }
    
    console.log('Memória salva com sucesso:', data);
    return { success: true, data: data[0] };
  } catch (error) {
    console.error('Exceção ao salvar memória:', error);
    return { success: false, error };
  }
};

// Função para obter uma memória do Supabase pelo ID da URL
export const getMemoryByUrl = async (urlPath) => {
  try {
    console.log('[getMemoryByUrl] Iniciando busca por urlPath:', urlPath);
    
    // Verificar se o urlPath é válido
    if (!urlPath || typeof urlPath !== 'string') {
      console.error('[getMemoryByUrl] urlPath inválido:', urlPath);
      throw new Error('URL inválida');
    }
    
    // Verificar se o urlPath possui o formato correto (para debug)
    const urlPattern = /^[a-z0-9-]+$/i;
    if (!urlPattern.test(urlPath)) {
      console.warn('[getMemoryByUrl] Formato de urlPath potencialmente problemático:', urlPath);
      // Não lançamos erro aqui, apenas log de aviso
    }
    
    // Verifica a conexão antes de tentar buscar
    const { connected, error: connError } = await checkSupabaseConnection();
    if (!connected) {
      console.error('[getMemoryByUrl] Sem conexão com Supabase:', connError);
      throw new Error('Sem conexão com o servidor');
    }
    
    console.log('[getMemoryByUrl] Conexão com Supabase OK, buscando dados...');
    
    // Busca a memória pelo URL path
    const { data, error } = await supabase
      .from('memorias')
      .select('*')
      .eq('url_path', urlPath)
      .maybeSingle();
    
    if (error) {
      console.error('[getMemoryByUrl] Erro ao buscar memória:', error);
      throw error;
    }
    
    if (!data) {
      console.log('[getMemoryByUrl] Memória não encontrada para urlPath:', urlPath);
      // Tentativa de busca alternativa (para debug)
      console.log('[getMemoryByUrl] Tentando listar registros disponíveis...');
      const { data: allData, error: listError } = await supabase
        .from('memorias')
        .select('url_path')
        .limit(5);
      
      if (!listError && allData?.length > 0) {
        console.log('[getMemoryByUrl] URLs disponíveis:', allData.map(m => m.url_path));
      }
      
      throw new Error('Memória não encontrada');
    }
    
    console.log('[getMemoryByUrl] Memória encontrada:', data.title);
    
    // Mapeia campos do banco de dados para camelCase para uso no frontend
    const memoryData = {
      id: data.id,
      title: data.title,
      titleColor: data.title_color,
      titleBgColor: data.title_bg_color,
      showTitleCard: data.show_title_card,
      style: data.style,
      timeText: data.time_text,
      counterColor: data.counter_color,
      counterFont: data.counter_font,
      counterBgColor: data.counter_bg_color,
      showCounterCard: data.show_counter_card,
      showAnimation: data.show_animation,
      selectedEmoji: data.selected_emoji,
      message: data.message,
      messageColor: data.message_color,
      messageFont: data.message_font,
      messageStyle: data.message_style,
      messageBgColor: data.message_bg_color,
      showMessageCard: data.show_message_card,
      webBgColor: data.web_bg_color,
      musicUrl: data.music_url,
      musicType: data.music_type,
      videoId: data.video_id,
      musicInfo: data.music_info,
      trackId: data.track_id,
      memories: data.memories,
      userEmail: data.user_email,
      createdAt: data.created_at,
      urlPath: data.url_path,
      visualEffect: data.visual_effect,
      selectedTheme: data.selected_theme,
      created_link: data.created_link
    };
    
    return memoryData;
  } catch (error) {
    console.error('Exceção ao buscar memória:', error);
    throw error;
  }
};

// Função para obter a lista de memórias de um usuário
export const getUserMemories = async (userEmail) => {
  try {
    console.log('Buscando memórias do usuário:', userEmail);
    
    // Verificar conexão
    const { connected } = await checkSupabaseConnection();
    if (!connected) {
      console.error('Sem conexão com Supabase!');
      throw new Error('Sem conexão com o servidor');
    }
    
    // Buscar as memórias do usuário
    const { data, error } = await supabase
      .from('memorias')
      .select('*')
      .eq('user_email', userEmail)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Erro ao buscar memórias do usuário:', error);
      throw error;
    }
    
    console.log(`Encontradas ${data.length} memórias para o usuário ${userEmail}`);
    
    // Converter para camelCase
    const memories = data.map(item => ({
      id: item.id,
      title: item.title,
      titleColor: item.title_color,
      titleBgColor: item.title_bg_color,
      showTitleCard: item.show_title_card,
      style: item.style,
      timeText: item.time_text,
      counterColor: item.counter_color,
      counterFont: item.counter_font,
      counterBgColor: item.counter_bg_color,
      showCounterCard: item.show_counter_card,
      showAnimation: item.show_animation,
      selectedEmoji: item.selected_emoji,
      message: item.message,
      messageColor: item.message_color,
      messageFont: item.message_font,
      messageStyle: item.message_style,
      messageBgColor: item.message_bg_color,
      showMessageCard: item.show_message_card,
      webBgColor: item.web_bg_color,
      musicUrl: item.music_url,
      musicType: item.music_type,
      videoId: item.video_id,
      musicInfo: item.music_info,
      trackId: item.track_id,
      memories: item.memories,
      userEmail: item.user_email,
      createdAt: item.created_at,
      urlPath: item.url_path,
      visualEffect: item.visual_effect,
      selectedTheme: item.selected_theme,
      created_link: item.created_link
    }));
    
    return memories;
  } catch (error) {
    console.error('Exceção ao buscar memórias do usuário:', error);
    throw error;
  }
};

// Função para excluir uma memória do Supabase
export const deleteMemory = async (memoryData) => {
  try {
    console.log('Excluindo memória:', memoryData.title, memoryData.id);
    
    // Verificar conexão
    const { connected } = await checkSupabaseConnection();
    if (!connected) {
      console.error('Sem conexão com Supabase!');
      return { success: false, error: new Error('Sem conexão com o servidor') };
    }
    
    // Primeiro exclui imagens associadas, se existirem
    if (memoryData.memories && memoryData.memories.length > 0) {
      console.log(`Excluindo ${memoryData.memories.length} imagens associadas`);
      
      // Buscar a lista de arquivos na pasta da memória
      const folderPath = `memorias/${memoryData.urlPath}`;
      console.log('Buscando arquivos na pasta:', folderPath);
      
      const { data: files, error: listError } = await supabase.storage
        .from('memorias')
        .list(folderPath);
      
      if (listError) {
        console.error('Erro ao listar arquivos da pasta:', listError);
      } else if (files && files.length > 0) {
        console.log(`Encontrados ${files.length} arquivos para excluir:`, files.map(f => f.name));
        
        // Criar um array com caminhos completos de arquivos para excluir
        const filePaths = files.map(file => `${folderPath}/${file.name}`);
        
        // Excluir os arquivos
        const { data: removeData, error: removeError } = await supabase.storage
          .from('memorias')
          .remove(filePaths);
        
        if (removeError) {
          console.error('Erro ao remover arquivos:', removeError);
        } else {
          console.log('Arquivos removidos com sucesso:', removeData);
        }
      } else {
        console.log('Nenhum arquivo encontrado na pasta.');
      }
      
      // Tentar remover o diretório vazio
      try {
        const { error: removeFolderError } = await supabase.storage
          .from('memorias')
          .remove([folderPath]);
        
        if (removeFolderError) {
          console.error('Erro ao remover pasta:', removeFolderError);
        } else {
          console.log('Pasta removida com sucesso.');
        }
      } catch (folderError) {
        console.error('Erro ao tentar remover pasta:', folderError);
      }
    }
    
    // Agora exclui o registro da memória
    const { error } = await supabase
      .from('memorias')
      .delete()
      .eq('id', memoryData.id);
    
    if (error) {
      console.error('Erro ao excluir memória:', error);
      return { success: false, error };
    }
    
    console.log('Memória excluída com sucesso');
    return { success: true };
  } catch (error) {
    console.error('Exceção ao excluir memória:', error);
    return { success: false, error };
  }
};

// Função para verificar o estado do diagnóstico
export const checkDiagnostics = async () => {
  const results = {
    success: true,
    connected: false,
    authenticated: false,
    databaseAccessible: false,
    storageAccessible: false,
    timestamp: new Date().toISOString(),
    errors: []
  };
  
  try {
    // Verificar conexão básica
    try {
      const { data, error } = await supabase.auth.getUser();
      
      if (error) {
        results.errors.push(`Erro de autenticação: ${error.message}`);
      } else {
        results.connected = true;
        results.authenticated = !!data;
        console.log('Status de autenticação:', data);
      }
    } catch (e) {
      results.errors.push(`Erro de conexão: ${e.message}`);
      console.error('Erro ao verificar autenticação:', e);
    }
    
    // Verificar acesso ao banco de dados
    if (results.connected) {
      try {
        const { data, error } = await supabase
          .from('memorias')
          .select('count')
          .limit(1);
        
        if (error) {
          results.errors.push(`Erro ao acessar banco de dados: ${error.message}`);
        } else {
          results.databaseAccessible = true;
        }
      } catch (e) {
        results.errors.push(`Exceção ao acessar banco de dados: ${e.message}`);
        console.error('Exceção ao acessar banco de dados:', e);
      }
    }
    
    // Verifica acesso ao armazenamento
    try {
      const { data: buckets, error: storageError } = await supabase.storage.listBuckets();
      
      if (storageError) {
        results.errors.push(`Erro ao acessar armazenamento: ${storageError.message}`);
      } else {
        results.storageAccessible = true;
        
        // Verifica se o bucket 'memorias' existe
        const memoriasBucket = buckets.find(bucket => bucket.name === 'memorias');
        if (!memoriasBucket) {
          results.errors.push('O bucket de armazenamento "memorias" não existe');
        }
      }
    } catch (e) {
      results.errors.push(`Exceção ao acessar armazenamento: ${e.message}`);
      console.error('Exceção ao acessar armazenamento:', e);
    }
    
  } catch (e) {
    results.errors.push(`Erro geral no diagnóstico: ${e.message}`);
    console.error('Erro geral no diagnóstico:', e);
  }
  
  return results;
};

// Função para reconectar com o Supabase caso haja problemas
export const reconnectSupabase = async () => {
  try {
    console.log('Tentando reconectar com o Supabase...');
    
    // Limpa qualquer cache de autenticação
    await supabase.auth.signOut();
    
    // Força uma nova autenticação anônima
    const { data, error } = await supabase.auth.signInAnonymously();
    
    if (error) {
      console.error('Erro ao reconectar com o Supabase:', error);
      return { success: false, error: error.message };
    }
    
    // Verifica se a conexão foi reestabelecida
    const testConnection = await checkSupabaseConnection();
    
    return { 
      success: testConnection.connected, 
      session: data?.session || null,
      message: testConnection.connected ? 
        'Reconexão bem-sucedida!' : 
        'Reconexão falhou após tentativa de login anônimo.'
    };
  } catch (error) {
    console.error('Exceção ao tentar reconectar:', error);
    return { success: false, error: error.message };
  }
};

// Função para obter todas as memórias com imagens para a Home
export const getMemories = async () => {
  try {
    // Primeiro verifica a conexão com o Supabase
    const { connected, error: connError } = await checkSupabaseConnection();
    if (!connected) {
      console.warn('Sem conexão com o Supabase:', connError);
      return [];
    }
    
    // Buscar todas as memórias
    const { data, error } = await supabase
      .from('memorias')
      .select('id, title, memories, created_at, web_bg_color, selected_theme, visual_effect')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Erro ao buscar memórias:', error);
      return [];
    }
    
    // Processar os resultados para extrair a primeira imagem de cada memória
    return data.map(memory => {
      // Tenta encontrar a primeira imagem válida nos dados da memória
      let image_url = null;
      if (memory.memories && Array.isArray(memory.memories)) {
        // Procura a primeira URL de imagem válida
        for (const url of memory.memories) {
          if (typeof url === 'string' && (url.includes('supabase.co') || url.startsWith('http'))) {
            image_url = url;
            break;
          }
        }
      }
      
      return {
        id: memory.id,
        title: memory.title,
        image_url: image_url,
        created_at: memory.created_at,
        webBgColor: memory.web_bg_color,
        selectedTheme: memory.selected_theme,
        visualEffect: memory.visual_effect
      };
    });
  } catch (err) {
    console.error('Erro ao processar memórias:', err);
    return [];
  }
};

// Função para verificar se um link já existe
export const checkLinkExists = async (urlPath) => {
  try {
    const { data, error } = await supabase
      .from('memorias')
      .select('url_path')
      .eq('url_path', urlPath)
      .maybeSingle();
    
    if (error) {
      console.error('Erro ao verificar link:', error);
      return { exists: false, error };
    }
    
    return { exists: !!data };
  } catch (error) {
    console.error('Exceção ao verificar link:', error);
    return { exists: false, error };
  }
};

// Reexportar função diagnoseSupabaseConnection do arquivo supabaseDiagnostic.js
export { diagnoseSupabaseConnection } from './supabaseDiagnostic.js'; 