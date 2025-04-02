-- Políticas de segurança para a tabela memories
DROP POLICY IF EXISTS "Política de Leitura Pública para Tabela memories" ON public.memories;
CREATE POLICY "Política de Leitura Pública para Tabela memories"
ON public.memories
FOR SELECT
TO anon
USING (true);

DROP POLICY IF EXISTS "Política de Inserção Pública para Tabela memories" ON public.memories;
CREATE POLICY "Política de Inserção Pública para Tabela memories"
ON public.memories
FOR INSERT
TO anon
WITH CHECK (true);

DROP POLICY IF EXISTS "Política de Exclusão Pública para Tabela memories" ON public.memories;
CREATE POLICY "Política de Exclusão Pública para Tabela memories"
ON public.memories
FOR DELETE
TO anon
USING (true);

DROP POLICY IF EXISTS "Política de Atualização Pública para Tabela memories" ON public.memories;
CREATE POLICY "Política de Atualização Pública para Tabela memories"
ON public.memories
FOR UPDATE
TO anon
USING (true);

-- Habilitar RLS na tabela memories
ALTER TABLE public.memories ENABLE ROW LEVEL SECURITY;

-- Políticas para o bucket de storage 'memorias'
DROP POLICY IF EXISTS "Política de Leitura Pública para Memórias" ON storage.objects;
CREATE POLICY "Política de Leitura Pública para Memórias"
ON storage.objects
FOR SELECT
TO anon
USING (bucket_id = 'memorias');

DROP POLICY IF EXISTS "Política de Inserção Pública para Memórias" ON storage.objects;
CREATE POLICY "Política de Inserção Pública para Memórias"
ON storage.objects
FOR INSERT
TO anon
WITH CHECK (bucket_id = 'memorias');

DROP POLICY IF EXISTS "Política de Exclusão Pública para Memórias" ON storage.objects;
CREATE POLICY "Política de Exclusão Pública para Memórias"
ON storage.objects
FOR DELETE
TO anon
USING (bucket_id = 'memorias');

DROP POLICY IF EXISTS "Política de Atualização Pública para Memórias" ON storage.objects;
CREATE POLICY "Política de Atualização Pública para Memórias"
ON storage.objects
FOR UPDATE
TO anon
USING (bucket_id = 'memorias'); 
 
DROP POLICY IF EXISTS "Política de Leitura Pública para Tabela memories" ON public.memories;
CREATE POLICY "Política de Leitura Pública para Tabela memories"
ON public.memories
FOR SELECT
TO anon
USING (true);

DROP POLICY IF EXISTS "Política de Inserção Pública para Tabela memories" ON public.memories;
CREATE POLICY "Política de Inserção Pública para Tabela memories"
ON public.memories
FOR INSERT
TO anon
WITH CHECK (true);

DROP POLICY IF EXISTS "Política de Exclusão Pública para Tabela memories" ON public.memories;
CREATE POLICY "Política de Exclusão Pública para Tabela memories"
ON public.memories
FOR DELETE
TO anon
USING (true);

DROP POLICY IF EXISTS "Política de Atualização Pública para Tabela memories" ON public.memories;
CREATE POLICY "Política de Atualização Pública para Tabela memories"
ON public.memories
FOR UPDATE
TO anon
USING (true);

-- Habilitar RLS na tabela memories
ALTER TABLE public.memories ENABLE ROW LEVEL SECURITY;

-- Políticas para o bucket de storage 'memorias'
DROP POLICY IF EXISTS "Política de Leitura Pública para Memórias" ON storage.objects;
CREATE POLICY "Política de Leitura Pública para Memórias"
ON storage.objects
FOR SELECT
TO anon
USING (bucket_id = 'memorias');

DROP POLICY IF EXISTS "Política de Inserção Pública para Memórias" ON storage.objects;
CREATE POLICY "Política de Inserção Pública para Memórias"
ON storage.objects
FOR INSERT
TO anon
WITH CHECK (bucket_id = 'memorias');

DROP POLICY IF EXISTS "Política de Exclusão Pública para Memórias" ON storage.objects;
CREATE POLICY "Política de Exclusão Pública para Memórias"
ON storage.objects
FOR DELETE
TO anon
USING (bucket_id = 'memorias');

DROP POLICY IF EXISTS "Política de Atualização Pública para Memórias" ON storage.objects;
CREATE POLICY "Política de Atualização Pública para Memórias"
ON storage.objects
FOR UPDATE
TO anon
USING (bucket_id = 'memorias'); 
DROP POLICY IF EXISTS "Política de Leitura Pública para Tabela memories" ON public.memories;
CREATE POLICY "Política de Leitura Pública para Tabela memories"
ON public.memories
FOR SELECT
TO anon
USING (true);

DROP POLICY IF EXISTS "Política de Inserção Pública para Tabela memories" ON public.memories;
CREATE POLICY "Política de Inserção Pública para Tabela memories"
ON public.memories
FOR INSERT
TO anon
WITH CHECK (true);

DROP POLICY IF EXISTS "Política de Exclusão Pública para Tabela memories" ON public.memories;
CREATE POLICY "Política de Exclusão Pública para Tabela memories"
ON public.memories
FOR DELETE
TO anon
USING (true);

DROP POLICY IF EXISTS "Política de Atualização Pública para Tabela memories" ON public.memories;
CREATE POLICY "Política de Atualização Pública para Tabela memories"
ON public.memories
FOR UPDATE
TO anon
USING (true);

-- Habilitar RLS na tabela memories
ALTER TABLE public.memories ENABLE ROW LEVEL SECURITY;

-- Políticas para o bucket de storage 'memorias'
DROP POLICY IF EXISTS "Política de Leitura Pública para Memórias" ON storage.objects;
CREATE POLICY "Política de Leitura Pública para Memórias"
ON storage.objects
FOR SELECT
TO anon
USING (bucket_id = 'memorias');

DROP POLICY IF EXISTS "Política de Inserção Pública para Memórias" ON storage.objects;
CREATE POLICY "Política de Inserção Pública para Memórias"
ON storage.objects
FOR INSERT
TO anon
WITH CHECK (bucket_id = 'memorias');

DROP POLICY IF EXISTS "Política de Exclusão Pública para Memórias" ON storage.objects;
CREATE POLICY "Política de Exclusão Pública para Memórias"
ON storage.objects
FOR DELETE
TO anon
USING (bucket_id = 'memorias');

DROP POLICY IF EXISTS "Política de Atualização Pública para Memórias" ON storage.objects;
CREATE POLICY "Política de Atualização Pública para Memórias"
ON storage.objects
FOR UPDATE
TO anon
USING (bucket_id = 'memorias'); 
 
DROP POLICY IF EXISTS "Política de Leitura Pública para Tabela memories" ON public.memories;
CREATE POLICY "Política de Leitura Pública para Tabela memories"
ON public.memories
FOR SELECT
TO anon
USING (true);

DROP POLICY IF EXISTS "Política de Inserção Pública para Tabela memories" ON public.memories;
CREATE POLICY "Política de Inserção Pública para Tabela memories"
ON public.memories
FOR INSERT
TO anon
WITH CHECK (true);

DROP POLICY IF EXISTS "Política de Exclusão Pública para Tabela memories" ON public.memories;
CREATE POLICY "Política de Exclusão Pública para Tabela memories"
ON public.memories
FOR DELETE
TO anon
USING (true);

DROP POLICY IF EXISTS "Política de Atualização Pública para Tabela memories" ON public.memories;
CREATE POLICY "Política de Atualização Pública para Tabela memories"
ON public.memories
FOR UPDATE
TO anon
USING (true);

-- Habilitar RLS na tabela memories
ALTER TABLE public.memories ENABLE ROW LEVEL SECURITY;

-- Políticas para o bucket de storage 'memorias'
DROP POLICY IF EXISTS "Política de Leitura Pública para Memórias" ON storage.objects;
CREATE POLICY "Política de Leitura Pública para Memórias"
ON storage.objects
FOR SELECT
TO anon
USING (bucket_id = 'memorias');

DROP POLICY IF EXISTS "Política de Inserção Pública para Memórias" ON storage.objects;
CREATE POLICY "Política de Inserção Pública para Memórias"
ON storage.objects
FOR INSERT
TO anon
WITH CHECK (bucket_id = 'memorias');

DROP POLICY IF EXISTS "Política de Exclusão Pública para Memórias" ON storage.objects;
CREATE POLICY "Política de Exclusão Pública para Memórias"
ON storage.objects
FOR DELETE
TO anon
USING (bucket_id = 'memorias');

DROP POLICY IF EXISTS "Política de Atualização Pública para Memórias" ON storage.objects;
CREATE POLICY "Política de Atualização Pública para Memórias"
ON storage.objects
FOR UPDATE
TO anon
USING (bucket_id = 'memorias'); 