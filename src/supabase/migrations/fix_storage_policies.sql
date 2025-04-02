-- Primeiro, vamos remover as políticas existentes para evitar conflitos
DROP POLICY IF EXISTS "Permitir leitura pública dos arquivos" ON storage.objects;
DROP POLICY IF EXISTS "Permitir inserção pública de arquivos" ON storage.objects;
DROP POLICY IF EXISTS "Permitir atualização pública de arquivos" ON storage.objects;
DROP POLICY IF EXISTS "Permitir deleção pública de arquivos" ON storage.objects;

-- Criar políticas mais permissivas para o storage
CREATE POLICY "Permitir acesso público ao storage"
ON storage.objects
FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- Garantir que o bucket seja público e tenha as configurações corretas
UPDATE storage.buckets
SET public = true,
    allowed_mime_types = ARRAY['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/svg+xml'],
    file_size_limit = 10485760
WHERE id = 'memorias';

-- Habilitar RLS no storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Garantir que o bucket exista
INSERT INTO storage.buckets (id, name, public, allowed_mime_types, file_size_limit)
VALUES ('memorias', 'memorias', true, ARRAY['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/svg+xml'], 10485760)
ON CONFLICT (id) DO UPDATE
SET public = true,
    allowed_mime_types = ARRAY['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/svg+xml'],
    file_size_limit = 10485760; 
 
DROP POLICY IF EXISTS "Permitir leitura pública dos arquivos" ON storage.objects;
DROP POLICY IF EXISTS "Permitir inserção pública de arquivos" ON storage.objects;
DROP POLICY IF EXISTS "Permitir atualização pública de arquivos" ON storage.objects;
DROP POLICY IF EXISTS "Permitir deleção pública de arquivos" ON storage.objects;

-- Criar políticas mais permissivas para o storage
CREATE POLICY "Permitir acesso público ao storage"
ON storage.objects
FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- Garantir que o bucket seja público e tenha as configurações corretas
UPDATE storage.buckets
SET public = true,
    allowed_mime_types = ARRAY['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/svg+xml'],
    file_size_limit = 10485760
WHERE id = 'memorias';

-- Habilitar RLS no storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Garantir que o bucket exista
INSERT INTO storage.buckets (id, name, public, allowed_mime_types, file_size_limit)
VALUES ('memorias', 'memorias', true, ARRAY['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/svg+xml'], 10485760)
ON CONFLICT (id) DO UPDATE
SET public = true,
    allowed_mime_types = ARRAY['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/svg+xml'],
    file_size_limit = 10485760; 
DROP POLICY IF EXISTS "Permitir leitura pública dos arquivos" ON storage.objects;
DROP POLICY IF EXISTS "Permitir inserção pública de arquivos" ON storage.objects;
DROP POLICY IF EXISTS "Permitir atualização pública de arquivos" ON storage.objects;
DROP POLICY IF EXISTS "Permitir deleção pública de arquivos" ON storage.objects;

-- Criar políticas mais permissivas para o storage
CREATE POLICY "Permitir acesso público ao storage"
ON storage.objects
FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- Garantir que o bucket seja público e tenha as configurações corretas
UPDATE storage.buckets
SET public = true,
    allowed_mime_types = ARRAY['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/svg+xml'],
    file_size_limit = 10485760
WHERE id = 'memorias';

-- Habilitar RLS no storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Garantir que o bucket exista
INSERT INTO storage.buckets (id, name, public, allowed_mime_types, file_size_limit)
VALUES ('memorias', 'memorias', true, ARRAY['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/svg+xml'], 10485760)
ON CONFLICT (id) DO UPDATE
SET public = true,
    allowed_mime_types = ARRAY['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/svg+xml'],
    file_size_limit = 10485760; 
 
DROP POLICY IF EXISTS "Permitir leitura pública dos arquivos" ON storage.objects;
DROP POLICY IF EXISTS "Permitir inserção pública de arquivos" ON storage.objects;
DROP POLICY IF EXISTS "Permitir atualização pública de arquivos" ON storage.objects;
DROP POLICY IF EXISTS "Permitir deleção pública de arquivos" ON storage.objects;

-- Criar políticas mais permissivas para o storage
CREATE POLICY "Permitir acesso público ao storage"
ON storage.objects
FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- Garantir que o bucket seja público e tenha as configurações corretas
UPDATE storage.buckets
SET public = true,
    allowed_mime_types = ARRAY['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/svg+xml'],
    file_size_limit = 10485760
WHERE id = 'memorias';

-- Habilitar RLS no storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Garantir que o bucket exista
INSERT INTO storage.buckets (id, name, public, allowed_mime_types, file_size_limit)
VALUES ('memorias', 'memorias', true, ARRAY['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/svg+xml'], 10485760)
ON CONFLICT (id) DO UPDATE
SET public = true,
    allowed_mime_types = ARRAY['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/svg+xml'],
    file_size_limit = 10485760; 