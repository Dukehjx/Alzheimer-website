import React from 'react';
import { Box, Container, Grid, Typography, Link, IconButton, Divider } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import YouTubeIcon from '@mui/icons-material/YouTube';

const Footer = () => {
  return (
    <Box 
      component="footer" 
      sx={{ 
        bgcolor: 'background.paper',
        py: 6,
        borderTop: '1px solid',
        borderColor: 'divider',
        mt: 'auto'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="space-between">
          {/* Logo and description */}
          <Grid item xs={12} sm={4} md={3}>
            <Typography 
              variant="h6" 
              color="primary" 
              gutterBottom 
              sx={{ fontWeight: 'bold' }}
            >
              BrainGuard AI
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              AI-Powered Platform for Early Detection of MCI & Alzheimer's Prevention
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton size="small" color="primary" aria-label="facebook">
                <FacebookIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" color="primary" aria-label="twitter">
                <TwitterIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" color="primary" aria-label="instagram">
                <InstagramIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" color="primary" aria-label="linkedin">
                <LinkedInIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" color="primary" aria-label="youtube">
                <YouTubeIcon fontSize="small" />
              </IconButton>
            </Box>
          </Grid>

          {/* Site Navigation */}
          <Grid item xs={6} sm={4} md={2}>
            <Typography variant="subtitle1" color="text.primary" gutterBottom>
              Navigation
            </Typography>
            <Link component={RouterLink} to="/" color="inherit" display="block" sx={{ mb: 1 }}>
              Home
            </Link>
            <Link component={RouterLink} to="/screening" color="inherit" display="block" sx={{ mb: 1 }}>
              AI Screening
            </Link>
            <Link component={RouterLink} to="/cognitive-training" color="inherit" display="block" sx={{ mb: 1 }}>
              Cognitive Training
            </Link>
            <Link component={RouterLink} to="/resources" color="inherit" display="block" sx={{ mb: 1 }}>
              Resource Hub
            </Link>
            <Link component={RouterLink} to="/health-monitoring" color="inherit" display="block">
              Health Monitoring
            </Link>
          </Grid>

          {/* Resources */}
          <Grid item xs={6} sm={4} md={2}>
            <Typography variant="subtitle1" color="text.primary" gutterBottom>
              Resources
            </Typography>
            <Link href="#" color="inherit" display="block" sx={{ mb: 1 }}>
              Research
            </Link>
            <Link href="#" color="inherit" display="block" sx={{ mb: 1 }}>
              FAQ
            </Link>
            <Link href="#" color="inherit" display="block" sx={{ mb: 1 }}>
              Support
            </Link>
            <Link href="#" color="inherit" display="block" sx={{ mb: 1 }}>
              Caregivers
            </Link>
            <Link href="#" color="inherit" display="block">
              Researchers
            </Link>
          </Grid>

          {/* Legal */}
          <Grid item xs={6} sm={4} md={2}>
            <Typography variant="subtitle1" color="text.primary" gutterBottom>
              Legal
            </Typography>
            <Link href="#" color="inherit" display="block" sx={{ mb: 1 }}>
              Terms of Service
            </Link>
            <Link href="#" color="inherit" display="block" sx={{ mb: 1 }}>
              Privacy Policy
            </Link>
            <Link href="#" color="inherit" display="block" sx={{ mb: 1 }}>
              Cookie Policy
            </Link>
            <Link href="#" color="inherit" display="block">
              HIPAA Compliance
            </Link>
          </Grid>

          {/* Contact */}
          <Grid item xs={6} sm={4} md={2}>
            <Typography variant="subtitle1" color="text.primary" gutterBottom>
              Contact Us
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Email: info@brainguard.ai
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Phone: +1-800-123-4567
            </Typography>
            <Link href="#" color="primary" sx={{ fontWeight: 'medium' }}>
              Contact Form
            </Link>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 4 }} />
        
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="body2" color="text.secondary">
              © {new Date().getFullYear()} BrainGuard AI. All rights reserved.
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="body2" color="text.secondary">
              Made with ❤️ for brain health
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer; 