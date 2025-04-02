-- Verifica se a coluna counter_bg_color existe na tabela memorias
DO $$
DECLARE
    column_exists BOOLEAN;
BEGIN
    -- Verifica se a coluna existe
    SELECT COUNT(*) > 0 INTO column_exists
    FROM information_schema.columns
    WHERE table_name = 'memorias'
    AND column_name = 'counter_bg_color';

    -- Se a coluna não existir, cria ela
    IF NOT column_exists THEN
        -- Adicionar a coluna counter_bg_color com um valor padrão
        EXECUTE 'ALTER TABLE memorias ADD COLUMN counter_bg_color VARCHAR(50) DEFAULT ''#fe6b8b''';
        RAISE NOTICE 'Coluna counter_bg_color foi criada com sucesso na tabela memorias.';
    ELSE
        RAISE NOTICE 'A coluna counter_bg_color já existe na tabela memorias.';
    END IF;
END $$;

-- Teste para confirmar que a coluna existe após a operação
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'memorias'
AND column_name = 'counter_bg_color'; 