import{s as r}from"./index-DxjFMrjd.js";const t=async()=>{try{console.log("Tentando criar a tabela memorias...");const s=`
      CREATE TABLE IF NOT EXISTS public.memorias (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        url_path TEXT NOT NULL UNIQUE,
        user_email TEXT NOT NULL,
        title_color TEXT,
        title_bg_color TEXT,
        show_title_card BOOLEAN,
        style JSONB,
        time_text TEXT,
        counter_color TEXT,
        counter_font TEXT,
        counter_bg_color TEXT,
        show_counter_card BOOLEAN,
        show_animation BOOLEAN,
        selected_emoji TEXT,
        message TEXT,
        message_color TEXT,
        message_font TEXT,
        message_style JSONB,
        message_bg_color TEXT,
        show_message_card BOOLEAN,
        web_bg_color TEXT,
        music_url TEXT,
        music_type INTEGER,
        video_id TEXT,
        music_info JSONB,
        track_id TEXT,
        memories JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        visual_effect TEXT,
        selected_theme TEXT,
        created_link TEXT
      );
      
      -- Criar índices para melhorar a performance
      CREATE INDEX IF NOT EXISTS memorias_url_path_idx ON public.memorias(url_path);
      CREATE INDEX IF NOT EXISTS memorias_user_email_idx ON public.memorias(user_email);
    `,{error:e}=await r.rpc("exec_sql",{sql_query:s});if(e){if(e.message.includes("function")&&e.message.includes("does not exist")){console.log("Função RPC exec_sql não encontrada. Tentando método alternativo...");const{error:a}=await r.from("memorias").insert([{title:"Tabela de Teste",url_path:"teste-criacao-tabela",user_email:"teste@teste.com"}]);return a?(console.error("Erro na tentativa alternativa:",a),a.message.includes("does not exist")?{success:!1,error:a.message,message:'Não foi possível criar a tabela. Você precisa criar manualmente a tabela "memorias" no Supabase.',requiresManualSetup:!0}:{success:!1,error:a.message,message:"Falha ao criar tabela: "+a.message}):{success:!0,message:"Tabela memorias criada com sucesso (método alternativo)"}}return console.error("Erro ao criar tabela memorias:",e),{success:!1,error:e.message,message:"Falha ao criar tabela: "+e.message}}return{success:!0,message:"Tabela memorias criada com sucesso!"}}catch(s){return console.error("Exceção ao criar tabela memorias:",s),{success:!1,error:s.message,message:"Exceção ao criar tabela: "+s.message}}};export{t as createMemoriasTable};
