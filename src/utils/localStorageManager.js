/**
 * Utilitário para gerenciar o armazenamento local dos dados do formulário
 */

const STORAGE_KEY = 'memorial_form_data';
const LAST_STEP_KEY = 'memorial_last_step';
const MEMORIES_KEY = 'memorial_memories';

/**
 * Salva os dados do formulário no localStorage
 * @param {Object} data - Dados do formulário para salvar
 */
export const saveFormData = (data) => {
  try {
    // Trata as memórias separadamente
    const dataToSave = { ...data };
    
    // Se houver memórias, remove do objeto principal e salva separadamente
    if (data.memories && data.memories.length > 0) {
      const memoriesMetadata = data.memories.map((memory, index) => {
        // Se for um objeto com URL, armazena apenas o índice para referência
        if (typeof memory === 'object' && memory.url) {
          // Salva a URL blob em armazenamento específico
          try {
            if (memory.url.startsWith('blob:')) {
              localStorage.setItem(`${MEMORIES_KEY}_${index}`, memory.url);
              return { index, name: memory.name || `imagem_${index}` };
            }
          } catch (err) {
            console.error('Erro ao salvar imagem blob:', err);
          }
        }
        return memory;
      });
      
      // Atualiza o objeto principal com apenas os metadados
      dataToSave.memories = memoriesMetadata;
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  } catch (error) {
    console.error('Erro ao salvar dados no localStorage:', error);
  }
};

/**
 * Salva o último passo do fluxo onde o usuário estava
 * @param {number|string} step - Passo/etapa atual do formulário
 */
export const saveLastStep = (step) => {
  try {
    localStorage.setItem(LAST_STEP_KEY, step);
  } catch (error) {
    console.error('Erro ao salvar o último passo no localStorage:', error);
  }
};

/**
 * Recupera os dados do formulário do localStorage
 * @returns {Object|null} Dados do formulário ou null se não existirem
 */
export const getFormData = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return null;
    
    const parsedData = JSON.parse(data);
    
    // Reconstitui as memórias se existirem
    if (parsedData.memories && Array.isArray(parsedData.memories)) {
      parsedData.memories = parsedData.memories.map((memory, idx) => {
        // Se for uma referência de índice, tenta recuperar a URL blob
        if (typeof memory === 'object' && memory.index !== undefined) {
          const blobUrl = localStorage.getItem(`${MEMORIES_KEY}_${memory.index}`);
          if (blobUrl) {
            return {
              url: blobUrl,
              name: memory.name || `imagem_${memory.index}`
            };
          }
        }
        return memory;
      });
    }
    
    return parsedData;
  } catch (error) {
    console.error('Erro ao recuperar dados do localStorage:', error);
    return null;
  }
};

/**
 * Recupera o último passo onde o usuário estava
 * @returns {number|string|null} Último passo ou null se não existir
 */
export const getLastStep = () => {
  try {
    return localStorage.getItem(LAST_STEP_KEY);
  } catch (error) {
    console.error('Erro ao recuperar o último passo do localStorage:', error);
    return null;
  }
};

/**
 * Verifica se existem dados salvos no localStorage
 * @returns {boolean} true se existirem dados salvos
 */
export const hasStoredData = () => {
  return !!getFormData();
};

/**
 * Limpa todos os dados salvos no localStorage
 */
export const clearStoredData = () => {
  try {
    // Limpa os dados principais
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(LAST_STEP_KEY);
    
    // Limpa as memórias armazenadas
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(MEMORIES_KEY)) {
        keysToRemove.push(key);
      }
    }
    
    // Remove cada chave em um loop separado para evitar problemas de indexação
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.error('Erro ao limpar dados do localStorage:', error);
  }
};

/**
 * Salva dados parciais sem sobrescrever todo o objeto
 * @param {Object} partialData - Dados parciais para atualizar
 */
export const updateFormData = (partialData) => {
  try {
    const currentData = getFormData() || {};
    const updatedData = { ...currentData, ...partialData };
    saveFormData(updatedData);
  } catch (error) {
    console.error('Erro ao atualizar dados no localStorage:', error);
  }
};

export default {
  saveFormData,
  saveLastStep,
  getFormData,
  getLastStep,
  hasStoredData,
  clearStoredData,
  updateFormData
}; 