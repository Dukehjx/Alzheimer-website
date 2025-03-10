import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Button, 
  useTheme,
  Paper,
  Divider,
  Stack
} from '@mui/material';
import AssessmentIcon from '@mui/icons-material/Assessment';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PsychologyIcon from '@mui/icons-material/Psychology';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TimelineIcon from '@mui/icons-material/Timeline';
import SiteMetadata from '../components/SiteMetadata';

function HomePage() {
  const theme = useTheme();

  return (
    <>
      <SiteMetadata 
        title="BrainGuard AI - Early Detection & Alzheimer's Prevention"
        description="AI-Powered Platform for Early Detection of MCI & Alzheimer's Prevention - Use our innovative tools for cognitive assessment and training"
        keywords="Alzheimer's, MCI, cognitive health, AI detection, memory, brain health, early diagnosis, prevention"
        ogImage="/brain-icon.svg"
      />
      
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          height: '80vh',
          minHeight: '500px',
          display: 'flex',
          alignItems: 'center',
          background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
          color: 'white',
          overflow: 'hidden',
          pt: 8,
          pb: 6
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
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3z" fill="%23ffffff" fill-opacity="0.1" fill-rule="evenodd"/%3E%3C/svg%3E")',
            opacity: 0.3,
          }}
        />
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Typography
                component="h1"
                variant="h2"
                sx={{
                  fontWeight: 'bold',
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  mb: 2,
                }}
              >
                AI-Powered Platform for Early Detection of MCI & Alzheimer's Prevention
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  mb: 4,
                  fontWeight: 300,
                  lineHeight: 1.5,
                  opacity: 0.9
                }}
              >
                Detect cognitive changes early, preserve memory, and prevent Alzheimer's through our innovative AI-driven assessment tools.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button
                  component={RouterLink}
                  to="/screening"
                  variant="contained"
                  size="large"
                  color="secondary"
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    py: 1.5,
                    px: 4,
                    fontWeight: 'bold',
                    boxShadow: '0 4px 14px 0 rgba(0,0,0,0.2)',
                  }}
                >
                  Start Assessment
                </Button>
                <Button
                  component={RouterLink}
                  to="/resources"
                  variant="outlined"
                  size="large"
                  sx={{
                    py: 1.5,
                    px: 4,
                    borderColor: 'white',
                    color: 'white',
                    '&:hover': {
                      borderColor: 'white',
                      backgroundColor: 'rgba(255,255,255,0.1)',
                    },
                  }}
                >
                  Learn More
                </Button>
              </Stack>
            </Grid>
            <Grid item xs={12} md={5} sx={{ display: { xs: 'none', md: 'block' } }}>
              <Paper
                elevation={6}
                sx={{
                  p: 2,
                  bgcolor: 'rgba(255,255,255,0.95)',
                  transform: 'rotate(2deg)',
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: '-10px',
                    right: '-10px',
                    width: '100%',
                    height: '100%',
                    background: theme.palette.secondary.main,
                    zIndex: -1,
                    transform: 'rotate(-4deg)',
                    opacity: 0.6,
                  },
                }}
              >
                <Box 
                  component="img" 
                  src="https://images.unsplash.com/photo-1559757175-7b21e27fd856?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                  alt="Brain visualization" 
                  sx={{ width: '100%', borderRadius: 1 }} 
                />
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
      
      {/* Statistics Section */}
      <Box sx={{ bgcolor: theme.palette.grey[50], py: 6 }}>
        <Container maxWidth="lg">
          <Grid container spacing={3} justifyContent="center">
            {[
              { number: '6.5M', label: 'Americans Living with Alzheimer\'s' },
              { number: '1 in 9', label: 'People Age 65+ Have Alzheimer\'s' },
              { number: '72%', label: 'Risk Reduction with Early Intervention' },
              { number: '10-15 Yrs', label: 'Symptoms Begin Before Diagnosis' }
            ].map((stat, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card 
                  elevation={0}
                  sx={{ 
                    textAlign: 'center', 
                    height: '100%',
                    backgroundColor: 'transparent',
                    transition: 'transform 0.3s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                    }
                  }}
                >
                  <CardContent>
                    <Typography variant="h3" color="primary" sx={{ fontWeight: 'bold', mb: 1 }}>
                      {stat.number}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {stat.label}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
      
      {/* Features Section */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Typography
            component="h2"
            variant="h3"
            align="center"
            sx={{ 
              mb: 2,
              fontWeight: 'bold',
              color: theme.palette.primary.main
            }}
          >
            Our Core Features
          </Typography>
          <Typography 
            variant="h6" 
            align="center" 
            color="text.secondary" 
            sx={{ 
              mb: 6,
              maxWidth: '800px',
              mx: 'auto'
            }}
          >
            Comprehensive tools designed to detect, monitor, and help prevent cognitive decline
          </Typography>
          
          <Grid container spacing={4}>
            {[
              {
                title: 'AI Screening',
                description: 'Early detection through AI language analysis of speech patterns, vocabulary usage, and linguistic markers associated with cognitive decline.',
                icon: <AssessmentIcon sx={{ fontSize: 60 }} />,
                link: '/screening'
              },
              {
                title: 'Cognitive Training',
                description: 'Personalized exercises and activities scientifically designed to maintain and strengthen cognitive abilities and neural pathways.',
                icon: <FitnessCenterIcon sx={{ fontSize: 60 }} />,
                link: '/training'
              },
              {
                title: 'Resource Hub',
                description: 'Comprehensive information, latest research, and supportive community for patients, caregivers, and healthcare professionals.',
                icon: <LibraryBooksIcon sx={{ fontSize: 60 }} />,
                link: '/resources'
              }
            ].map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 20px -10px rgba(0,0,0,0.2)',
                      '& .MuiCardMedia-root': {
                        bgcolor: theme.palette.primary.main,
                        '& svg': {
                          transform: 'scale(1.1)',
                        },
                      },
                    },
                  }}
                >
                  <CardMedia
                    sx={{
                      p: 3,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      bgcolor: theme.palette.primary.light,
                      color: 'white',
                      height: 140,
                      transition: 'all 0.3s',
                    }}
                    className="MuiCardMedia-root"
                  >
                    {feature.icon}
                  </CardMedia>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h3" sx={{ fontWeight: 500 }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" paragraph>
                      {feature.description}
                    </Typography>
                    <Button
                      component={RouterLink}
                      to={feature.link}
                      size="small"
                      color="primary"
                      endIcon={<ArrowForwardIcon />}
                      sx={{ mt: 1 }}
                    >
                      Learn More
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
      
      {/* How It Works Section */}
      <Box sx={{ py: 8, bgcolor: theme.palette.grey[50] }}>
        <Container maxWidth="lg">
          <Typography
            component="h2"
            variant="h3"
            align="center"
            sx={{ 
              mb: 2,
              fontWeight: 'bold',
              color: theme.palette.primary.main
            }}
          >
            How It Works
          </Typography>
          <Typography 
            variant="h6" 
            align="center" 
            color="text.secondary" 
            sx={{ 
              mb: 6,
              maxWidth: '800px',
              mx: 'auto'
            }}
          >
            Our simple four-step process makes early detection and prevention accessible to everyone
          </Typography>
          
          <Grid container spacing={4} justifyContent="center">
            {[
              {
                number: '01',
                title: 'Record Speech Sample',
                description: 'Submit a short speech recording or text sample through our secure platform.',
                icon: <PsychologyIcon fontSize="large" />
              },
              {
                number: '02',
                title: 'AI Analysis',
                description: 'Our advanced AI algorithms analyze linguistic patterns and cognitive markers.',
                icon: <TimelineIcon fontSize="large" />
              },
              {
                number: '03',
                title: 'Receive Assessment',
                description: 'Get immediate feedback on potential cognitive health indicators and risk factors.',
                icon: <AssessmentIcon fontSize="large" />
              },
              {
                number: '04',
                title: 'Personalized Plan',
                description: 'Receive tailored recommendations for cognitive training and lifestyle adjustments.',
                icon: <TrendingUpIcon fontSize="large" />
              }
            ].map((step, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Paper
                  elevation={1}
                  sx={{
                    p: 3,
                    height: '100%',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'transform 0.3s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: theme.shadows[4],
                    },
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      p: 2,
                      color: theme.palette.primary.main,
                      fontWeight: 'bold',
                      fontSize: '1.5rem',
                      opacity: 0.2,
                    }}
                  >
                    {step.number}
                  </Box>
                  <Box sx={{ mb: 2, color: theme.palette.primary.main }}>
                    {step.icon}
                  </Box>
                  <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
                    {step.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {step.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
      
      {/* CTA Section */}
      <Box 
        sx={{ 
          py: 8, 
          background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
          color: 'white',
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h3" component="h2" sx={{ fontWeight: 'bold', mb: 3 }}>
            Start Your Brain Health Journey Today
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9, maxWidth: '800px', mx: 'auto' }}>
            Join thousands of users who are taking proactive steps to protect their cognitive health with our AI-powered platform.
          </Typography>
          <Button
            component={RouterLink}
            to="/screening"
            variant="contained"
            color="secondary"
            size="large"
            sx={{ 
              py: 1.5, 
              px: 4, 
              fontWeight: 'bold',
              boxShadow: '0 4px 14px 0 rgba(0,0,0,0.2)',
            }}
          >
            Start Free Assessment
          </Button>
        </Container>
      </Box>
    </>
  );
}

export default HomePage; 