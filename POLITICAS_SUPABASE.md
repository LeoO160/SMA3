# Políticas de Segurança do Supabase

Este guia explica como configurar corretamente as políticas de segurança no Supabase para que a aplicação funcione adequadamente, especialmente para operações de exclusão.

## Problema: "Não consigo excluir memórias do Supabase"

Se você estiver enfrentando problemas para excluir memórias no Supabase, é provável que seja necessário configurar as políticas de RLS (Row Level Security) adequadamente.

## Configuração de Políticas

Acesse o Dashboard do Supabase e execute os seguintes passos:

### 1. Políticas para o Bucket de Storage

1. Acesse a seção **Storage** no menu lateral
2. Selecione o bucket **memorias** (ou crie-o se ainda não existir)
3. Vá para a aba **Policies**
4. Adicione as seguintes políticas:

#### Política para permitir leitura anônima
```sql
CREATE POLICY "Política de Leitura Pública"
ON storage.objects
FOR SELECT
TO anon
USING (bucket_id = 'memorias');
```

#### Política para permitir inserção anônima
```sql
CREATE POLICY "Política de Inserção Pública"
ON storage.objects
FOR INSERT
TO anon
WITH CHECK (bucket_id = 'memorias');
```

#### Política para permitir exclusão anônima (IMPORTANTE!)
```sql
CREATE POLICY "Política de Exclusão Pública"
ON storage.objects
FOR DELETE
TO anon
USING (bucket_id = 'memorias');
```

### 2. Políticas para a Tabela Memories

1. Acesse a seção **Table Editor** no menu lateral
2. Selecione a tabela **memories**
3. Vá para a aba **Policies**
4. Adicione as seguintes políticas:

#### Política para permitir leitura anônima
```sql
CREATE POLICY "Política de Leitura Pública"
ON public.memories
FOR SELECT
TO anon
USING (true);
```

#### Política para permitir inserção anônima
```sql
CREATE POLICY "Política de Inserção Pública"
ON public.memories
FOR INSERT
TO anon
WITH CHECK (true);
```

#### Política para permitir exclusão anônima (IMPORTANTE!)
```sql
CREATE POLICY "Política de Exclusão Pública"
ON public.memories
FOR DELETE
TO anon
USING (true);
```

## Verificando se as Políticas Estão Ativas

Para verificar se as políticas estão ativas, execute as seguintes consultas no SQL Editor do Supabase:

### Para verificar políticas do Storage
```sql
SELECT * FROM storage.policies WHERE bucket_id = 'memorias';
```

### Para verificar políticas da tabela memories
```sql
SELECT * FROM pg_policies WHERE tablename = 'memories';
```

## Problemas Comuns

### 1. Erro de permissão ao excluir
Se receber um erro como "Permission denied", é sinal de que falta a política de exclusão.

### 2. Arquivos não são excluídos
Se os arquivos não forem excluídos, mas o registro da memória for removido, é provável que seja um problema de política no Storage. Verifique se a política de DELETE está configurada corretamente.

### 3. Erro 404 ao tentar excluir arquivos
Isso pode acontecer se o caminho do arquivo estiver incorreto ou se ele não existir mais. 
A solução é garantir que a sua função de exclusão seja resiliente a erros ao excluir arquivos.

## Teste Manual para Verificar Permissões

Execute este código no console do navegador para testar se você tem permissão para excluir:

```javascript
const { data, error } = await supabase
  .from('memories')
  .delete()
  .eq('id', ID_DA_MEMORIA);
console.log({ data, error });
```

Substitua `ID_DA_MEMORIA` pelo ID real da memória que você deseja excluir.

## Conclusão

Configurar corretamente as políticas de RLS do Supabase é essencial para que as operações de exclusão funcionem adequadamente. Certifique-se de adicionar todas as políticas necessárias para leitura, inserção e, principalmente, exclusão. 