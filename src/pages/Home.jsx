import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Grid,
  Paper,
  CircularProgress,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getMemories } from '../supabase/supabaseClient';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export default function Home() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulação de carregamento para mostrar a animação
    setTimeout(() => {
      setLoading(false);
    }, 800);
  }, []);

  // Renderiza um indicador de carregamento enquanto a página está sendo carregada
  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        width="100%"
        sx={{
          background: 'linear-gradient(135deg, #fe6b8b 30%, #ff8e53 90%)',
        }}
      >
        <CircularProgress size={60} sx={{ color: 'white' }} />
      </Box>
    );
  }

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Hero Section com gradiente animado */}
      <Box 
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #fe6b8b 30%, #ff8e53 90%)',
          display: 'flex',
          alignItems: 'center',
          padding: { xs: '6rem 0', md: '0' },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Círculos decorativos animados */}
        <Box 
          component={motion.div}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
          sx={{
            position: 'absolute',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: '#fff',
            top: '-100px',
            right: '-100px',
          }}
        />
        
        <Box 
          component={motion.div}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.05, scale: 1 }}
          transition={{ duration: 2.5, delay: 0.3, repeat: Infinity, repeatType: 'reverse' }}
          sx={{
            position: 'absolute',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: '#fff',
            bottom: '50px',
            left: '-150px',
          }}
        />

        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box
                component={motion.div}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                sx={{
                  textAlign: { xs: 'center', md: 'left' },
                  mb: { xs: 4, md: 0 }
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: { xs: 'center', md: 'flex-start' },
                    mb: 4,
                    position: 'relative'
                  }}
                >
                  <Box
                    component={motion.div}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    sx={{
                      width: '100%',
                      maxWidth: { xs: '300px', md: '400px' },
                      position: 'relative',
                      mx: 'auto'
                    }}
                  >
                    <img
                      src="/logo.png"
                      alt="SayMe Always"
                      style={{
                        width: '100%',
                        height: 'auto',
                        objectFit: 'contain',
                        filter: 'drop-shadow(0px 4px 8px rgba(0,0,0,0.2))',
                        transition: 'transform 0.3s ease-in-out',
                        '&:hover': {
                          transform: 'scale(1.02)'
                        }
                      }}
                    />
                  </Box>
                </Box>
                <Typography
                  variant="h2"
                  sx={{
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                    mb: 2,
                    textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
                  }}
                >
                  Eternize Seus Momentos Especiais
                </Typography>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <Typography
                    variant="h5"
                    sx={{ 
                      mb: 4, 
                      fontWeight: 400,
                      opacity: 0.9,
                      lineHeight: 1.5,
                      fontSize: { xs: '1.1rem', md: '1.5rem' },
                    }}
                  >
                    Crie uma experiência digital única para expressar seus sentimentos 
                    e surpreender quem você ama com um presente inesquecível.
              </Typography>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
              <Button 
                variant="contained" 
                size="large"
                onClick={() => navigate('/create')}
                    endIcon={<ArrowForwardIcon />}
                sx={{
                      bgcolor: 'white',
                      color: '#fe6b8b',
                      py: 1.5,
                      px: 4,
                      fontSize: '1.1rem',
                  borderRadius: '30px',
                      boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
                  '&:hover': {
                        bgcolor: 'white',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 12px 28px rgba(0,0,0,0.25)',
                      },
                      transition: 'transform 0.2s, box-shadow 0.2s',
                }}
              >
                Começar Agora
              </Button>
            </motion.div>
              </Box>
          </Grid>
            
            <Grid item xs={12} md={6} sx={{ display: { xs: 'none', md: 'block' } }}>
              <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    height: '500px',
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  {/* Moldura de fotos destacada */}
                  <Paper
                    elevation={10}
                    sx={{
                      position: 'absolute',
                      width: '280px',
                      height: '350px',
                      backgroundImage: 'url("/cabecalho.png")',
                      backgroundSize: 'contain',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                      backgroundColor: 'white',
                      borderRadius: '12px',
                      border: '10px solid white',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                      transform: 'rotate(-5deg)',
                      zIndex: 3,
                    }}
                  />
                  
                  {/* Foto secundária */}
                  <Paper
                    elevation={8}
                    sx={{
                      position: 'absolute',
                      width: '240px',
                      height: '320px',
                      backgroundImage: 'url("https://source.unsplash.com/random/600x800/?family")',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      borderRadius: '12px',
                      border: '10px solid white',
                      boxShadow: '0 15px 30px rgba(0,0,0,0.2)',
                      top: '100px',
                      right: '30px',
                      transform: 'rotate(8deg)',
                      zIndex: 2,
                    }}
                  />
                  
                  {/* Foto terciária */}
                  <Paper
                    elevation={6}
                    sx={{
                      position: 'absolute',
                      width: '200px',
                      height: '260px',
                      backgroundImage: 'url("https://source.unsplash.com/random/600x800/?friends")',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      borderRadius: '12px',
                      border: '10px solid white',
                      boxShadow: '0 10px 20px rgba(0,0,0,0.15)',
                      bottom: '40px',
                      left: '40px',
                      transform: 'rotate(-8deg)',
                      zIndex: 1,
                    }}
                  />
                </Box>
              </motion.div>
          </Grid>
        </Grid>
      </Container>
      </Box>

      {/* Seção Funcionalidades */}
      <Box sx={{ py: 10, backgroundColor: '#fff' }}>
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Typography 
              variant="h3" 
              align="center" 
              gutterBottom 
              sx={{ 
                mb: 1, 
                fontWeight: 'bold',
                color: '#333'
              }}
            >
              Uma Experiência Única
            </Typography>
            
            <Typography 
              variant="subtitle1" 
              align="center" 
              sx={{ 
                mb: 8,
                color: '#777',
                maxWidth: '700px',
                mx: 'auto'
              }}
            >
              Crie presentes digitais personalizados para celebrar momentos especiais 
              e expressar seus sentimentos mais profundos
            </Typography>
          </motion.div>

          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    textAlign: 'center',
                    height: '100%',
                    borderRadius: '16px',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.05)',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 15px 50px rgba(0,0,0,0.1)',
                    },
                  }}
                >
                  <Box 
                    sx={{ 
                      mb: 2, 
                      display: 'flex', 
                      justifyContent: 'center' 
                    }}
                  >
                    <Box 
                      sx={{ 
                        bgcolor: '#ffe0e8', 
                        borderRadius: '50%', 
                        width: 80, 
                        height: 80,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <FavoriteIcon sx={{ fontSize: 40, color: '#fe6b8b' }} />
                    </Box>
                  </Box>
                  <Typography variant="h5" gutterBottom fontWeight="bold">
                    Mensagens do Coração
                  </Typography>
                  <Typography color="textSecondary">
                    Escreva mensagens personalizadas e emocionantes que tocam a alma de quem você ama.
                  </Typography>
                </Paper>
              </motion.div>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    textAlign: 'center',
                    height: '100%',
                    borderRadius: '16px',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.05)',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 15px 50px rgba(0,0,0,0.1)',
                    },
                  }}
                >
                  <Box 
                    sx={{ 
                      mb: 2, 
                      display: 'flex', 
                      justifyContent: 'center' 
                    }}
                  >
                    <Box 
                      sx={{ 
                        bgcolor: '#fff0e0', 
                        borderRadius: '50%', 
                        width: 80, 
                        height: 80,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <CameraAltIcon sx={{ fontSize: 40, color: '#ff8e53' }} />
                    </Box>
                  </Box>
                  <Typography variant="h5" gutterBottom fontWeight="bold">
                    Galerias de Lembranças
                  </Typography>
                  <Typography color="textSecondary">
                    Crie uma coleção de fotos que contam sua história e despertam emoções únicas.
                  </Typography>
                </Paper>
              </motion.div>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    textAlign: 'center',
                    height: '100%',
                    borderRadius: '16px',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.05)',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 15px 50px rgba(0,0,0,0.1)',
                    },
                  }}
                >
                  <Box 
                    sx={{ 
                      mb: 2, 
                      display: 'flex', 
                      justifyContent: 'center' 
                    }}
                  >
                    <Box 
                      sx={{ 
                        bgcolor: '#e0f7ff', 
                        borderRadius: '50%', 
                        width: 80, 
                        height: 80,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <MusicNoteIcon sx={{ fontSize: 40, color: '#4ECDC4' }} />
                    </Box>
                  </Box>
                  <Typography variant="h5" gutterBottom fontWeight="bold">
                    Trilha Sonora
                  </Typography>
                  <Typography color="textSecondary">
                    Adicione a música que embala sua história de amor e torna o momento ainda mais especial.
                  </Typography>
                </Paper>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Seção de Etapas - Como Funciona */}
      <Box sx={{ py: 10, bgcolor: '#f7f8fc' }}>
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Typography 
              variant="h3" 
              align="center" 
              gutterBottom 
              sx={{ 
                mb: 2, 
                fontWeight: 'bold',
                color: '#333'
              }}
            >
              Como Criar Sua Memória
            </Typography>
            
            <Typography 
              variant="subtitle1" 
              align="center" 
              sx={{ 
                mb: 6,
                color: '#777',
                maxWidth: '700px',
                mx: 'auto'
              }}
            >
              Siga estas etapas simples para criar algo inesquecível 
              em poucos minutos
            </Typography>
          </motion.div>

          {/* Cards horizontais de etapas */}
          <Box sx={{ mb: 6 }}>
            <Grid container spacing={3}>
              {/* Etapa 1 */}
              <Grid item xs={12} sm={6} md={2.4}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  viewport={{ once: true }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      height: '100%',
                      borderRadius: '12px',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.05)',
                      overflow: 'hidden',
                      position: 'relative',
                      transition: 'transform 0.3s, box-shadow 0.3s',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 15px 40px rgba(254, 107, 139, 0.15)',
                      },
                    }}
                  >
                    <Box sx={{ p: 3, textAlign: 'center' }}>
                      <Box 
                        sx={{ 
                          width: 50, 
                          height: 50, 
                          bgcolor: 'rgba(254, 107, 139, 0.1)',
                          color: '#fe6b8b',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.5rem',
                          fontWeight: 'bold',
                          mx: 'auto',
                          mb: 2,
                        }}
                      >
                        1
                      </Box>
                      <Typography variant="h6" gutterBottom fontWeight="bold" color="#333">
                        Selecione Um Tema
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Escolha entre diversos temas e cores que expressam seus sentimentos.
                      </Typography>
                    </Box>
                  </Paper>
                </motion.div>
              </Grid>

              {/* Etapa 2 */}
              <Grid item xs={12} sm={6} md={2.4}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      height: '100%',
                      borderRadius: '12px',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.05)',
                      overflow: 'hidden',
                      position: 'relative',
                      transition: 'transform 0.3s, box-shadow 0.3s',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 15px 40px rgba(254, 107, 139, 0.15)',
                      },
                    }}
                  >
                    <Box sx={{ p: 3, textAlign: 'center' }}>
                      <Box 
                        sx={{ 
                          width: 50, 
                          height: 50, 
                          bgcolor: 'rgba(254, 107, 139, 0.1)',
                          color: '#fe6b8b',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.5rem',
                          fontWeight: 'bold',
                          mx: 'auto',
                          mb: 2,
                        }}
                      >
                        2
                      </Box>
                      <Typography variant="h6" gutterBottom fontWeight="bold" color="#333">
                        Personalize o Contador
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Adicione um contador para uma data especial do casal.
                      </Typography>
                    </Box>
                  </Paper>
                </motion.div>
              </Grid>

              {/* Etapa 3 */}
              <Grid item xs={12} sm={6} md={2.4}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  viewport={{ once: true }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      height: '100%',
                      borderRadius: '12px',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.05)',
                      overflow: 'hidden',
                      position: 'relative',
                      transition: 'transform 0.3s, box-shadow 0.3s',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 15px 40px rgba(254, 107, 139, 0.15)',
                      },
                    }}
                  >
                    <Box sx={{ p: 3, textAlign: 'center' }}>
                      <Box 
                        sx={{ 
                          width: 50, 
                          height: 50, 
                          bgcolor: 'rgba(254, 107, 139, 0.1)',
                          color: '#fe6b8b',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.5rem',
                          fontWeight: 'bold',
                          mx: 'auto',
                          mb: 2,
                        }}
                      >
                        3
                      </Box>
                      <Typography variant="h6" gutterBottom fontWeight="bold" color="#333">
                        Escreva Sua Mensagem
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Crie mensagens personalizadas com estilos e fontes.
                      </Typography>
                    </Box>
                  </Paper>
                </motion.div>
              </Grid>

              {/* Etapa 4 */}
              <Grid item xs={12} sm={6} md={2.4}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  viewport={{ once: true }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      height: '100%',
                      borderRadius: '12px',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.05)',
                      overflow: 'hidden',
                      position: 'relative',
                      transition: 'transform 0.3s, box-shadow 0.3s',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 15px 40px rgba(254, 107, 139, 0.15)',
                      },
                    }}
                  >
                    <Box sx={{ p: 3, textAlign: 'center' }}>
                      <Box 
                        sx={{ 
                          width: 50, 
                          height: 50, 
                          bgcolor: 'rgba(254, 107, 139, 0.1)',
                          color: '#fe6b8b',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.5rem',
                          fontWeight: 'bold',
                          mx: 'auto',
                          mb: 2,
                        }}
                      >
                        4
                      </Box>
                      <Typography variant="h6" gutterBottom fontWeight="bold" color="#333">
                        Adicione Fotos
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Faça upload de fotos para criar uma galeria de momentos.
                      </Typography>
                    </Box>
                  </Paper>
                </motion.div>
              </Grid>

              {/* Etapa 5 */}
              <Grid item xs={12} sm={6} md={2.4}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  viewport={{ once: true }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      height: '100%',
                      borderRadius: '12px',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.05)',
                      overflow: 'hidden',
                      position: 'relative',
                      transition: 'transform 0.3s, box-shadow 0.3s',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 15px 40px rgba(254, 107, 139, 0.15)',
                      },
                    }}
                  >
                    <Box sx={{ p: 3, textAlign: 'center' }}>
                      <Box 
                        sx={{ 
                          width: 50, 
                          height: 50, 
                          bgcolor: 'rgba(254, 107, 139, 0.1)',
                          color: '#fe6b8b',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.5rem',
                          fontWeight: 'bold',
                          mx: 'auto',
                          mb: 2,
                        }}
                      >
                        5
                      </Box>
                      <Typography variant="h6" gutterBottom fontWeight="bold" color="#333">
                        Escolha a Música
                    </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Selecione a trilha sonora perfeita para sua memória.
                    </Typography>
                  </Box>
                  </Paper>
                </motion.div>
              </Grid>
          </Grid>
          </Box>

          {/* Resultado final - Card persuasivo */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <Paper 
              elevation={3}
              sx={{
                p: 4,
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #fe6b8b 30%, #ff8e53 90%)',
                color: 'white',
                textAlign: 'center',
                boxShadow: '0 15px 50px rgba(254, 107, 139, 0.3)',
                maxWidth: '900px',
                mx: 'auto',
                mt: 5,
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Círculos decorativos */}
              <Box 
                sx={{ 
                  position: 'absolute',
                  width: '150px',
                  height: '150px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.1)',
                  top: '-50px',
                  right: '-30px'
                }}
              />
              <Box 
                sx={{ 
                  position: 'absolute',
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.1)',
                  bottom: '-30px',
                  left: '20px'
                }}
              />
              
              <Typography 
                variant="h4" 
                gutterBottom 
                sx={{ 
                  fontWeight: 'bold', 
                  mb: 2,
                  textShadow: '0 2px 10px rgba(0,0,0,0.1)'
                }}
              >
                Pronto! Você Fez Alguém Especial Feliz!
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 3,
                  fontWeight: '400',
                  maxWidth: '700px',
                  mx: 'auto',
                  opacity: 0.9
                }}
              >
                Compartilhe sua criação e surpreenda aquela pessoa que significa o mundo para você. 
                O sorriso no rosto dela será seu maior presente!
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/create')}
                sx={{
                  bgcolor: 'white',
                  color: '#fe6b8b',
                  px: 4,
                  py: 1.5,
                  borderRadius: '30px',
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                  '&:hover': {
                    bgcolor: 'white',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 25px rgba(0,0,0,0.2)',
                  },
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
              >
                Começar Minha Criação
              </Button>
            </Paper>
          </motion.div>
        </Container>
      </Box>

      {/* Seção de Planos */}
      <Box sx={{ py: 10, bgcolor: '#fff' }}>
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Typography 
              variant="h3" 
              align="center" 
              gutterBottom 
              sx={{ 
                mb: 2, 
                fontWeight: 'bold',
                color: '#333'
              }}
            >
              Escolha Seu Plano
            </Typography>
            
            <Typography 
              variant="subtitle1" 
              align="center" 
              sx={{ 
                mb: 6,
                color: '#777',
                maxWidth: '700px',
                mx: 'auto'
              }}
            >
              Crie memórias especiais escolhendo o plano ideal para você
            </Typography>
          </motion.div>

          <Grid container spacing={4} justifyContent="center">
            {/* Plano Essencial */}
            <Grid item xs={12} md={5}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <Paper
                  elevation={4}
                  sx={{
                    height: '100%',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    position: 'relative',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-10px)',
                      boxShadow: '0 15px 40px rgba(0,0,0,0.1)',
                    },
                  }}
                >
                  <Box sx={{ 
                    bgcolor: '#f5f7ff', 
                    py: 3, 
                    textAlign: 'center',
                    borderBottom: '1px solid rgba(0,0,0,0.06)'
                  }}>
                    <Typography variant="h5" fontWeight="bold" color="#333">
                      Plano Essencial
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Ideal para momentos especiais
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="h3" component="span" fontWeight="bold" color="#fe6b8b">
                        R$17
                      </Typography>
                      <Typography variant="body1" component="span" color="text.secondary">
                        /único
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ p: 4 }}>
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                        O que você recebe:
                      </Typography>
                      
                      <Box sx={{ mt: 2 }}>
                        {[
                          'Até 5 imagens em sua galeria',
                          'Personalização completa de temas e cores',
                          'Escolha de músicas (YouTube e Spotify)',
                          'Contador personalizado de datas',
                          'Mensagens personalizadas',
                          'Efeitos visuais exclusivos',
                          'Compartilhamento via link',
                          'QR Code para impressão',
                          'Duração: 1 ano'
                        ].map((feature, index) => (
                          <Box 
                            key={index}
                            sx={{ 
                              display: 'flex', 
                              alignItems: 'center',
                              mb: 1.5
                            }}
                          >
                            <Box
                              sx={{
                                width: 20,
                                height: 20,
                                borderRadius: '50%',
                                bgcolor: 'rgba(254, 107, 139, 0.1)',
                                color: '#fe6b8b',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mr: 1.5,
                                fontSize: '0.8rem',
                                fontWeight: 'bold'
                              }}
                            >
                              ✓
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                              {feature}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                    
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={() => navigate('/create')}
                      sx={{
                        mt: 2,
                        py: 1.5,
                        borderRadius: '8px',
                        background: 'linear-gradient(135deg, #fe6b8b 30%, #ff8e53 90%)',
                        boxShadow: '0 5px 15px rgba(254, 107, 139, 0.2)',
                        '&:hover': {
                          boxShadow: '0 8px 25px rgba(254, 107, 139, 0.3)',
                        },
                        fontWeight: 'bold'
                      }}
                    >
                      Começar Agora
                    </Button>
                  </Box>
                </Paper>
              </motion.div>
            </Grid>
            
            {/* Plano Premium */}
            <Grid item xs={12} md={5}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <Paper
                  elevation={4}
                  sx={{
                    height: '100%',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    position: 'relative',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-10px)',
                      boxShadow: '0 15px 40px rgba(0,0,0,0.1)',
                    },
                    // Adicionando destaque ao plano Premium
                    border: '3px solid #fe6b8b',
                  }}
                >
                  {/* Tag de destaque */}
                  <Box sx={{
                    position: 'absolute',
                    top: 15,
                    right: -30,
                    transform: 'rotate(45deg)',
                    bgcolor: '#fe6b8b',
                    color: 'white',
                    py: 0.5,
                    width: 150,
                    textAlign: 'center',
                    fontWeight: 'bold',
                    fontSize: '0.75rem',
                    zIndex: 1,
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                  }}>
                    MAIS POPULAR
                  </Box>
                  
                  <Box sx={{ 
                    bgcolor: '#fff8f8', 
                    py: 3, 
                    textAlign: 'center',
                    borderBottom: '1px solid rgba(0,0,0,0.06)'
                  }}>
                    <Typography variant="h5" fontWeight="bold" color="#333">
                      Plano Premium
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Para memórias eternas
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="h3" component="span" fontWeight="bold" color="#fe6b8b">
                        R$27
                      </Typography>
                      <Typography variant="body1" component="span" color="text.secondary">
                        /único
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ p: 4 }}>
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                        O que você recebe:
                      </Typography>
                      
                      <Box sx={{ mt: 2 }}>
                        {[
                          'Até 8 imagens em sua galeria',
                          'Personalização completa de temas e cores',
                          'Escolha de músicas (YouTube e Spotify)',
                          'Contador personalizado de datas',
                          'Mensagens personalizadas',
                          'Efeitos visuais exclusivos',
                          'Compartilhamento via link',
                          'QR Code para impressão',
                          'Duração: Eterna'
                        ].map((feature, index) => (
                          <Box 
                            key={index}
                            sx={{ 
                              display: 'flex', 
                              alignItems: 'center',
                              mb: 1.5
                            }}
                          >
                            <Box
                              sx={{
                                width: 20,
                                height: 20,
                                borderRadius: '50%',
                                bgcolor: 'rgba(254, 107, 139, 0.1)',
                                color: '#fe6b8b',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mr: 1.5,
                                fontSize: '0.8rem',
                                fontWeight: 'bold'
                              }}
                            >
                              ✓
                            </Box>
                            <Typography 
                              variant="body2" 
                              color={feature === 'Duração: Eterna' ? '#fe6b8b' : 'text.secondary'}
                              fontWeight={feature === 'Duração: Eterna' ? 'bold' : 'normal'}
                            >
                              {feature}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                    
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={() => navigate('/create')}
                      sx={{
                        mt: 2,
                        py: 1.5,
                        borderRadius: '8px',
                        background: 'linear-gradient(135deg, #fe6b8b 30%, #ff8e53 90%)',
                        boxShadow: '0 5px 15px rgba(254, 107, 139, 0.3)',
                        '&:hover': {
                          boxShadow: '0 8px 25px rgba(254, 107, 139, 0.4)',
                        },
                        fontWeight: 'bold'
                      }}
                    >
                      Escolher Premium
                    </Button>
                  </Box>
                </Paper>
              </motion.div>
            </Grid>
          </Grid>
          
          {/* Informações de Aquisições e Avaliações */}
          <Box sx={{ 
            textAlign: 'center', 
            mt: 6, 
            mb: 4,
            maxWidth: '600px',
            mx: 'auto'
          }}>
            <Box sx={{ 
              mb: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Typography 
                variant="body1" 
                color="text.secondary"
                sx={{ fontWeight: 'medium' }}
              >
                <Box component="span" sx={{ fontWeight: 'bold', color: '#fe6b8b' }}>374</Box> pessoas já adquiriram nossos planos
              </Typography>
            </Box>
            
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              justifyContent: 'center',
              gap: 0.5,
              mb: 1
            }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Box 
                  key={star}
                  component="span" 
                  sx={{ 
                    color: star <= 5 ? '#FFD700' : '#e0e0e0',
                    fontSize: '1.4rem'
                  }}
                >
                  ★
                </Box>
              ))}
              <Typography 
                variant="h6" 
                sx={{ 
                  ml: 1,
                  fontWeight: 'bold',
                  color: '#333'
                }}
              >
                4.7
              </Typography>
            </Box>
            
            <Typography variant="body2" color="text.secondary">
              Avaliação baseada em <Box component="span" sx={{ fontWeight: 'medium' }}>259</Box> opiniões
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Call to Action */}
      <Box 
        sx={{ 
          py: 10, 
          bgcolor: '#f9f9f9',
          textAlign: 'center'
        }}
      >
        <Container maxWidth="md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Typography 
              variant="h3" 
              component="h2" 
              sx={{ 
                mb: 3, 
                fontWeight: 'bold',
                fontSize: { xs: '2rem', md: '3rem' },
              }}
            >
              Pronto Para Criar Sua Memória?
            </Typography>
            
            <Typography 
              variant="subtitle1" 
              sx={{ 
                mb: 5,
                color: '#666',
                maxWidth: '700px',
                mx: 'auto',
                fontSize: { xs: '1rem', md: '1.2rem' },
              }}
            >
              Comece agora a criar uma experiência única e emocionante que ficará guardada para sempre no coração de quem você ama.
            </Typography>
            
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/create')}
              endIcon={<ArrowForwardIcon />}
              sx={{
                bgcolor: 'linear-gradient(135deg, #fe6b8b 30%, #ff8e53 90%)',
                background: 'linear-gradient(135deg, #fe6b8b 30%, #ff8e53 90%)',
                py: 1.5,
                px: 5,
                fontSize: '1.2rem',
                borderRadius: '30px',
                boxShadow: '0 8px 20px rgba(254, 107, 139, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #fe6b8b 40%, #ff8e53 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 28px rgba(254, 107, 139, 0.4)',
                },
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
            >
              Começar Agora
            </Button>
          </motion.div>
        </Container>
      </Box>
    </Box>
  );
}