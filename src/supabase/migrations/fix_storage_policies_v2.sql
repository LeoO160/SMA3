-- Desabilitar RLS temporariamente para poder criar o bucket
ALTER TABLE storage.buckets DISABLE ROW LEVEL SECURITY;
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;

-- Remover todas as políticas existentes
DROP POLICY IF EXISTS "Permitir leitura pública dos arquivos" ON storage.objects;
DROP POLICY IF EXISTS "Permitir inserção pública de arquivos" ON storage.objects;
DROP POLICY IF EXISTS "Permitir atualização pública de arquivos" ON storage.objects;
DROP POLICY IF EXISTS "Permitir deleção pública de arquivos" ON storage.objects;
DROP POLICY IF EXISTS "Permitir acesso público ao storage" ON storage.objects;

-- Criar o bucket se não existir
INSERT INTO storage.buckets (id, name, public, allowed_mime_types, file_size_limit)
VALUES ('memorias', 'memorias', true, ARRAY['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/svg+xml'], 10485760)
ON CONFLICT (id) DO UPDATE
SET public = true,
    allowed_mime_types = ARRAY['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/svg+xml'],
    file_size_limit = 10485760;

-- Habilitar RLS novamente
ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Criar políticas para o bucket
CREATE POLICY "Permitir acesso público ao bucket"
ON storage.buckets
FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- Criar políticas para os objetos
CREATE POLICY "Permitir acesso público aos objetos"
ON storage.objects
FOR ALL
TO public
USING (bucket_id = 'memorias')
WITH CHECK (bucket_id = 'memorias');

-- Garantir que o bucket seja público
UPDATE storage.buckets
SET public = true
WHERE id = 'memorias'; 
 
ALTER TABLE storage.buckets DISABLE ROW LEVEL SECURITY;
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;

-- Remover todas as políticas existentes
DROP POLICY IF EXISTS "Permitir leitura pública dos arquivos" ON storage.objects;
DROP POLICY IF EXISTS "Permitir inserção pública de arquivos" ON storage.objects;
DROP POLICY IF EXISTS "Permitir atualização pública de arquivos" ON storage.objects;
DROP POLICY IF EXISTS "Permitir deleção pública de arquivos" ON storage.objects;
DROP POLICY IF EXISTS "Permitir acesso público ao storage" ON storage.objects;

-- Criar o bucket se não existir
INSERT INTO storage.buckets (id, name, public, allowed_mime_types, file_size_limit)
VALUES ('memorias', 'memorias', true, ARRAY['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/svg+xml'], 10485760)
ON CONFLICT (id) DO UPDATE
SET public = true,
    allowed_mime_types = ARRAY['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/svg+xml'],
    file_size_limit = 10485760;

-- Habilitar RLS novamente
ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Criar políticas para o bucket
CREATE POLICY "Permitir acesso público ao bucket"
ON storage.buckets
FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- Criar políticas para os objetos
CREATE POLICY "Permitir acesso público aos objetos"
ON storage.objects
FOR ALL
TO public
USING (bucket_id = 'memorias')
WITH CHECK (bucket_id = 'memorias');

-- Garantir que o bucket seja público
UPDATE storage.buckets
SET public = true
WHERE id = 'memorias'; 
ALTER TABLE storage.buckets DISABLE ROW LEVEL SECURITY;
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;

-- Remover todas as políticas existentes
DROP POLICY IF EXISTS "Permitir leitura pública dos arquivos" ON storage.objects;
DROP POLICY IF EXISTS "Permitir inserção pública de arquivos" ON storage.objects;
DROP POLICY IF EXISTS "Permitir atualização pública de arquivos" ON storage.objects;
DROP POLICY IF EXISTS "Permitir deleção pública de arquivos" ON storage.objects;
DROP POLICY IF EXISTS "Permitir acesso público ao storage" ON storage.objects;

-- Criar o bucket se não existir
INSERT INTO storage.buckets (id, name, public, allowed_mime_types, file_size_limit)
VALUES ('memorias', 'memorias', true, ARRAY['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/svg+xml'], 10485760)
ON CONFLICT (id) DO UPDATE
SET public = true,
    allowed_mime_types = ARRAY['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/svg+xml'],
    file_size_limit = 10485760;

-- Habilitar RLS novamente
ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Criar políticas para o bucket
CREATE POLICY "Permitir acesso público ao bucket"
ON storage.buckets
FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- Criar políticas para os objetos
CREATE POLICY "Permitir acesso público aos objetos"
ON storage.objects
FOR ALL
TO public
USING (bucket_id = 'memorias')
WITH CHECK (bucket_id = 'memorias');

-- Garantir que o bucket seja público
UPDATE storage.buckets
SET public = true
WHERE id = 'memorias'; 
 
ALTER TABLE storage.buckets DISABLE ROW LEVEL SECURITY;
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;

-- Remover todas as políticas existentes
DROP POLICY IF EXISTS "Permitir leitura pública dos arquivos" ON storage.objects;
DROP POLICY IF EXISTS "Permitir inserção pública de arquivos" ON storage.objects;
DROP POLICY IF EXISTS "Permitir atualização pública de arquivos" ON storage.objects;
DROP POLICY IF EXISTS "Permitir deleção pública de arquivos" ON storage.objects;
DROP POLICY IF EXISTS "Permitir acesso público ao storage" ON storage.objects;

-- Criar o bucket se não existir
INSERT INTO storage.buckets (id, name, public, allowed_mime_types, file_size_limit)
VALUES ('memorias', 'memorias', true, ARRAY['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/svg+xml'], 10485760)
ON CONFLICT (id) DO UPDATE
SET public = true,
    allowed_mime_types = ARRAY['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/svg+xml'],
    file_size_limit = 10485760;

-- Habilitar RLS novamente
ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Criar políticas para o bucket
CREATE POLICY "Permitir acesso público ao bucket"
ON storage.buckets
FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- Criar políticas para os objetos
CREATE POLICY "Permitir acesso público aos objetos"
ON storage.objects
FOR ALL
TO public
USING (bucket_id = 'memorias')
WITH CHECK (bucket_id = 'memorias');

-- Garantir que o bucket seja público
UPDATE storage.buckets
SET public = true
WHERE id = 'memorias'; 