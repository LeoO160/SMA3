import { uploadImage, ensureStorageBucket } from './supabaseClient.js';
import fs from 'fs';
import path from 'path';

// Função para converter uma imagem em base64
function imageToBase64(filePath) {
  try {
    // Lê o arquivo como buffer
    const buffer = fs.readFileSync(filePath);
    // Converte para base64
    const base64Image = `data:image/jpeg;base64,${buffer.toString('base64')}`;
    return base64Image;
  } catch (error) {
    console.error('Erro ao converter imagem para base64:', error);
    return null;
  }
}

async function testUpload() {
  console.log('Iniciando teste de upload de imagem...');
  
  try {
    // Verifica se o bucket existe
    console.log('Verificando bucket...');
    await ensureStorageBucket();
    
    // Caminho para uma imagem de teste
    // Você precisa ter uma imagem JPG neste caminho ou ajustar o caminho
    const imagePath = path.resolve('./src/public/test-image.jpg');
    
    // Verifica se a imagem existe
    if (!fs.existsSync(imagePath)) {
      console.error(`A imagem de teste não foi encontrada em: ${imagePath}`);
      return;
    }
    
    // Converte a imagem para base64
    console.log('Convertendo imagem para base64...');
    const base64Image = imageToBase64(imagePath);
    if (!base64Image) {
      console.error('Falha ao converter imagem para base64');
      return;
    }
    
    // Testa o upload
    console.log('Fazendo upload da imagem...');
    try {
      const imageUrl = await uploadImage(base64Image, 'test-upload');
      
      console.log('✅ Upload realizado com sucesso!');
      console.log('URL da imagem:', imageUrl);
    } catch (uploadError) {
      console.log('❌ Falha no upload da imagem:');
      console.log('Erro:', uploadError.message);
    }
  } catch (error) {
    console.error('Erro durante o teste de upload:', error);
  }
}

// Executa o teste
testUpload(); 