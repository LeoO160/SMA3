import { checkSupabaseConnection, ensureStorageBucket } from './supabaseClient.js';

async function testConnection() {
  console.log('Iniciando teste de conexão com o Supabase...');
  
  try {
    // Testa a conexão básica
    const connectionResult = await checkSupabaseConnection();
    console.log('Resultado do teste de conexão:', connectionResult);
    
    // Testa a criação/verificação do bucket
    const bucketResult = await ensureStorageBucket();
    console.log('Resultado do teste do bucket:', bucketResult);
    
    if (connectionResult.connected && bucketResult) {
      console.log('✅ Todos os testes passaram com sucesso!');
      console.log('- Conexão com o Supabase está funcionando');
      console.log('- Bucket "memorias" está configurado corretamente');
    } else {
      console.log('❌ Alguns testes falharam:');
      if (!connectionResult.connected) {
        console.log('- Falha na conexão com o Supabase');
        console.log('Erro:', connectionResult.error);
      }
      if (!bucketResult) {
        console.log('- Falha na configuração do bucket');
      }
    }
  } catch (error) {
    console.error('Erro durante os testes:', error);
  }
}

// Executa os testes
testConnection(); 