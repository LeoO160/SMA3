# Guia para Deletar Memórias

Este guia explica como excluir memórias da sua aplicação, incluindo tanto os dados quanto as imagens armazenadas no Supabase.

## Excluindo uma memória

1. Acesse a página de administração em `/admin`
2. Digite a senha de administrador para acessar o painel
3. Na lista de memórias, localize a memória que deseja excluir
4. Clique no ícone de lixeira ao lado da memória
5. Confirme a exclusão quando solicitado

## Como a exclusão funciona

Quando você exclui uma memória, o seguinte processo ocorre:

1. **Para memórias no Supabase**:
   - O sistema busca todos os arquivos associados a esta memória no bucket "memorias"
   - Cada arquivo é excluído do Storage do Supabase
   - O registro da memória é removido do banco de dados do Supabase

2. **Para memórias locais (localStorage)**:
   - O registro é simplesmente removido do armazenamento local do navegador

## Solução de problemas

### Erro "Não foi possível excluir arquivos"

Se você receber um erro indicando que não foi possível excluir os arquivos, pode ser devido a um dos seguintes motivos:

1. **Problemas de permissão no Supabase**:
   - Verifique se as políticas de segurança do Supabase permitem exclusão
   - Adicione a seguinte política no console do Supabase:

```sql
-- Política para permitir exclusão anônima" 
ON storage.objects 
FOR DELETE TO anon 
USING (bucket_id = 'memorias');
```

2. **Falha ao listar os arquivos**:
   - O sistema pode não conseguir listar os arquivos na pasta
   - Neste caso, ele tentará extrair as URLs diretamente dos dados da memória
   - Se isso falhar, você pode deletar os arquivos manualmente no console do Supabase

### Arquivos órfãos no Storage

Se houver arquivos que permanecem no Storage mesmo após a exclusão da memória:

1. Acesse o console do Supabase > Storage > bucket "memorias"
2. Navegue até a pasta com o nome do caminho da memória excluída
3. Selecione os arquivos manualmente e clique em "Delete"

## Cuidados importantes

- A exclusão é **permanente** e não pode ser desfeita
- Certifique-se de que deseja realmente excluir a memória antes de confirmar
- Considere fazer um backup das suas memórias importantes antes de excluí-las 