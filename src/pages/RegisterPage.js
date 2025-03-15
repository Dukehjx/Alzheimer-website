import React, { useState } from 'react';
import { 
  Avatar,
  Box,
  Button,
  Checkbox,
  Container,
  Divider,
  FormControlLabel,
  Grid,
  Link,
  Paper,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import { useAuth } from '../contexts/AuthContext';

// Step 1: Account Information
const AccountInfoStep = ({ formData, handleChange, errors }) => (
  <Box>
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <TextField
          name="firstName"
          required
          fullWidth
          id="firstName"
          label="First Name"
          autoFocus
          value={formData.firstName}
          onChange={handleChange}
          error={!!errors.firstName}
          helperText={errors.firstName}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          fullWidth
          id="lastName"
          label="Last Name"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          error={!!errors.lastName}
          helperText={errors.lastName}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          value={formData.email}
          onChange={handleChange}
          error={!!errors.email}
          helperText={errors.email}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="new-password"
          value={formData.password}
          onChange={handleChange}
          error={!!errors.password}
          helperText={errors.password}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          required
          fullWidth
          name="confirmPassword"
          label="Confirm Password"
          type="password"
          id="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword}
        />
      </Grid>
    </Grid>
  </Box>
);

// Step 2: Personal Information
const PersonalInfoStep = ({ formData, handleChange, errors }) => (
  <Box>
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TextField
          required
          fullWidth
          id="dateOfBirth"
          label="Date of Birth"
          name="dateOfBirth"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={formData.dateOfBirth}
          onChange={handleChange}
          error={!!errors.dateOfBirth}
          helperText={errors.dateOfBirth}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          id="phone"
          label="Phone Number"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          error={!!errors.phone}
          helperText={errors.phone}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          id="address"
          label="Address"
          name="address"
          value={formData.address}
          onChange={handleChange}
        />
      </Grid>
      <Grid item xs={12}>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          This information helps us provide more accurate assessments and recommendations.
        </Typography>
      </Grid>
    </Grid>
  </Box>
);

// Step 3: Health Information
const HealthInfoStep = ({ formData, handleChange, errors }) => (
  <Box>
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="subtitle1" gutterBottom>
          Medical History
        </Typography>
        <TextField
          fullWidth
          id="medicalHistory"
          label="Relevant Medical History (Optional)"
          name="medicalHistory"
          multiline
          rows={3}
          value={formData.medicalHistory}
          onChange={handleChange}
          placeholder="List any relevant medical conditions, medications, or family history of cognitive disorders."
        />
      </Grid>
      <Grid item xs={12}>
        <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
          Primary Concerns
        </Typography>
        <TextField
          fullWidth
          id="concerns"
          label="Specific Concerns (Optional)"
          name="concerns"
          multiline
          rows={3}
          value={formData.concerns}
          onChange={handleChange}
          placeholder="Describe any specific cognitive concerns you're experiencing or looking to address."
        />
      </Grid>
      <Grid item xs={12}>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Your health information is private and protected. We use this information to personalize your experience and provide more accurate assessments. You can update or remove this information at any time.
        </Typography>
      </Grid>
    </Grid>
  </Box>
);

const RegisterPage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
    phone: '',
    address: '',
    medicalHistory: '',
    concerns: '',
    agreeTerms: false
  });
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();
  
  const steps = ['Account Information', 'Personal Information', 'Health Information (Optional)'];
  
  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    const newValue = name === 'agreeTerms' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const validateStep = () => {
    const newErrors = {};
    
    if (activeStep === 0) {
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email is invalid';
      }
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    } else if (activeStep === 1) {
      if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
      if (formData.phone && !/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
        newErrors.phone = 'Phone number is invalid';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleNext = () => {
    if (validateStep()) {
      setActiveStep(prevActiveStep => prevActiveStep + 1);
    }
  };
  
  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Final validation
    if (!formData.agreeTerms) {
      setGlobalError('You must agree to the terms and conditions');
      return;
    }
    
    try {
      setGlobalError('');
      setLoading(true);
      
      await register(
        `${formData.firstName} ${formData.lastName}`, 
        formData.email, 
        formData.password
      );
      
      // Redirect to screening page after successful registration
      navigate('/screening');
    } catch (err) {
      setGlobalError('Failed to create an account. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSocialRegister = (provider) => {
    // This would integrate with social registration providers in a real app
    console.log(`Registering with ${provider}`);
    setGlobalError(`Social registration with ${provider} is not implemented in this demo.`);
  };
  
  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return <AccountInfoStep formData={formData} handleChange={handleChange} errors={errors} />;
      case 1:
        return <PersonalInfoStep formData={formData} handleChange={handleChange} errors={errors} />;
      case 2:
        return <HealthInfoStep formData={formData} handleChange={handleChange} errors={errors} />;
      default:
        return 'Unknown step';
    }
  };
  
  return (
    <Container component="main" maxWidth="sm" sx={{ py: 8 }} id="main-content">
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          borderRadius: 2,
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
          <PersonAddIcon />
        </Avatar>
        <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
          Create an Account
        </Typography>
        
        <Stepper activeStep={activeStep} alternativeLabel sx={{ width: '100%', mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        {globalError && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{globalError}</Alert>}
        
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
          {getStepContent(activeStep)}
          
          {activeStep === steps.length - 1 && (
            <FormControlLabel
              control={
                <Checkbox
                  name="agreeTerms"
                  color="primary"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                />
              }
              label={
                <Typography variant="body2">
                  I agree to the <Link component={RouterLink} to="#">Terms of Service</Link> and{' '}
                  <Link component={RouterLink} to="#">Privacy Policy</Link>
                </Typography>
              }
              sx={{ mt: 2 }}
            />
          )}
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
            >
              Back
            </Button>
            <Box>
              {activeStep === steps.length - 1 ? (
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : "Create Account"}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                >
                  Next
                </Button>
              )}
            </Box>
          </Box>
        </Box>
        
        {activeStep === 0 && (
          <>
            <Divider sx={{ my: 3, width: '100%' }}>
              <Typography variant="body2" color="text.secondary">
                OR
              </Typography>
            </Divider>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Button
                  fullWidth
                  variant="outlined"
                  color="primary"
                  startIcon={<GoogleIcon />}
                  onClick={() => handleSocialRegister('Google')}
                  sx={{ py: 1 }}
                >
                  Google
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  fullWidth
                  variant="outlined"
                  color="primary"
                  startIcon={<FacebookIcon />}
                  onClick={() => handleSocialRegister('Facebook')}
                  sx={{ py: 1 }}
                >
                  Facebook
                </Button>
              </Grid>
            </Grid>
          </>
        )}
      </Paper>
      
      <Box mt={4} textAlign="center">
        <Typography variant="body2" color="text.secondary">
          Already have an account?{' '}
          <Link component={RouterLink} to="/login" variant="body2">
            Sign in
          </Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default RegisterPage; 