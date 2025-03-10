import React, { useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Switch,
  Tab,
  Tabs,
  TextField,
  Typography,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  CircularProgress,
  Badge,
  Tooltip,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormControlLabel
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SecurityIcon from '@mui/icons-material/Security';
import NotificationsIcon from '@mui/icons-material/Notifications';
import DataUsageIcon from '@mui/icons-material/DataUsage';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SettingsIcon from '@mui/icons-material/Settings';
import HelpIcon from '@mui/icons-material/Help';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useAuth } from '../contexts/AuthContext';

// Custom styled components
const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: 120,
  height: 120,
  border: `4px solid ${theme.palette.background.paper}`,
  boxShadow: theme.shadows[3],
  margin: 'auto',
  cursor: 'pointer',
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

// TabPanel component for tab content
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const ProfilePage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  
  // State for tabs and user data
  const [tabValue, setTabValue] = useState(0);
  const [userData, setUserData] = useState({
    name: currentUser?.name || 'Demo User',
    email: currentUser?.email || 'user@example.com',
    phone: '+1 555-123-4567',
    address: '123 Main St, Anytown, USA',
    dateJoined: new Date(currentUser?.createdAt || Date.now()).toLocaleDateString(),
    profilePicture: currentUser?.profilePicture || 'https://via.placeholder.com/150',
    language: 'English',
    timezone: 'America/New_York'
  });
  
  // State for form editing
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ ...userData });
  
  // State for dialogs and notifications
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // State for notification and privacy settings
  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    push: true,
    sms: false,
    newsletter: true,
    assessmentReminders: true,
    trainingReminders: true,
    researchUpdates: false
  });
  
  const [privacySettings, setPrivacySettings] = useState({
    shareDataWithResearchers: false,
    shareDataWithDoctors: true,
    anonymousDataCollection: true,
    usageAnalytics: true,
    locationData: false
  });
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Toggle edit mode
  const toggleEditMode = () => {
    if (editMode) {
      // Cancel edit
      setFormData({ ...userData });
    }
    setEditMode(!editMode);
  };
  
  // Handle form input changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Handle saving profile changes
  const handleSaveProfile = () => {
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      setUserData({ ...formData });
      setEditMode(false);
      setIsLoading(false);
      setSnackbarMessage('Profile updated successfully!');
      setSnackbarOpen(true);
    }, 1000);
  };
  
  // Handle notification setting toggle
  const handleNotificationToggle = (setting) => {
    setNotificationSettings({
      ...notificationSettings,
      [setting]: !notificationSettings[setting]
    });
    
    setSnackbarMessage('Notification preference updated');
    setSnackbarOpen(true);
  };
  
  // Handle privacy setting toggle
  const handlePrivacyToggle = (setting) => {
    setPrivacySettings({
      ...privacySettings,
      [setting]: !privacySettings[setting]
    });
    
    setSnackbarMessage('Privacy setting updated');
    setSnackbarOpen(true);
  };
  
  // Handle account logout
  const handleLogout = () => {
    setLogoutDialogOpen(false);
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      logout();
      navigate('/');
    }, 1000);
  };
  
  // Handle account deletion
  const handleDeleteAccount = () => {
    setDeleteDialogOpen(false);
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      logout();
      navigate('/');
      // In a real app, this would also call an API to delete the user's account
    }, 1500);
  };
  
  // Handle profile picture upload
  const handleProfilePictureUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData({
          ...formData,
          profilePicture: e.target.result
        });
        
        // In a real app, this would upload the file to a server
        setSnackbarMessage('Profile picture updated!');
        setSnackbarOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Handle snackbar close
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  
  return (
    <Container component="main" maxWidth="lg" sx={{ py: 6 }} id="main-content">
      <Box sx={{ mb: 6 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          My Profile
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Manage your account settings and preferences
        </Typography>
      </Box>
      
      <Grid container spacing={4}>
        {/* Sidebar with profile overview */}
        <Grid item xs={12} md={4}>
          <Paper 
            elevation={2} 
            sx={{ 
              p: 3, 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              position: 'relative'
            }}
          >
            {editMode ? (
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={
                  <Tooltip title="Upload new picture">
                    <IconButton 
                      component="label"
                      sx={{ 
                        bgcolor: theme.palette.primary.main,
                        color: 'white',
                        '&:hover': {
                          bgcolor: theme.palette.primary.dark,
                        }
                      }}
                      size="small"
                    >
                      <CloudUploadIcon fontSize="small" />
                      <VisuallyHiddenInput 
                        type="file" 
                        accept="image/*"
                        onChange={handleProfilePictureUpload}
                      />
                    </IconButton>
                  </Tooltip>
                }
              >
                <ProfileAvatar 
                  src={formData.profilePicture} 
                  alt={formData.name}
                />
              </Badge>
            ) : (
              <ProfileAvatar 
                src={userData.profilePicture} 
                alt={userData.name}
              />
            )}
            
            <Typography variant="h5" sx={{ mt: 3, fontWeight: 'medium' }}>
              {userData.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {userData.email}
            </Typography>
            
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                mt: 1,
                mb: 3,
                color: theme.palette.success.main
              }}
            >
              <VerifiedUserIcon fontSize="small" sx={{ mr: 0.5 }} />
              <Typography variant="body2">
                Verified Account
              </Typography>
            </Box>
            
            <Divider sx={{ width: '100%', my: 2 }} />
            
            <List sx={{ width: '100%' }}>
              <ListItem>
                <ListItemIcon>
                  <AccountCircleIcon color="primary" />
                </ListItemIcon>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Member Since
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" sx={{ textAlign: 'right' }}>
                      {userData.dateJoined}
                    </Typography>
                  </Grid>
                </Grid>
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <DataUsageIcon color="primary" />
                </ListItemIcon>
                <Grid container>
                  <Grid item xs={8}>
                    <Typography variant="body2" color="text.secondary">
                      Assessments Completed
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="body2" sx={{ textAlign: 'right' }}>
                      5
                    </Typography>
                  </Grid>
                </Grid>
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <SettingsIcon color="primary" />
                </ListItemIcon>
                <Grid container>
                  <Grid item xs={8}>
                    <Typography variant="body2" color="text.secondary">
                      Last Assessment
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="body2" sx={{ textAlign: 'right' }}>
                      4 days ago
                    </Typography>
                  </Grid>
                </Grid>
              </ListItem>
            </List>
            
            <Divider sx={{ width: '100%', my: 2 }} />
            
            <Box sx={{ width: '100%', mt: 2 }}>
              <Button
                fullWidth
                variant="outlined"
                color="primary"
                sx={{ mb: 2 }}
                onClick={() => navigate('/health-monitoring')}
              >
                View Health Data
              </Button>
              
              <Button
                fullWidth
                variant="outlined"
                color="error"
                startIcon={<ExitToAppIcon />}
                onClick={() => setLogoutDialogOpen(true)}
              >
                Logout
              </Button>
            </Box>
          </Paper>
        </Grid>
        
        {/* Main content with tabs */}
        <Grid item xs={12} md={8}>
          <Paper elevation={2}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
              <Tab icon={<AccountCircleIcon />} label="Account Information" iconPosition="start" />
              <Tab icon={<SecurityIcon />} label="Security & Privacy" iconPosition="start" />
              <Tab icon={<NotificationsIcon />} label="Notifications" iconPosition="start" />
            </Tabs>
            
            {/* Account Information Tab */}
            <TabPanel value={tabValue} index={0}>
              <Box sx={{ px: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6">Personal Information</Typography>
                  <Button
                    startIcon={editMode ? <CancelIcon /> : <EditIcon />}
                    onClick={toggleEditMode}
                    color={editMode ? "error" : "primary"}
                    variant="outlined"
                    size="small"
                  >
                    {editMode ? 'Cancel' : 'Edit'}
                  </Button>
                </Box>
                
                {editMode ? (
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Full Name"
                        name="name"
                        value={formData.name}
                        onChange={handleFormChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        value={formData.email}
                        onChange={handleFormChange}
                        type="email"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Phone Number"
                        name="phone"
                        value={formData.phone}
                        onChange={handleFormChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Address"
                        name="address"
                        value={formData.address}
                        onChange={handleFormChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel id="language-label">Language</InputLabel>
                        <Select
                          labelId="language-label"
                          id="language"
                          name="language"
                          value={formData.language}
                          label="Language"
                          onChange={handleFormChange}
                        >
                          <MenuItem value="English">English</MenuItem>
                          <MenuItem value="Spanish">Spanish</MenuItem>
                          <MenuItem value="French">French</MenuItem>
                          <MenuItem value="German">German</MenuItem>
                          <MenuItem value="Chinese">Chinese</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel id="timezone-label">Timezone</InputLabel>
                        <Select
                          labelId="timezone-label"
                          id="timezone"
                          name="timezone"
                          value={formData.timezone}
                          label="Timezone"
                          onChange={handleFormChange}
                        >
                          <MenuItem value="America/New_York">Eastern Time (ET)</MenuItem>
                          <MenuItem value="America/Chicago">Central Time (CT)</MenuItem>
                          <MenuItem value="America/Denver">Mountain Time (MT)</MenuItem>
                          <MenuItem value="America/Los_Angeles">Pacific Time (PT)</MenuItem>
                          <MenuItem value="Europe/London">Greenwich Mean Time (GMT)</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                        <Button
                          variant="contained"
                          color="primary"
                          startIcon={<SaveIcon />}
                          onClick={handleSaveProfile}
                          disabled={isLoading}
                        >
                          {isLoading ? <CircularProgress size={24} /> : 'Save Changes'}
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                ) : (
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <Card variant="outlined" sx={{ height: '100%' }}>
                        <CardContent>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Full Name
                          </Typography>
                          <Typography variant="body1">{userData.name}</Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Card variant="outlined" sx={{ height: '100%' }}>
                        <CardContent>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Email Address
                          </Typography>
                          <Typography variant="body1">{userData.email}</Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Card variant="outlined" sx={{ height: '100%' }}>
                        <CardContent>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Phone Number
                          </Typography>
                          <Typography variant="body1">{userData.phone}</Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Card variant="outlined" sx={{ height: '100%' }}>
                        <CardContent>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Address
                          </Typography>
                          <Typography variant="body1">{userData.address}</Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Card variant="outlined" sx={{ height: '100%' }}>
                        <CardContent>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Language
                          </Typography>
                          <Typography variant="body1">{userData.language}</Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Card variant="outlined" sx={{ height: '100%' }}>
                        <CardContent>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Timezone
                          </Typography>
                          <Typography variant="body1">
                            {userData.timezone.replace('_', ' ')}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                )}
                
                <Divider sx={{ my: 4 }} />
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Account Management
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    These actions will affect your account and data
                  </Typography>
                  
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => setDeleteDialogOpen(true)}
                    sx={{ mt: 1 }}
                  >
                    Delete Account
                  </Button>
                </Box>
              </Box>
            </TabPanel>
            
            {/* Security & Privacy Tab */}
            <TabPanel value={tabValue} index={1}>
              <Box sx={{ px: 2 }}>
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" gutterBottom>
                    Change Password
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Update your password to keep your account secure
                  </Typography>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Current Password"
                        type="password"
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <div></div> {/* Spacer */}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="New Password"
                        type="password"
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Confirm New Password"
                        type="password"
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button 
                        variant="contained" 
                        color="primary"
                        onClick={() => {
                          setSnackbarMessage('Password updated successfully!');
                          setSnackbarOpen(true);
                        }}
                      >
                        Update Password
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
                
                <Divider sx={{ my: 4 }} />
                
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Privacy Settings
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Control how your information is used and shared
                  </Typography>
                  
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <DataUsageIcon />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Share Data with Researchers"
                        secondary="Allow anonymous data to be used for Alzheimer's research"
                      />
                      <Switch
                        edge="end"
                        checked={privacySettings.shareDataWithResearchers}
                        onChange={() => handlePrivacyToggle('shareDataWithResearchers')}
                      />
                    </ListItem>
                    
                    <ListItem>
                      <ListItemIcon>
                        <LocalHospitalIcon />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Share Data with Healthcare Providers"
                        secondary="Allow your data to be shared with your healthcare providers"
                      />
                      <Switch
                        edge="end"
                        checked={privacySettings.shareDataWithDoctors}
                        onChange={() => handlePrivacyToggle('shareDataWithDoctors')}
                      />
                    </ListItem>
                    
                    <ListItem>
                      <ListItemIcon>
                        <VerifiedUserIcon />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Anonymous Data Collection"
                        secondary="Allow collection of anonymous usage data to improve our services"
                      />
                      <Switch
                        edge="end"
                        checked={privacySettings.anonymousDataCollection}
                        onChange={() => handlePrivacyToggle('anonymousDataCollection')}
                      />
                    </ListItem>
                    
                    <ListItem>
                      <ListItemIcon>
                        <DataUsageIcon />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Usage Analytics"
                        secondary="Allow analysis of how you use the application to improve features"
                      />
                      <Switch
                        edge="end"
                        checked={privacySettings.usageAnalytics}
                        onChange={() => handlePrivacyToggle('usageAnalytics')}
                      />
                    </ListItem>
                    
                    <ListItem>
                      <ListItemIcon>
                        <LocationOnIcon />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Location Data"
                        secondary="Allow collection of location data for regional services"
                      />
                      <Switch
                        edge="end"
                        checked={privacySettings.locationData}
                        onChange={() => handlePrivacyToggle('locationData')}
                      />
                    </ListItem>
                  </List>
                </Box>
                
                <Box sx={{ mt: 4, mb: 2 }}>
                  <Alert severity="info" sx={{ display: 'flex', alignItems: 'center' }}>
                    <HelpIcon sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      You can request a copy of all your data or request complete data deletion by contacting our support team.
                    </Typography>
                  </Alert>
                </Box>
              </Box>
            </TabPanel>
            
            {/* Notifications Tab */}
            <TabPanel value={tabValue} index={2}>
              <Box sx={{ px: 2 }}>
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" gutterBottom>
                    Notification Methods
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Choose how you'd like to receive notifications from us
                  </Typography>
                  
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <NotificationsIcon />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Email Notifications"
                        secondary="Receive notifications to your email address"
                      />
                      <Switch
                        edge="end"
                        checked={notificationSettings.email}
                        onChange={() => handleNotificationToggle('email')}
                      />
                    </ListItem>
                    
                    <ListItem>
                      <ListItemIcon>
                        <NotificationsIcon />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Push Notifications"
                        secondary="Receive notifications in your browser"
                      />
                      <Switch
                        edge="end"
                        checked={notificationSettings.push}
                        onChange={() => handleNotificationToggle('push')}
                      />
                    </ListItem>
                    
                    <ListItem>
                      <ListItemIcon>
                        <NotificationsIcon />
                      </ListItemIcon>
                      <ListItemText 
                        primary="SMS Notifications"
                        secondary="Receive text messages for important updates"
                      />
                      <Switch
                        edge="end"
                        checked={notificationSettings.sms}
                        onChange={() => handleNotificationToggle('sms')}
                      />
                    </ListItem>
                  </List>
                </Box>
                
                <Divider sx={{ my: 4 }} />
                
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Notification Types
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Control what types of notifications you receive
                  </Typography>
                  
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <NotificationsIcon />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Assessment Reminders"
                        secondary="Reminders to complete regular cognitive assessments"
                      />
                      <Switch
                        edge="end"
                        checked={notificationSettings.assessmentReminders}
                        onChange={() => handleNotificationToggle('assessmentReminders')}
                      />
                    </ListItem>
                    
                    <ListItem>
                      <ListItemIcon>
                        <NotificationsIcon />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Training Reminders"
                        secondary="Reminders to complete cognitive training exercises"
                      />
                      <Switch
                        edge="end"
                        checked={notificationSettings.trainingReminders}
                        onChange={() => handleNotificationToggle('trainingReminders')}
                      />
                    </ListItem>
                    
                    <ListItem>
                      <ListItemIcon>
                        <NotificationsIcon />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Newsletters"
                        secondary="Updates on brain health and Alzheimer's prevention"
                      />
                      <Switch
                        edge="end"
                        checked={notificationSettings.newsletter}
                        onChange={() => handleNotificationToggle('newsletter')}
                      />
                    </ListItem>
                    
                    <ListItem>
                      <ListItemIcon>
                        <NotificationsIcon />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Research Updates"
                        secondary="Updates on new Alzheimer's research and findings"
                      />
                      <Switch
                        edge="end"
                        checked={notificationSettings.researchUpdates}
                        onChange={() => handleNotificationToggle('researchUpdates')}
                      />
                    </ListItem>
                  </List>
                </Box>
              </Box>
            </TabPanel>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Dialogs */}
      {/* Logout Confirmation Dialog */}
      <Dialog
        open={logoutDialogOpen}
        onClose={() => setLogoutDialogOpen(false)}
      >
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to log out of your account?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLogoutDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleLogout} color="primary" autoFocus>
            {isLoading ? <CircularProgress size={24} /> : 'Logout'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Delete Account Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', color: theme.palette.error.main }}>
            <WarningIcon sx={{ mr: 1 }} />
            Delete Your Account
          </Box>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you absolutely sure you want to delete your account? This action cannot be undone and will permanently erase all your data, including assessment history and cognitive training progress.
          </DialogContentText>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Type 'DELETE' to confirm"
              variant="outlined"
              sx={{ mt: 2 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteAccount} color="error">
            {isLoading ? <CircularProgress size={24} /> : 'Delete Account'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        action={
          <IconButton size="small" color="inherit" onClick={handleSnackbarClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </Container>
  );
};

export default ProfilePage; 