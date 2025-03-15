import React from 'react';
import { 
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Typography,
  Paper,
  Stack,
  useTheme,
  Divider
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import AssessmentIcon from '@mui/icons-material/Assessment';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useAuth } from '../contexts/AuthContext';

const HeroSection = () => {
  const theme = useTheme();
  const { isAuthenticated } = useAuth();
  
  return (
    <Box
      sx={{
        position: 'relative',
        height: '75vh',
        minHeight: '500px',
        display: 'flex',
        alignItems: 'center',
        background: `linear-gradient(45deg, ${theme.palette.primary.main}dd 0%, ${theme.palette.secondary.main}dd 100%)`,
        color: 'white',
        overflow: 'hidden',
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
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z" fill="%23ffffff" fill-opacity="0.1" fill-rule="evenodd"/%3E%3C/svg%3E")',
          opacity: 0.3,
        }}
      />
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={7}>
            <Box sx={{ mb: 4 }}>
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
                }}
              >
                Detect cognitive changes early, preserve memory, and prevent Alzheimer's through our innovative AI-driven assessment tools.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button
                  component={RouterLink}
                  to={isAuthenticated ? "/screening" : "/register"}
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
                  {isAuthenticated ? "Start Assessment" : "Join For Free"}
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
            </Box>
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
              <Box component="img" src="https://images.unsplash.com/photo-1573497491208-6b1acb260507?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80" alt="Brain scan visualization" sx={{ width: '100%', borderRadius: 1 }} />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

const StatisticsSection = () => {
  const theme = useTheme();
  
  return (
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
  );
};

const FeatureCard = ({ icon, title, description, link }) => {
  const theme = useTheme();
  
  return (
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
        {icon}
      </CardMedia>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="h2" sx={{ fontWeight: 500 }}>
          {title}
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          {description}
        </Typography>
        <Button
          component={RouterLink}
          to={link}
          size="small"
          color="primary"
          endIcon={<ArrowForwardIcon />}
          sx={{ mt: 1 }}
        >
          Learn More
        </Button>
      </CardContent>
    </Card>
  );
};

const FeaturesSection = () => {
  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography variant="h3" component="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
            Our Platform Features
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 800, mx: 'auto' }}>
            Comprehensive tools to detect, monitor, and combat cognitive decline through AI-powered analysis and personalized interventions.
          </Typography>
        </Box>
        
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} lg={3}>
            <FeatureCard 
              icon={<AssessmentIcon sx={{ fontSize: 80, transition: 'transform 0.3s' }} />}
              title="AI Screening"
              description="Early detection through AI language analysis of speech patterns, vocabulary usage, and linguistic markers associated with cognitive decline."
              link="/screening"
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <FeatureCard 
              icon={<FitnessCenterIcon sx={{ fontSize: 80, transition: 'transform 0.3s' }} />}
              title="Cognitive Training"
              description="Personalized exercises and activities scientifically designed to maintain and strengthen cognitive abilities and neural pathways."
              link="/cognitive-training"
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <FeatureCard 
              icon={<LibraryBooksIcon sx={{ fontSize: 80, transition: 'transform 0.3s' }} />}
              title="Resource Hub"
              description="Comprehensive information, latest research, and supportive community for patients, caregivers, and healthcare professionals."
              link="/resources"
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <FeatureCard 
              icon={<MonitorHeartIcon sx={{ fontSize: 80, transition: 'transform 0.3s' }} />}
              title="Health Monitoring"
              description="Track cognitive changes over time with periodic assessments and progress reports to share with healthcare providers."
              link="/health-monitoring"
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

const HowItWorksSection = () => {
  const theme = useTheme();
  
  const steps = [
    {
      number: '01',
      title: 'Record Speech Sample',
      description: 'Submit a short speech recording or text sample through our secure platform.'
    },
    {
      number: '02',
      title: 'AI Analysis',
      description: 'Our advanced AI algorithms analyze linguistic patterns and cognitive markers.'
    },
    {
      number: '03',
      title: 'Receive Assessment',
      description: 'Get immediate feedback on potential cognitive health indicators and risk factors.'
    },
    {
      number: '04',
      title: 'Personalized Plan',
      description: 'Receive tailored recommendations for cognitive training and lifestyle adjustments.'
    }
  ];
  
  return (
    <Box sx={{ py: 8, bgcolor: theme.palette.grey[50] }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography variant="h3" component="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
            How It Works
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 800, mx: 'auto' }}>
            Our AI-powered platform makes cognitive assessment simple, accessible, and non-invasive.
          </Typography>
        </Box>
        
        <Grid container spacing={4}>
          {steps.map((step, index) => (
            <Grid item xs={12} md={6} lg={3} key={index}>
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  height: '100%',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'transform 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '5px',
                    height: '100%',
                    backgroundColor: theme.palette.primary.main,
                  }
                }}
              >
                <Typography
                  variant="h1"
                  sx={{
                    position: 'absolute',
                    top: -20,
                    right: -10,
                    fontSize: '8rem',
                    fontWeight: 'bold',
                    color: theme.palette.grey[100],
                    zIndex: 0,
                  }}
                >
                  {step.number}
                </Typography>
                <Box sx={{ position: 'relative', zIndex: 1 }}>
                  <Typography variant="h5" component="h3" sx={{ mb: 2, fontWeight: 'medium' }}>
                    {step.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {step.description}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

const TestimonialsSection = () => {
  const theme = useTheme();
  
  const testimonials = [
    {
      quote: "The early detection allowed me to start interventions years before I would have received a traditional diagnosis. It's been life-changing.",
      author: "Robert J.",
      role: "User, 67"
    },
    {
      quote: "As a neurologist, I've seen how this platform helps patients catch cognitive changes much earlier than standard clinical assessments.",
      author: "Dr. Sarah Miller",
      role: "Neurologist"
    },
    {
      quote: "The cognitive training exercises have noticeably improved my mother's memory and speech fluency over the past six months.",
      author: "Michael T.",
      role: "Caregiver"
    }
  ];
  
  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography variant="h3" component="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
            Success Stories
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 800, mx: 'auto' }}>
            Hear from patients, caregivers, and healthcare professionals who have experienced the benefits of our platform.
          </Typography>
        </Box>
        
        <Grid container spacing={4}>
          {testimonials.map((testimonial, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card 
                sx={{ 
                  height: '100%',
                  position: 'relative',
                  p: 3,
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                  }
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: 16,
                    left: 16,
                    color: theme.palette.grey[200],
                    fontSize: '5rem',
                    lineHeight: 1,
                    fontFamily: 'Georgia, serif',
                  }}
                >
                  "
                </Box>
                <CardContent sx={{ position: 'relative' }}>
                  <Typography variant="body1" paragraph sx={{ pt: 3, fontStyle: 'italic' }}>
                    {testimonial.quote}
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    {testimonial.author}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {testimonial.role}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

const CTASection = () => {
  const theme = useTheme();
  const { isAuthenticated } = useAuth();
  
  return (
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
        <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
          Join thousands of users who are taking proactive steps to protect their cognitive health with our AI-powered platform.
        </Typography>
        <Button
          component={RouterLink}
          to={isAuthenticated ? "/screening" : "/register"}
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
          {isAuthenticated ? "Start Assessment" : "Sign Up for Free"}
        </Button>
      </Container>
    </Box>
  );
};

const HomePage = () => {
  return (
    <Box component="main" id="main-content">
      <HeroSection />
      <StatisticsSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <CTASection />
    </Box>
  );
};

export default HomePage; 