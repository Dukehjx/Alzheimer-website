import React from 'react';
import { Box, Button, Container, Typography, Paper } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useTheme } from '@mui/material/styles';

const NotFoundPage = () => {
  const theme = useTheme();

  return (
    <Container component="main" maxWidth="md" sx={{ py: 12 }} id="main-content">
      <Paper 
        elevation={3} 
        sx={{ 
          py: 6, 
          px: 4,
          textAlign: 'center',
          borderRadius: 2,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Background pattern */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            backgroundColor: theme.palette.grey[50],
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            zIndex: -1,
          }}
        />
        
        <Box sx={{ mb: 3 }}>
          <ErrorOutlineIcon 
            sx={{ 
              fontSize: 120, 
              color: theme.palette.error.main,
              opacity: 0.8
            }} 
          />
        </Box>
        
        <Typography 
          variant="h1" 
          component="h1" 
          sx={{ 
            fontSize: { xs: '4rem', md: '6rem' },
            fontWeight: 'bold',
            color: theme.palette.grey[800],
            lineHeight: 1.1,
            mb: 2
          }}
        >
          404
        </Typography>
        
        <Typography 
          variant="h4" 
          component="h2" 
          sx={{ 
            mb: 3,
            color: theme.palette.text.primary
          }}
        >
          Page Not Found
        </Typography>
        
        <Typography 
          variant="body1" 
          color="text.secondary" 
          sx={{ 
            maxWidth: 500, 
            mx: 'auto',
            mb: 4
          }}
        >
          We couldn't find the page you're looking for. The page may have been moved, 
          deleted, or possibly never existed.
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Button 
            component={RouterLink} 
            to="/" 
            variant="contained" 
            color="primary"
            startIcon={<ArrowBackIcon />}
            size="large"
            sx={{ px: 3, py: 1 }}
          >
            Back to Home
          </Button>
          
          <Button 
            component={RouterLink} 
            to="/resources" 
            variant="outlined"
            size="large"
            sx={{ px: 3, py: 1 }}
          >
            View Resources
          </Button>
        </Box>
      </Paper>
      
      <Box mt={6} textAlign="center">
        <Typography variant="body2" color="text.secondary">
          If you believe this is an error with our website, please{' '}
          <RouterLink to="/contact" style={{ color: theme.palette.primary.main }}>
            contact our support team
          </RouterLink>.
        </Typography>
      </Box>
    </Container>
  );
};

export default NotFoundPage; 