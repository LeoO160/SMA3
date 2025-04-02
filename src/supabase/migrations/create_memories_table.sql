-- Tabela para armazenar memórias
CREATE TABLE IF NOT EXISTS public.memories (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  url_path TEXT NOT NULL UNIQUE,
  user_email TEXT NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice para busca mais rápida por url_path
CREATE INDEX IF NOT EXISTS memories_url_path_idx ON public.memories(url_path);

-- Índice para busca mais rápida por email
CREATE INDEX IF NOT EXISTS memories_user_email_idx ON public.memories(user_email); 
 
CREATE TABLE IF NOT EXISTS public.memories (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  url_path TEXT NOT NULL UNIQUE,
  user_email TEXT NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice para busca mais rápida por url_path
CREATE INDEX IF NOT EXISTS memories_url_path_idx ON public.memories(url_path);

-- Índice para busca mais rápida por email
CREATE INDEX IF NOT EXISTS memories_user_email_idx ON public.memories(user_email); 
CREATE TABLE IF NOT EXISTS public.memories (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  url_path TEXT NOT NULL UNIQUE,
  user_email TEXT NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice para busca mais rápida por url_path
CREATE INDEX IF NOT EXISTS memories_url_path_idx ON public.memories(url_path);

-- Índice para busca mais rápida por email
CREATE INDEX IF NOT EXISTS memories_user_email_idx ON public.memories(user_email); 
 
CREATE TABLE IF NOT EXISTS public.memories (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  url_path TEXT NOT NULL UNIQUE,
  user_email TEXT NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice para busca mais rápida por url_path
CREATE INDEX IF NOT EXISTS memories_url_path_idx ON public.memories(url_path);

-- Índice para busca mais rápida por email
CREATE INDEX IF NOT EXISTS memories_user_email_idx ON public.memories(user_email); 