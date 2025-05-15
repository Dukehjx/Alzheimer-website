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
import { useAuth } from '../contexts/AuthContext.jsx'; // Updated import

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

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const renderLoading = () => (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <CircularProgress />
        </Box>
    );

    const renderProfileInfo = () => (
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} md={3} sx={{ textAlign: 'center' }}>
                    <Tooltip title={editMode ? "Click to upload" : "Profile Picture"} placement="top">
                        <Badge
                            overlap="circular"
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            badgeContent={
                                editMode && (
                                    <IconButton component="label" sx={{ bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark' } }}>
                                        <EditIcon fontSize="small" />
                                        <VisuallyHiddenInput type="file" accept="image/*" onChange={handleProfilePictureUpload} />
                                    </IconButton>
                                )
                            }
                        >
                            <ProfileAvatar src={formData.profilePicture} alt={formData.name} />
                        </Badge>
                    </Tooltip>
                </Grid>
                <Grid item xs={12} md={9}>
                    <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
                        {editMode ? (
                            <TextField
                                fullWidth
                                label="Full Name"
                                name="name"
                                value={formData.name}
                                onChange={handleFormChange}
                                variant="standard"
                                sx={{ mb: 1 }}
                            />
                        ) : (
                            formData.name
                        )}
                    </Typography>
                    <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                        {editMode ? (
                            <TextField
                                fullWidth
                                label="Email Address"
                                name="email"
                                value={formData.email}
                                onChange={handleFormChange}
                                variant="standard"
                                InputProps={{
                                    readOnly: true, // Email usually not editable directly
                                }}
                                sx={{ mb: 1 }}
                            />
                        ) : (
                            formData.email
                        )}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                        Joined: {userData.dateJoined}
                    </Typography>
                    {editMode ? (
                        <>
                            <TextField
                                fullWidth
                                label="Phone Number"
                                name="phone"
                                value={formData.phone}
                                onChange={handleFormChange}
                                variant="standard"
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                fullWidth
                                label="Address"
                                name="address"
                                value={formData.address}
                                onChange={handleFormChange}
                                variant="standard"
                                multiline
                                rows={2}
                                sx={{ mb: 2 }}
                            />
                            <FormControl fullWidth variant="standard" sx={{ mb: 2 }}>
                                <InputLabel>Language</InputLabel>
                                <Select
                                    name="language"
                                    value={formData.language}
                                    onChange={handleFormChange}
                                >
                                    <MenuItem value="English">English</MenuItem>
                                    <MenuItem value="Spanish">Spanish</MenuItem>
                                    <MenuItem value="French">French</MenuItem>
                                    {/* Add more languages as needed */}
                                </Select>
                            </FormControl>
                            <FormControl fullWidth variant="standard" sx={{ mb: 2 }}>
                                <InputLabel>Timezone</InputLabel>
                                <Select
                                    name="timezone"
                                    value={formData.timezone}
                                    onChange={handleFormChange}
                                >
                                    <MenuItem value="America/New_York">America/New_York (ET)</MenuItem>
                                    <MenuItem value="America/Chicago">America/Chicago (CT)</MenuItem>
                                    <MenuItem value="America/Denver">America/Denver (MT)</MenuItem>
                                    <MenuItem value="America/Los_Angeles">America/Los_Angeles (PT)</MenuItem>
                                    <MenuItem value="Europe/London">Europe/London (GMT)</MenuItem>
                                    {/* Add more timezones as needed */}
                                </Select>
                            </FormControl>
                        </>
                    ) : (
                        <>
                            {userData.phone && <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}> <AccountCircleIcon sx={{ mr: 1, color: 'text.secondary' }} /> {userData.phone} </Typography>}
                            {userData.address && <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}> <LocationOnIcon sx={{ mr: 1, color: 'text.secondary' }} /> {userData.address} </Typography>}
                            <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}> <SettingsIcon sx={{ mr: 1, color: 'text.secondary' }} /> Language: {userData.language} </Typography>
                            <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}> <ClockIcon sx={{ mr: 1, color: 'text.secondary' }} /> Timezone: {userData.timezone} </Typography>
                        </>
                    )}
                    <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                        <Button
                            variant="contained"
                            color={editMode ? "secondary" : "primary"}
                            startIcon={editMode ? <CancelIcon /> : <EditIcon />}
                            onClick={toggleEditMode}
                        >
                            {editMode ? 'Cancel' : 'Edit Profile'}
                        </Button>
                        {editMode && (
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                                onClick={handleSaveProfile}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Saving...' : 'Save Changes'}
                            </Button>
                        )}
                    </Box>
                </Grid>
            </Grid>
        </Paper>
    );

    const renderSecuritySettings = () => (
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'medium' }}>Password & Security</Typography>
            <Divider sx={{ my: 2 }} />
            <Button variant="outlined" color="primary" sx={{ mb: 2 }}>
                Change Password
            </Button>
            <Typography variant="subtitle1" gutterBottom>Two-Factor Authentication (2FA)</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="body1" sx={{ flexGrow: 1 }}>
                    Enable 2FA for enhanced security.
                </Typography>
                <Switch defaultChecked />
            </Box>
            <Alert severity="info" icon={<VerifiedUserIcon />}>
                Your account is currently protected with standard security measures.
            </Alert>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'medium', mt: 3 }}>Login History</Typography>
            <List dense>
                <ListItem>
                    <ListItemIcon><SecurityIcon color="success" /></ListItemIcon>
                    <ListItemText primary="Logged in from Chrome on Windows" secondary="New York, USA - March 15, 2024, 10:00 AM" />
                </ListItem>
                <ListItem>
                    <ListItemIcon><SecurityIcon color="warning" /></ListItemIcon>
                    <ListItemText primary="Unusual login attempt from Firefox on Linux" secondary="Unknown Location - March 14, 2024, 08:00 PM" />
                </ListItem>
            </List>
        </Paper>
    );

    const renderNotificationSettings = () => (
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'medium' }}>Notification Preferences</Typography>
            <Divider sx={{ my: 2 }} />
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <FormControlLabel control={<Switch checked={notificationSettings.email} onChange={() => handleNotificationToggle('email')} />} label="Email Notifications" />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <FormControlLabel control={<Switch checked={notificationSettings.push} onChange={() => handleNotificationToggle('push')} />} label="Push Notifications" />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <FormControlLabel control={<Switch checked={notificationSettings.sms} onChange={() => handleNotificationToggle('sms')} />} label="SMS Notifications" />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <FormControlLabel control={<Switch checked={notificationSettings.newsletter} onChange={() => handleNotificationToggle('newsletter')} />} label="Newsletter Subscription" />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <FormControlLabel control={<Switch checked={notificationSettings.assessmentReminders} onChange={() => handleNotificationToggle('assessmentReminders')} />} label="Assessment Reminders" />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <FormControlLabel control={<Switch checked={notificationSettings.trainingReminders} onChange={() => handleNotificationToggle('trainingReminders')} />} label="Cognitive Training Reminders" />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <FormControlLabel control={<Switch checked={notificationSettings.researchUpdates} onChange={() => handleNotificationToggle('researchUpdates')} />} label="Research Updates" />
                </Grid>
            </Grid>
        </Paper>
    );

    const renderPrivacySettings = () => (
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'medium' }}>Privacy & Data</Typography>
            <Divider sx={{ my: 2 }} />
            <FormControlLabel control={<Switch checked={privacySettings.shareDataWithResearchers} onChange={() => handlePrivacyToggle('shareDataWithResearchers')} />} label="Share Anonymized Data with Researchers" />
            <Typography variant="caption" display="block" gutterBottom sx={{ ml: 4, mb: 1 }}>
                Help advance cognitive science by allowing your anonymized data to be used in research studies.
            </Typography>
            <FormControlLabel control={<Switch checked={privacySettings.shareDataWithDoctors} onChange={() => handlePrivacyToggle('shareDataWithDoctors')} />} label="Share Data with Your Healthcare Provider" />
            <Typography variant="caption" display="block" gutterBottom sx={{ ml: 4, mb: 1 }}>
                Allow your designated healthcare provider to access your assessment results and progress.
            </Typography>
            <FormControlLabel control={<Switch checked={privacySettings.anonymousDataCollection} onChange={() => handlePrivacyToggle('anonymousDataCollection')} />} label="Anonymous Data Collection for Service Improvement" />
            <Typography variant="caption" display="block" gutterBottom sx={{ ml: 4, mb: 1 }}>
                Help us improve our services by allowing collection of anonymized usage data.
            </Typography>
            <FormControlLabel control={<Switch checked={privacySettings.usageAnalytics} onChange={() => handlePrivacyToggle('usageAnalytics')} />} label="Usage Analytics for Personalized Experience" />
            <Typography variant="caption" display="block" gutterBottom sx={{ ml: 4, mb: 1 }}>
                Allow us to analyze your usage patterns to provide a more personalized experience.
            </Typography>
            <FormControlLabel control={<Switch checked={privacySettings.locationData} onChange={() => handlePrivacyToggle('locationData')} />} label="Location Data for Regional Insights" />
            <Typography variant="caption" display="block" gutterBottom sx={{ ml: 4, mb: 1 }}>
                Allow collection of location data for regional cognitive health insights (optional).
            </Typography>

            <Button variant="outlined" startIcon={<DataUsageIcon />} sx={{ mt: 2, mr: 1 }}>
                Download Your Data
            </Button>
            <Button variant="outlined" color="info" startIcon={<HelpIcon />} sx={{ mt: 2 }}>
                Learn More About Data Privacy
            </Button>
        </Paper>
    );

    const renderAccountActions = () => (
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'medium' }}>Account Actions</Typography>
            <Divider sx={{ my: 2 }} />
            <List>
                <ListItem button onClick={() => setLogoutDialogOpen(true)}>
                    <ListItemIcon>
                        <ExitToAppIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Logout" />
                </ListItem>
                <ListItem button onClick={() => setDeleteDialogOpen(true)}>
                    <ListItemIcon>
                        <DeleteIcon color="error" />
                    </ListItemIcon>
                    <ListItemText primary="Delete Account" primaryTypographyProps={{ color: 'error' }} />
                </ListItem>
            </List>
            <Alert severity="warning" icon={<WarningIcon />}>
                Deleting your account is permanent and cannot be undone. All your data will be erased.
            </Alert>
        </Paper>
    );

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>
                Account Settings
            </Typography>
            <Grid container spacing={3}>
                {/* Sidebar Navigation */}
                <Grid item xs={12} md={3}>
                    <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                        <Tabs
                            orientation="vertical"
                            variant="scrollable"
                            value={tabValue}
                            onChange={handleTabChange}
                            aria-label="Profile settings tabs"
                            sx={{
                                borderRight: 1,
                                borderColor: 'divider',
                                '& .MuiTab-root': {
                                    alignItems: 'flex-start',
                                    py: 1.5,
                                    px: 2,
                                    textTransform: 'none',
                                    fontWeight: theme.typography.fontWeightMedium,
                                },
                                '& .Mui-selected': {
                                    color: theme.palette.primary.main,
                                    backgroundColor: theme.palette.action.selected,
                                },
                                '& .MuiTabs-indicator': {
                                    backgroundColor: theme.palette.primary.main,
                                }
                            }}
                        >
                            <Tab icon={<AccountCircleIcon />} iconPosition="start" label="Profile Information" />
                            <Tab icon={<SecurityIcon />} iconPosition="start" label="Security Settings" />
                            <Tab icon={<NotificationsIcon />} iconPosition="start" label="Notifications" />
                            <Tab icon={<DataUsageIcon />} iconPosition="start" label="Privacy & Data" />
                            <Tab icon={<SettingsIcon />} iconPosition="start" label="Account Actions" />
                        </Tabs>
                    </Paper>
                </Grid>

                {/* Tab Content */}
                <Grid item xs={12} md={9}>
                    {isLoading && tabValue === 0 && renderLoading()}
                    <TabPanel value={tabValue} index={0}>
                        {renderProfileInfo()}
                    </TabPanel>
                    <TabPanel value={tabValue} index={1}>
                        {renderSecuritySettings()}
                    </TabPanel>
                    <TabPanel value={tabValue} index={2}>
                        {renderNotificationSettings()}
                    </TabPanel>
                    <TabPanel value={tabValue} index={3}>
                        {renderPrivacySettings()}
                    </TabPanel>
                    <TabPanel value={tabValue} index={4}>
                        {renderAccountActions()}
                    </TabPanel>
                </Grid>
            </Grid>

            {/* Logout Confirmation Dialog */}
            <Dialog open={logoutDialogOpen} onClose={() => setLogoutDialogOpen(false)}>
                <DialogTitle>Confirm Logout</DialogTitle>
                <DialogContent>
                    <DialogContentText>Are you sure you want to log out?</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setLogoutDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleLogout} color="primary" variant="contained" disabled={isLoading}>
                        {isLoading ? <CircularProgress size={20} /> : 'Logout'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Account Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle sx={{ color: 'error.main' }}>Confirm Account Deletion</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you absolutely sure you want to delete your account? This action is irreversible and all your data will be permanently lost.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleDeleteAccount} color="error" variant="contained" disabled={isLoading} startIcon={<DeleteIcon />}>
                        {isLoading ? <CircularProgress size={20} /> : 'Delete Account'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={4000}
                onClose={handleSnackbarClose}
                message={snackbarMessage}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                action={
                    <IconButton size="small" aria-label="close" color="inherit" onClick={handleSnackbarClose}>
                        <CheckCircleIcon fontSize="small" />
                    </IconButton>
                }
            />
        </Container>
    );
};

export default ProfilePage; 