const fs = require('fs');
const path = require('path');

// Lista de arquivos JSX a verificar
const filesToCheck = [
  'src/components/EffectsSelector.jsx',
  'src/components/VisualEffects.jsx',
  'src/components/ThemeSelector.jsx',
  'src/components/TitlePreview.jsx',
  'src/components/YoutubeAutoplayHelper.jsx',
  'src/pages/Home.jsx',
  'src/pages/Create.jsx',
  'src/pages/Memory.jsx',
  'src/pages/Admin.jsx'
];

console.log('Iniciando diagnóstico de arquivos...');

// Verificar blocos mal fechados e código duplicado
filesToCheck.forEach(filePath => {
  try {
    const fullPath = path.resolve(process.cwd(), filePath);
    if (!fs.existsSync(fullPath)) {
      console.log(`Arquivo não encontrado: ${filePath}`);
      return;
    }
    
    const content = fs.readFileSync(fullPath, 'utf8');
    const lines = content.split('\n');
    
    console.log(`\nAnalisando: ${filePath}`);
    
    // Verificar padrões de erro comuns
    const exportDefaultCount = (content.match(/export default/g) || []).length;
    if (exportDefaultCount > 1) {
      console.log(`  ERRO: Múltiplos 'export default' encontrados (${exportDefaultCount})`);
    }
    
    // Verificar chaves não balanceadas
    let openBraces = 0;
    let closeBraces = 0;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Contar chaves de abertura
      const openCount = (line.match(/{/g) || []).length;
      openBraces += openCount;
      
      // Contar chaves de fechamento
      const closeCount = (line.match(/}/g) || []).length;
      closeBraces += closeCount;
    }
    
    if (openBraces !== closeBraces) {
      console.log(`  ERRO: Chaves não balanceadas! Abertura: ${openBraces}, Fechamento: ${closeBraces}`);
    } else {
      console.log(`  Chaves balanceadas: ${openBraces} abertas e ${closeBraces} fechadas`);
    }
    
    // Verificar blocos duplicados (simplificado)
    const functionalComponentMatch = content.match(/export default (function \w+|\(\s*{)/);
    if (functionalComponentMatch) {
      const componentStart = content.indexOf(functionalComponentMatch[0]);
      const firstClosingBrace = content.lastIndexOf('};');
      
      if (firstClosingBrace > 0 && firstClosingBrace < content.length - 3) {
        console.log(`  ERRO: Código após o fechamento da função do componente (linha aproximada: ${
          content.substring(0, firstClosingBrace).split('\n').length
        })`);
      }
    }
    
  } catch (error) {
    console.log(`Erro ao analisar ${filePath}:`, error.message);
  }
});

console.log('\nDiagnóstico concluído!'); 