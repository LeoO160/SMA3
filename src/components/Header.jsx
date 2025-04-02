import { AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        background: 'rgba(255, 255, 255, 0.95)', 
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        height: '64px',
        zIndex: 1200
      }}
    >
      <Container maxWidth={false}>
        <Toolbar sx={{ minHeight: '64px !important' }}>
          <Box 
            onClick={() => navigate('/')}
            sx={{ 
              flexGrow: 1, 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <img 
              src="/cabecalho.png" 
              alt="SayMe Always" 
              style={{ 
                height: '45px',
                width: 'auto',
                objectFit: 'contain',
                marginRight: '10px',
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.05)'
                }
              }} 
            />
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button 
              variant="text" 
              color="primary"
              onClick={() => navigate('/home')}
              sx={{
                textTransform: 'none',
                fontWeight: 500
              }}
            >
              Home
            </Button>
            <Button 
              variant="contained" 
              color="primary"
              onClick={() => navigate('/create')}
              sx={{
                borderRadius: '20px',
                textTransform: 'none',
                px: 3,
                fontWeight: 500
              }}
            >
              Começar
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
