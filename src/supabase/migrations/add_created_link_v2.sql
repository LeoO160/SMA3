-- Adiciona a coluna created_link se ela não existir
ALTER TABLE memorias ADD COLUMN IF NOT EXISTS created_link TEXT;

-- Verifica se a coluna foi criada
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'memorias' 
AND column_name = 'created_link'; 