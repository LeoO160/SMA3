import React, { useState } from 'react';
import { Box, Typography, Paper, Tooltip, Button, Popover, IconButton } from '@mui/material';
import './ThemeSelector.css';
import { CirclePicker } from 'react-color';
import PaletteIcon from '@mui/icons-material/Palette';
import AddIcon from '@mui/icons-material/Add';

export default function ThemeSelector({ selectedTheme, onSelectTheme }) {
  const [customColorAnchorEl, setCustomColorAnchorEl] = useState(null);
  const [customBgColor, setCustomBgColor] = useState('#f5f5f5');

  // Paleta de cores expandida para o seletor personalizado
  const colorPalette = [
    // Cores básicas
    '#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', 
    '#009688', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722',
    
    // Tons claros
    '#ffcdd2', '#f8bbd0', '#e1bee7', '#d1c4e9', '#c5cae9', '#bbdefb', '#b3e5fc', '#b2ebf2',
    '#b2dfdb', '#c8e6c9', '#dcedc8', '#f0f4c3', '#fff9c4', '#ffecb3', '#ffe0b2', '#ffccbc',
    
    // Tons médios
    '#ef9a9a', '#f48fb1', '#ce93d8', '#b39ddb', '#9fa8da', '#90caf9', '#81d4fa', '#80deea',
    '#80cbc4', '#a5d6a7', '#c5e1a5', '#e6ee9c', '#fff59d', '#ffe082', '#ffcc80', '#ffab91',
    
    // Tons escuros
    '#d32f2f', '#c2185b', '#7b1fa2', '#512da8', '#303f9f', '#1976d2', '#0288d1', '#0097a7',
    '#00796b', '#388e3c', '#689f38', '#afb42b', '#fbc02d', '#ffa000', '#f57c00', '#e64a19',
    
    // Cores adicionais
    '#795548', '#9e9e9e', '#607d8b', '#000000', '#ffffff', 
    
    // Cores pastel
    '#ffcce6', '#ffccf2', '#e6ccff', '#ccf2ff', '#ccffcc', '#ffffcc', '#ffebcc', '#ffcccc',
    
    // Cores de alto contraste
    '#1a237e', '#880e4f', '#004d40', '#b71c1c', '#f57f17', '#4a148c', '#0d47a1', '#006064'
  ];

  // Definir os temas disponíveis
  const themes = [
    { 
      id: 'default', 
      name: 'Padrão', 
      webBgColor: '#fafafa',
      titleBgColor: '#ffffff',
      messageBgColor: '#ffffff',
      counterBgColor: '#ffffff',
      description: 'Tema padrão com fundo claro e cards brancos'
    },
    { 
      id: 'dark', 
      name: 'Escuro', 
      webBgColor: '#121212',
      titleBgColor: '#1e1e1e',
      messageBgColor: '#1e1e1e',
      counterBgColor: '#1e1e1e',
      description: 'Tema escuro com tons de preto e cinza'
    },
    { 
      id: 'pastel', 
      name: 'Pastel', 
      webBgColor: '#f5e6e8',
      titleBgColor: '#d5c6e0',
      messageBgColor: '#aaa1c8',
      counterBgColor: '#967aa1',
      description: 'Cores suaves em tons pastel'
    },
    { 
      id: 'ocean', 
      name: 'Oceano', 
      webBgColor: '#e0f7fa',
      titleBgColor: '#b2ebf2',
      messageBgColor: '#80deea',
      counterBgColor: '#4dd0e1',
      description: 'Tons relaxantes de azul inspirados no oceano'
    },
    { 
      id: 'sunset', 
      name: 'Pôr do Sol', 
      webBgColor: '#ffccbc',
      titleBgColor: '#ffab91',
      messageBgColor: '#ff8a65',
      counterBgColor: '#ff7043',
      description: 'Cores quentes inspiradas no pôr do sol'
    },
    { 
      id: 'forest', 
      name: 'Floresta', 
      webBgColor: '#e8f5e9',
      titleBgColor: '#c8e6c9',
      messageBgColor: '#a5d6a7',
      counterBgColor: '#81c784',
      description: 'Tons verdes inspirados na natureza'
    },
    { 
      id: 'lgbt', 
      name: 'Arco-íris', 
      webBgColor: 'linear-gradient(135deg, #ff69b4 0%, #e91e63 16%, #ff9800 33%, #ffeb3b 50%, #4caf50 66%, #2196f3 83%, #9c27b0 100%)',
      titleBgColor: 'rgba(255, 255, 255, 0.85)',
      messageBgColor: 'rgba(255, 255, 255, 0.85)',
      counterBgColor: 'rgba(255, 255, 255, 0.85)',
      description: 'Tema colorido com as cores da bandeira LGBT'
    }
  ];

  // Função para aplicar o tema selecionado
  const handleSelectTheme = (theme) => {
    console.log('Selecionando tema no ThemeSelector:', theme);
    // Garantir que estamos passando o objeto de tema completo
    if (onSelectTheme) {
      onSelectTheme(theme);
    }
  };

  // Função para abrir o seletor de cor personalizada
  const handleOpenCustomColorPicker = (event) => {
    setCustomColorAnchorEl(event.currentTarget);
  };

  // Função para fechar o seletor de cor personalizada
  const handleCloseCustomColorPicker = () => {
    setCustomColorAnchorEl(null);
  };

  // Função para aplicar a cor personalizada
  const handleCustomColorChange = (color) => {
    setCustomBgColor(color.hex);
    const customTheme = {
      id: 'custom',
      name: 'Personalizado',
      webBgColor: color.hex,
      titleBgColor: '#ffffff',
      messageBgColor: '#ffffff',
      counterBgColor: '#ffffff',
      description: 'Tema com cor de fundo personalizada'
    };
    onSelectTheme(customTheme);
  };

  // Verificar se o tema personalizado está selecionado
  const isCustomGradientSelected = selectedTheme?.id === 'custom-gradient';
  const isCustomColorSelected = selectedTheme?.id === 'custom';

  return (
    <Box className="theme-selector">
      <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'medium' }}>
        Escolha um tema
      </Typography>
      
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
        {themes.map((theme) => (
          <Tooltip key={theme.id} title={theme.description} arrow placement="top">
            <Paper
              className={`theme-option ${selectedTheme === theme.id ? 'selected' : ''}`}
              onClick={() => handleSelectTheme(theme)}
              elevation={selectedTheme === theme.id ? 3 : 1}
              sx={{
                cursor: 'pointer',
                padding: 1,
                width: 80,
                height: 80,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
                border: selectedTheme === theme.id ? '2px solid #3f51b5' : '2px solid transparent',
                '&:hover': {
                  transform: 'translateY(-3px)',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                }
              }}
            >
              <Box
                className="theme-preview"
                sx={{
                  width: 60,
                  height: 50,
                  borderRadius: 1,
                  background: theme.webBgColor,
                  backgroundImage: theme.webBgColor.includes('gradient') ? theme.webBgColor : 'none',
                  position: 'relative',
                  overflow: 'hidden',
                  mb: 0.5
                }}
              >
                {/* Card simulando o título */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: '10%',
                    left: '10%',
                    width: '80%',
                    height: '20%',
                    backgroundColor: theme.titleBgColor,
                    borderRadius: 0.5
                  }}
                />
                
                {/* Card simulando a mensagem */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: '40%',
                    left: '15%',
                    width: '70%',
                    height: '25%',
                    backgroundColor: theme.messageBgColor,
                    borderRadius: 0.5
                  }}
                />
                
                {/* Card simulando o contador */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: '75%',
                    left: '30%',
                    width: '40%',
                    height: '15%',
                    backgroundColor: theme.counterBgColor,
                    borderRadius: 0.5
                  }}
                />
              </Box>
              
              <Typography variant="caption" sx={{ fontSize: '0.7rem', textAlign: 'center' }}>
                {theme.name}
              </Typography>
            </Paper>
          </Tooltip>
        ))}

        {/* Botão para tema com cor personalizada */}
        <Tooltip title="Escolher cor personalizada" arrow placement="top">
          <Paper
            className={`theme-option ${isCustomColorSelected ? 'selected' : ''}`}
            onClick={handleOpenCustomColorPicker}
            elevation={isCustomColorSelected ? 3 : 1}
            sx={{
              cursor: 'pointer',
              padding: 1,
              width: 80,
              height: 80,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
              border: isCustomColorSelected ? '2px solid #3f51b5' : '2px solid transparent',
              '&:hover': {
                transform: 'translateY(-3px)',
                boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
              }
            }}
          >
            <Box
              className="theme-preview-custom"
              sx={{
                width: 60,
                height: 50,
                borderRadius: 1,
                background: customBgColor,
                position: 'relative',
                overflow: 'hidden',
                mb: 0.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <PaletteIcon sx={{ color: customBgColor === '#ffffff' ? '#000000' : '#ffffff', opacity: 0.7 }} />
            </Box>
            
            <Typography variant="caption" sx={{ fontSize: '0.7rem', textAlign: 'center' }}>
              Personalizado
            </Typography>
          </Paper>
        </Tooltip>

        {/* Popover para seleção de cor personalizada */}
        <Popover
          open={Boolean(customColorAnchorEl)}
          anchorEl={customColorAnchorEl}
          onClose={handleCloseCustomColorPicker}
          anchorOrigin={{
            vertical: 'center',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'center',
            horizontal: 'center',
          }}
        >
          <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, maxWidth: '350px' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>Escolha uma cor de fundo</Typography>
            <CirclePicker
              colors={colorPalette}
              color={customBgColor}
              onChange={handleCustomColorChange}
              width="320px"
              circleSize={24}
              circleSpacing={10}
            />
            <Typography variant="caption" sx={{ mt: 1, textAlign: 'center', color: 'text.secondary' }}>
              Sua seleção: <Box component="span" sx={{ fontWeight: 'bold', color: customBgColor }}>{customBgColor}</Box>
            </Typography>
          </Box>
        </Popover>

        {/* Indicador de tema personalizado selecionado */}
        {isCustomGradientSelected && (
          <Paper
            className="theme-option selected"
            elevation={3}
            sx={{
              cursor: 'default',
              padding: 1,
              width: 80,
              height: 80,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid #3f51b5',
              position: 'relative'
            }}
          >
            <Box
              className="theme-preview"
              sx={{
                width: 60,
                height: 50,
                borderRadius: 1,
                backgroundImage: 'linear-gradient(135deg, var(--gradient-color-1, #ff69b4) 0%, var(--gradient-color-2, #4caf50) 100%)',
                position: 'relative',
                overflow: 'hidden',
                mb: 0.5
              }}
            >
              {/* Card simulando o título */}
              <Box
                sx={{
                  position: 'absolute',
                  top: '10%',
                  left: '10%',
                  width: '80%',
                  height: '20%',
                  backgroundColor: 'rgba(255, 255, 255, 0.85)',
                  borderRadius: 0.5
                }}
              />
              
              {/* Card simulando a mensagem */}
              <Box
                sx={{
                  position: 'absolute',
                  top: '40%',
                  left: '15%',
                  width: '70%',
                  height: '25%',
                  backgroundColor: 'rgba(255, 255, 255, 0.85)',
                  borderRadius: 0.5
                }}
              />
              
              {/* Card simulando o contador */}
              <Box
                sx={{
                  position: 'absolute',
                  top: '75%',
                  left: '30%',
                  width: '40%',
                  height: '15%',
                  backgroundColor: 'rgba(255, 255, 255, 0.85)',
                  borderRadius: 0.5
                }}
              />
            </Box>
            
            <Typography variant="caption" sx={{ fontSize: '0.7rem', textAlign: 'center' }}>
              Personalizado
            </Typography>
          </Paper>
        )}
      </Box>
    </Box>
  );
}
