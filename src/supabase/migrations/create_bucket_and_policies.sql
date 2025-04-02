-- Criar o bucket 'memorias' se não existir
INSERT INTO storage.buckets (id, name, public, allowed_mime_types, file_size_limit)
VALUES ('memorias', 'memorias', true, ARRAY['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/svg+xml'], 10485760)
ON CONFLICT (id) DO NOTHING;

-- Habilitar RLS (Row Level Security) na tabela memories
ALTER TABLE public.memories ENABLE ROW LEVEL SECURITY;

-- Criar políticas para a tabela memories
-- Política para leitura pública
CREATE POLICY "Permitir leitura pública das memórias"
ON public.memories
FOR SELECT
TO public
USING (true);

-- Política para inserção pública
CREATE POLICY "Permitir inserção pública de memórias"
ON public.memories
FOR INSERT
TO public
WITH CHECK (true);

-- Política para atualização pública
CREATE POLICY "Permitir atualização pública de memórias"
ON public.memories
FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

-- Política para deleção pública
CREATE POLICY "Permitir deleção pública de memórias"
ON public.memories
FOR DELETE
TO public
USING (true);

-- Criar políticas para o bucket de storage
-- Política para leitura pública dos arquivos
CREATE POLICY "Permitir leitura pública dos arquivos"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'memorias');

-- Política para inserção pública de arquivos
CREATE POLICY "Permitir inserção pública de arquivos"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (bucket_id = 'memorias');

-- Política para atualização pública de arquivos
CREATE POLICY "Permitir atualização pública de arquivos"
ON storage.objects
FOR UPDATE
TO public
USING (bucket_id = 'memorias')
WITH CHECK (bucket_id = 'memorias');

-- Política para deleção pública de arquivos
CREATE POLICY "Permitir deleção pública de arquivos"
ON storage.objects
FOR DELETE
TO public
USING (bucket_id = 'memorias');

-- Garantir que o bucket seja público
UPDATE storage.buckets
SET public = true
WHERE id = 'memorias';

-- Configurar CORS para o bucket
UPDATE storage.buckets
SET allowed_mime_types = ARRAY['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/svg+xml'],
    file_size_limit = 10485760
WHERE id = 'memorias'; 
 
INSERT INTO storage.buckets (id, name, public, allowed_mime_types, file_size_limit)
VALUES ('memorias', 'memorias', true, ARRAY['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/svg+xml'], 10485760)
ON CONFLICT (id) DO NOTHING;

-- Habilitar RLS (Row Level Security) na tabela memories
ALTER TABLE public.memories ENABLE ROW LEVEL SECURITY;

-- Criar políticas para a tabela memories
-- Política para leitura pública
CREATE POLICY "Permitir leitura pública das memórias"
ON public.memories
FOR SELECT
TO public
USING (true);

-- Política para inserção pública
CREATE POLICY "Permitir inserção pública de memórias"
ON public.memories
FOR INSERT
TO public
WITH CHECK (true);

-- Política para atualização pública
CREATE POLICY "Permitir atualização pública de memórias"
ON public.memories
FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

-- Política para deleção pública
CREATE POLICY "Permitir deleção pública de memórias"
ON public.memories
FOR DELETE
TO public
USING (true);

-- Criar políticas para o bucket de storage
-- Política para leitura pública dos arquivos
CREATE POLICY "Permitir leitura pública dos arquivos"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'memorias');

-- Política para inserção pública de arquivos
CREATE POLICY "Permitir inserção pública de arquivos"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (bucket_id = 'memorias');

-- Política para atualização pública de arquivos
CREATE POLICY "Permitir atualização pública de arquivos"
ON storage.objects
FOR UPDATE
TO public
USING (bucket_id = 'memorias')
WITH CHECK (bucket_id = 'memorias');

-- Política para deleção pública de arquivos
CREATE POLICY "Permitir deleção pública de arquivos"
ON storage.objects
FOR DELETE
TO public
USING (bucket_id = 'memorias');

-- Garantir que o bucket seja público
UPDATE storage.buckets
SET public = true
WHERE id = 'memorias';

-- Configurar CORS para o bucket
UPDATE storage.buckets
SET allowed_mime_types = ARRAY['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/svg+xml'],
    file_size_limit = 10485760
WHERE id = 'memorias'; 
INSERT INTO storage.buckets (id, name, public, allowed_mime_types, file_size_limit)
VALUES ('memorias', 'memorias', true, ARRAY['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/svg+xml'], 10485760)
ON CONFLICT (id) DO NOTHING;

-- Habilitar RLS (Row Level Security) na tabela memories
ALTER TABLE public.memories ENABLE ROW LEVEL SECURITY;

-- Criar políticas para a tabela memories
-- Política para leitura pública
CREATE POLICY "Permitir leitura pública das memórias"
ON public.memories
FOR SELECT
TO public
USING (true);

-- Política para inserção pública
CREATE POLICY "Permitir inserção pública de memórias"
ON public.memories
FOR INSERT
TO public
WITH CHECK (true);

-- Política para atualização pública
CREATE POLICY "Permitir atualização pública de memórias"
ON public.memories
FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

-- Política para deleção pública
CREATE POLICY "Permitir deleção pública de memórias"
ON public.memories
FOR DELETE
TO public
USING (true);

-- Criar políticas para o bucket de storage
-- Política para leitura pública dos arquivos
CREATE POLICY "Permitir leitura pública dos arquivos"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'memorias');

-- Política para inserção pública de arquivos
CREATE POLICY "Permitir inserção pública de arquivos"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (bucket_id = 'memorias');

-- Política para atualização pública de arquivos
CREATE POLICY "Permitir atualização pública de arquivos"
ON storage.objects
FOR UPDATE
TO public
USING (bucket_id = 'memorias')
WITH CHECK (bucket_id = 'memorias');

-- Política para deleção pública de arquivos
CREATE POLICY "Permitir deleção pública de arquivos"
ON storage.objects
FOR DELETE
TO public
USING (bucket_id = 'memorias');

-- Garantir que o bucket seja público
UPDATE storage.buckets
SET public = true
WHERE id = 'memorias';

-- Configurar CORS para o bucket
UPDATE storage.buckets
SET allowed_mime_types = ARRAY['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/svg+xml'],
    file_size_limit = 10485760
WHERE id = 'memorias'; 
 
INSERT INTO storage.buckets (id, name, public, allowed_mime_types, file_size_limit)
VALUES ('memorias', 'memorias', true, ARRAY['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/svg+xml'], 10485760)
ON CONFLICT (id) DO NOTHING;

-- Habilitar RLS (Row Level Security) na tabela memories
ALTER TABLE public.memories ENABLE ROW LEVEL SECURITY;

-- Criar políticas para a tabela memories
-- Política para leitura pública
CREATE POLICY "Permitir leitura pública das memórias"
ON public.memories
FOR SELECT
TO public
USING (true);

-- Política para inserção pública
CREATE POLICY "Permitir inserção pública de memórias"
ON public.memories
FOR INSERT
TO public
WITH CHECK (true);

-- Política para atualização pública
CREATE POLICY "Permitir atualização pública de memórias"
ON public.memories
FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

-- Política para deleção pública
CREATE POLICY "Permitir deleção pública de memórias"
ON public.memories
FOR DELETE
TO public
USING (true);

-- Criar políticas para o bucket de storage
-- Política para leitura pública dos arquivos
CREATE POLICY "Permitir leitura pública dos arquivos"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'memorias');

-- Política para inserção pública de arquivos
CREATE POLICY "Permitir inserção pública de arquivos"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (bucket_id = 'memorias');

-- Política para atualização pública de arquivos
CREATE POLICY "Permitir atualização pública de arquivos"
ON storage.objects
FOR UPDATE
TO public
USING (bucket_id = 'memorias')
WITH CHECK (bucket_id = 'memorias');

-- Política para deleção pública de arquivos
CREATE POLICY "Permitir deleção pública de arquivos"
ON storage.objects
FOR DELETE
TO public
USING (bucket_id = 'memorias');

-- Garantir que o bucket seja público
UPDATE storage.buckets
SET public = true
WHERE id = 'memorias';

-- Configurar CORS para o bucket
UPDATE storage.buckets
SET allowed_mime_types = ARRAY['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/svg+xml'],
    file_size_limit = 10485760
WHERE id = 'memorias'; 