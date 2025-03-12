import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Grid, 
  Typography, 
  Link, 
  IconButton, 
  Divider,
  useTheme
} from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import YouTubeIcon from '@mui/icons-material/YouTube';
import InstagramIcon from '@mui/icons-material/Instagram';
import BrainIcon from '@mui/icons-material/Psychology';

function Footer() {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: 'Platform',
      links: [
        { name: 'AI Screening', path: '/screening' },
        { name: 'Cognitive Training', path: '/training' },
        { name: 'Resource Hub', path: '/resources' },
        { name: 'Health Monitoring', path: '/health-monitoring' },
      ],
    },
    {
      title: 'Company',
      links: [
        { name: 'About Us', path: '/about' },
        { name: 'Our Team', path: '/team' },
        { name: 'Careers', path: '/careers' },
        { name: 'Contact Us', path: '/contact' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { name: 'Privacy Policy', path: '/privacy' },
        { name: 'Terms of Service', path: '/terms' },
        { name: 'Cookie Policy', path: '/cookies' },
        { name: 'Data Protection', path: '/data-protection' },
      ],
    },
  ];

  return (
    <Box 
      component="footer" 
      sx={{ 
        bgcolor: 'background.paper',
        py: 6,
        borderTop: '1px solid',
        borderColor: 'divider'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="space-between">
          {/* Logo and description */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <BrainIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
                BrainGuard AI
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" paragraph>
              AI-powered platform for early detection of Mild Cognitive Impairment (MCI) and Alzheimer's prevention, 
              providing cognitive training tools and resources to promote brain health.
            </Typography>
            <Box sx={{ mt: 2 }}>
              <IconButton aria-label="Facebook" color="primary" sx={{ mr: 1 }}>
                <FacebookIcon />
              </IconButton>
              <IconButton aria-label="Twitter" color="primary" sx={{ mr: 1 }}>
                <TwitterIcon />
              </IconButton>
              <IconButton aria-label="LinkedIn" color="primary" sx={{ mr: 1 }}>
                <LinkedInIcon />
              </IconButton>
              <IconButton aria-label="YouTube" color="primary" sx={{ mr: 1 }}>
                <YouTubeIcon />
              </IconButton>
              <IconButton aria-label="Instagram" color="primary">
                <InstagramIcon />
              </IconButton>
            </Box>
          </Grid>
          
          {/* Footer links */}
          {footerLinks.map((section) => (
            <Grid item xs={6} sm={4} md={2} key={section.title}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                {section.title}
              </Typography>
              <Box component="ul" sx={{ p: 0, m: 0, listStyle: 'none' }}>
                {section.links.map((link) => (
                  <Box component="li" key={link.name} sx={{ mb: 1 }}>
                    <Link
                      component={RouterLink}
                      to={link.path}
                      underline="hover"
                      color="text.secondary"
                      sx={{
                        fontSize: '0.875rem',
                        '&:hover': { color: theme.palette.primary.main },
                      }}
                    >
                      {link.name}
                    </Link>
                  </Box>
                ))}
              </Box>
            </Grid>
          ))}
        </Grid>
        
        <Divider sx={{ my: 4 }} />
        
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            © {currentYear} BrainGuard AI. All rights reserved.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: { xs: 2, sm: 0 } }}>
            Designed with Material Design principles for optimal accessibility and user experience.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default Footer; 