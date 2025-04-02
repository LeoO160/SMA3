const fs = require('fs');
const path = require('path');

// Lista de arquivos JSX a corrigir
const filesToFix = [
  'src/components/TitlePreview.jsx'
];

console.log('Iniciando correção automática...');

// Corrigir problemas comuns
filesToFix.forEach(filePath => {
  try {
    const fullPath = path.resolve(process.cwd(), filePath);
    if (!fs.existsSync(fullPath)) {
      console.log(`Arquivo não encontrado: ${filePath}`);
      return;
    }
    
    console.log(`\nCorrigindo: ${filePath}`);
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Encontrar o bloco principal do componente
    const componentMatch = content.match(/export default function \w+\s*\(([^)]*)\)\s*{/);
    
    if (componentMatch) {
      // Encontrar a posição do fechamento do componente (último return seguido de fechamento)
      const lastReturnIndex = content.lastIndexOf('return (');
      
      if (lastReturnIndex > 0) {
        // Procurar o fechamento do return após o último return
        let depth = 0;
        let endPosition = -1;
        
        for (let i = lastReturnIndex + 7; i < content.length; i++) {
          if (content[i] === '(') depth++;
          if (content[i] === ')') {
            if (depth === 0) {
              // Encontramos o fechamento do return
              endPosition = i;
              break;
            }
            depth--;
          }
        }
        
        if (endPosition > 0) {
          // Procurar a primeira chave de fechamento após o fechamento do return
          for (let i = endPosition + 1; i < content.length; i++) {
            if (content[i] === '}') {
              // Truncar o arquivo após este ponto + algumas linhas em branco
              const newContent = content.substring(0, i + 1) + '\n';
              
              // Verificar se o conteúdo foi modificado
              if (newContent !== content) {
                fs.writeFileSync(fullPath, newContent);
                console.log(`  Arquivo corrigido: código duplicado após o fechamento da função foi removido`);
              } else {
                console.log(`  Nenhuma correção necessária`);
              }
              break;
            }
          }
        }
      }
    }
  } catch (error) {
    console.log(`Erro ao corrigir ${filePath}:`, error.message);
  }
});

console.log('\nCorreção automática concluída!'); 