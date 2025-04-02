import { useState } from 'react';
import { Box, Typography, Paper, Grid, Button, FormControl, InputLabel, Select, MenuItem, Slider } from '@mui/material';
import { CirclePicker } from 'react-color';

const StyleCustomizer = ({ 
  onStyleChange,
  title = 'Personalizar Estilo da Página' 
}) => {
  const [tempStyle, setTempStyle] = useState({
    backgroundColor: '#ffffff',
    fontFamily: "'Poppins', sans-serif",
    titleSize: 48
  });
  
  const fonts = [
    { name: 'Poppins', value: "'Poppins', sans-serif" },
    { name: 'Dancing Script', value: "'Dancing Script', cursive" },
    { name: 'Playfair Display', value: "'Playfair Display', serif" },
    { name: 'Libre Baskerville', value: "'Libre Baskerville', serif" },
    { name: 'Quicksand', value: "'Quicksand', sans-serif" },
  ];

  const colors = [
    '#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5',
    '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50',
    '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800',
    '#ff5722', '#795548', '#607d8b', '#000000', '#ffffff',
  ];

  const handleBgColorChange = (color) => {
    const newStyle = { ...tempStyle, backgroundColor: color.hex };
    setTempStyle(newStyle);
    onStyleChange(newStyle);
  };

  const handleFontChange = (event) => {
    const newStyle = { ...tempStyle, fontFamily: event.target.value };
    setTempStyle(newStyle);
    onStyleChange(newStyle);
  };

  const handleTitleSizeChange = (event, newValue) => {
    const newStyle = { ...tempStyle, titleSize: newValue };
    setTempStyle(newStyle);
    onStyleChange(newStyle);
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Cor de Fundo
        </Typography>
        <CirclePicker
          colors={colors}
          color={tempStyle.backgroundColor}
          onChange={handleBgColorChange}
          width="100%"
        />
      </Box>
      
      <Box sx={{ mb: 3 }}>
        <FormControl fullWidth>
          <InputLabel id="font-select-label">Fonte Principal</InputLabel>
          <Select
            labelId="font-select-label"
            id="font-select"
            value={tempStyle.fontFamily}
            label="Fonte Principal"
            onChange={handleFontChange}
          >
            {fonts.map((fontOption) => (
              <MenuItem 
                key={fontOption.value} 
                value={fontOption.value}
                sx={{ fontFamily: fontOption.value }}
              >
                {fontOption.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Tamanho do Título: {tempStyle.titleSize}px
        </Typography>
        <Slider
          value={tempStyle.titleSize}
          onChange={handleTitleSizeChange}
          min={24}
          max={96}
          step={2}
          marks={[
            { value: 24, label: '24px' },
            { value: 48, label: '48px' },
            { value: 72, label: '72px' },
            { value: 96, label: '96px' },
          ]}
        />
      </Box>
      
      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          Pré-visualização
        </Typography>
        <Box 
          sx={{ 
            p: 3, 
            border: '1px solid #e0e0e0', 
            borderRadius: 1, 
            backgroundColor: tempStyle.backgroundColor,
            transition: 'all 0.3s ease'
          }}
        >
          <Typography 
            variant="h4" 
            sx={{ 
              fontFamily: tempStyle.fontFamily,
              fontSize: `${tempStyle.titleSize/16}rem`,
              mb: 2
            }}
          >
            Título de Exemplo
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              fontFamily: tempStyle.fontFamily
            }}
          >
            Exemplo de texto com o estilo selecionado
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default StyleCustomizer;
