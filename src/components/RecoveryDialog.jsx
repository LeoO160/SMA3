import React from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Typography, 
  Box 
} from '@mui/material';
import RestoreIcon from '@mui/icons-material/Restore';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import { motion } from 'framer-motion';

export default function RecoveryDialog({ open, onClose, onRestart, onContinue }) {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: 2,
          width: { xs: '90%', sm: '400px' },
          maxWidth: '450px',
          overflowY: 'visible'
        }
      }}
    >
      <DialogTitle sx={{ 
        pb: 1, 
        fontSize: { xs: '1.1rem', sm: '1.3rem' },
        textAlign: 'center',
        fontWeight: 'bold'
      }}>
        Dados de preenchimento encontrados
      </DialogTitle>
      
      <DialogContent>
        <Typography variant="body1" sx={{ mb: 2, textAlign: 'center' }}>
          Encontramos dados de preenchimento anteriores. O que deseja fazer?
        </Typography>
        
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' }, 
          gap: 2, 
          justifyContent: 'center',
          mt: 2
        }}>
          <Button
            component={motion.button}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            variant="outlined"
            color="error"
            startIcon={<DeleteSweepIcon />}
            onClick={onRestart}
            fullWidth
            sx={{ 
              borderRadius: 2,
              py: 1.5,
              fontWeight: 'medium'
            }}
          >
            Recomeçar
          </Button>
          
          <Button
            component={motion.button}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            variant="contained"
            color="primary"
            startIcon={<RestoreIcon />}
            onClick={onContinue}
            fullWidth
            sx={{ 
              borderRadius: 2,
              py: 1.5,
              fontWeight: 'medium'
            }}
          >
            Continuar de onde parou
          </Button>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
        <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center' }}>
          Os dados são salvos apenas neste dispositivo
        </Typography>
      </DialogActions>
    </Dialog>
  );
} 