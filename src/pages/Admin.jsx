import { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Paper, 
  Typography, 
  TextField, 
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import { getUserMemories, deleteMemory } from '../supabase/supabaseClient';

const ADMIN_PASSWORD = "admin123"; // Em um ambiente real, isso seria armazenado no backend

export default function Admin() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [memories, setMemories] = useState([]);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, memory: null });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({
    open: false,
    type: 'success',
    text: ''
  });

  // Verifica se já está autenticado ao carregar a página
  useEffect(() => {
    const auth = localStorage.getItem('adminAuth');
    if (auth === 'true') {
      setIsAuthenticated(true);
      loadMemories();
    }
  }, []);

  useEffect(() => {
    const fetchMemories = async () => {
      setIsLoading(true);
      
      try {
        // Buscar memórias do Supabase
        const memories = await getUserMemories('admin@example.com'); // Passar o email do usuário
        setMemories(memories || []);
        setIsLoading(false);
      } catch (error) {
        console.error('Erro ao buscar memórias:', error);
        setError('Falha ao buscar memórias');
        setIsLoading(false);
      }
    };
    
    if (isAuthenticated) {
      fetchMemories();
    }
  }, [isAuthenticated]);

  // Função para excluir uma memória
  const handleDeleteMemory = async (memory) => {
    if (memory) {
      setIsLoading(true);
      setMessage({
        open: false,
        type: 'info',
        text: ''
      });
      
      console.log('Tentando excluir memória:', memory);
      
      try {
        // Se a memória for do Supabase, exclui usando a API
        if (memory.source === 'supabase' && memory.id) {
          setMessage({
            open: true,
            type: 'info',
            text: 'Excluindo arquivos e dados da memória...'
          });
          
          console.log('Excluindo memória do Supabase com ID:', memory.id);
          const { success, error, data } = await deleteMemory(memory.id);
          console.log('Resultado da exclusão do Supabase:', { success, error, data });
          
          if (!success) {
            throw new Error(error?.message || 'Erro ao excluir do Supabase');
          }
          
          // Remover a memória da lista local imediatamente
          setMemories(prevMemories => prevMemories.filter(m => 
            !(m.source === 'supabase' && m.id === memory.id)
          ));
          
          console.log('Memória excluída com sucesso do Supabase');
        } else if (memory.source === 'localStorage' && memory.key) {
          // Exclui a memória do localStorage
          console.log('Excluindo memória do localStorage com key:', memory.key);
          localStorage.removeItem(memory.key);
          
          // Remover a memória da lista local imediatamente
          setMemories(prevMemories => prevMemories.filter(m => 
            !(m.source === 'localStorage' && m.key === memory.key)
          ));
          
          console.log('Memória excluída com sucesso do localStorage');
        } else {
          console.error('Memória sem origem ou identificador válido:', memory);
          throw new Error('Origem da memória inválida');
        }
        
        // Atualiza a lista de memórias
        setTimeout(() => {
          loadMemories();
        }, 500); // Pequeno delay para garantir que a exclusão seja processada no servidor
        
        setDeleteDialog({ open: false, memory: null });
        
        // Mostrar mensagem de sucesso
        setMessage({
          open: true,
          type: 'success',
          text: 'Memória excluída com sucesso'
        });
      } catch (error) {
        console.error('Erro ao excluir memória:', error);
        setMessage({
          open: true,
          type: 'error',
          text: `Erro ao excluir: ${error.message || 'Problema na comunicação com o servidor'}`
        });
        
        // Recarregar memórias mesmo em caso de erro, para garantir que a lista está atualizada
        setTimeout(() => {
          loadMemories();
        }, 500);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem('adminAuth', 'true');
      setError('');
    } else {
      setError('Senha incorreta');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('adminAuth');
    setPassword('');
    navigate('/');
  };

  const handleDeleteClick = (memory) => {
    setDeleteDialog({ open: true, memory });
  };

  const handleDeleteConfirm = async () => {
    if (deleteDialog.memory) {
      await handleDeleteMemory(deleteDialog.memory);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isAuthenticated) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: '#fafafa'
        }}
      >
        <Container maxWidth="sm">
          <Paper
            elevation={0}
            sx={{
              p: 4,
              display: 'flex',
              flexDirection: 'column',
              gap: 3
            }}
          >
            <Typography variant="h5" component="h1" align="center">
              Área Administrativa
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <TextField
              fullWidth
              type="password"
              label="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            />

            <Button
              variant="contained"
              onClick={handleLogin}
              sx={{ mt: 2 }}
            >
              Entrar
            </Button>
          </Paper>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#fafafa',
        py: 4
      }}
    >
      <Container maxWidth="md">
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" component="h1">
            Gerenciamento de Memórias
          </Typography>
          <Button
            variant="outlined"
            color="error"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
          >
            Sair
          </Button>
        </Box>

        {/* Feedback de carregamento e mensagens */}
        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
            <CircularProgress size={30} />
          </Box>
        )}
        
        {message.open && (
          <Alert 
            severity={message.type} 
            sx={{ mb: 2 }}
            onClose={() => setMessage({...message, open: false})}
          >
            {message.text}
          </Alert>
        )}

        <Paper elevation={0}>
          <List>
            {memories.map((memory) => (
              <ListItem
                key={memory.key}
                divider
                sx={{
                  '&:last-child': {
                    borderBottom: 'none'
                  }
                }}
              >
                <ListItemText
                  primary={memory.title}
                  secondary={
                    <>
                      <Typography component="span" variant="body2" color="text.secondary">
                        Criado em: {formatDate(memory.createdAt)}
                      </Typography>
                      <br />
                      <Typography component="span" variant="body2" color="text.secondary">
                        Email: {memory.userEmail}
                      </Typography>
                      <br />
                      <Typography 
                        component="a"
                        href={memory.created_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="body2" 
                        color="primary" 
                        sx={{ 
                          cursor: 'pointer',
                          textDecoration: 'none',
                          '&:hover': {
                            textDecoration: 'underline'
                          }
                        }}
                      >
                        {memory.created_link}
                      </Typography>
                    </>
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton 
                    edge="end" 
                    aria-label="delete"
                    onClick={() => handleDeleteClick(memory)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
            {memories.length === 0 && (
              <ListItem>
                <ListItemText
                  primary="Nenhuma memória encontrada"
                  secondary="As memórias criadas aparecerão aqui"
                />
              </ListItem>
            )}
          </List>
        </Paper>

        {/* Diálogo de confirmação de exclusão */}
        <Dialog
          open={deleteDialog.open}
          onClose={() => !isLoading && setDeleteDialog({ open: false, memory: null })}
        >
          <DialogTitle>Confirmar exclusão</DialogTitle>
          <DialogContent>
            <Typography>
              Tem certeza que deseja excluir a memória "{deleteDialog.memory?.title}"?
              Esta ação não pode ser desfeita.
            </Typography>
            {deleteDialog.memory?.source === 'supabase' && (
              <Typography sx={{ mt: 1, color: 'warning.main', fontSize: '0.9rem' }}>
                Esta memória está armazenada no servidor. Todos os arquivos associados também serão excluídos.
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => setDeleteDialog({ open: false, memory: null })}
              color="primary"
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleDeleteConfirm}
              color="error"
              variant="contained"
              disabled={isLoading}
            >
              {isLoading ? 'Excluindo...' : 'Excluir'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
} 