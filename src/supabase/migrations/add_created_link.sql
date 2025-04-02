-- Verifica se a coluna created_link existe na tabela memorias
DO $$
DECLARE
    column_exists BOOLEAN;
BEGIN
    -- Verifica se a coluna existe
    SELECT COUNT(*) > 0 INTO column_exists
    FROM information_schema.columns
    WHERE table_name = 'memorias'
    AND column_name = 'created_link';

    -- Se a coluna não existir, cria ela
    IF NOT column_exists THEN
        -- Adicionar a coluna created_link
        EXECUTE 'ALTER TABLE memorias ADD COLUMN created_link TEXT';
        RAISE NOTICE 'Coluna created_link foi criada com sucesso na tabela memorias.';
    ELSE
        RAISE NOTICE 'A coluna created_link já existe na tabela memorias.';
    END IF;
END $$;

-- Teste para confirmar que a coluna existe após a operação
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'memorias'
AND column_name = 'created_link'; 