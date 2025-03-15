import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Paper, 
  Card, 
  CardContent, 
  Button,
  Divider,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  Menu,
  ListItemIcon,
  ListItemText,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Link,
  Stack
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddIcon from '@mui/icons-material/Add';
import ShareIcon from '@mui/icons-material/Share';
import GetAppIcon from '@mui/icons-material/GetApp';
import PrintIcon from '@mui/icons-material/Print';
import AssessmentIcon from '@mui/icons-material/Assessment';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
import DateRangeIcon from '@mui/icons-material/DateRange';
import PersonIcon from '@mui/icons-material/Person';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  Legend,
  Filler
);

// Mock data for assessment history
const assessmentHistory = [
  { 
    id: 1, 
    date: '2023-08-20', 
    type: 'AI Screening',
    overallScore: 85,
    categories: {
      lexicalDiversity: 82,
      syntacticComplexity: 88,
      semanticCoherence: 85,
      speechFluency: 78,
      memoryCues: 92
    },
    trend: 'baseline',
    notes: 'Initial assessment to establish baseline cognitive function.'
  },
  { 
    id: 2, 
    date: '2023-07-15', 
    type: 'AI Screening',
    overallScore: 83,
    categories: {
      lexicalDiversity: 80,
      syntacticComplexity: 85,
      semanticCoherence: 82,
      speechFluency: 79,
      memoryCues: 89
    },
    trend: 'stable',
    notes: 'Slight decrease in syntactic complexity, but within normal variation.'
  },
  { 
    id: 3, 
    date: '2023-06-10', 
    type: 'AI Screening',
    overallScore: 86,
    categories: {
      lexicalDiversity: 84,
      syntacticComplexity: 88,
      semanticCoherence: 85,
      speechFluency: 82,
      memoryCues: 91
    },
    trend: 'improved',
    notes: 'Improvement in speech fluency after three weeks of cognitive training.'
  },
  { 
    id: 4, 
    date: '2023-05-05', 
    type: 'AI Screening',
    overallScore: 82,
    categories: {
      lexicalDiversity: 79,
      syntacticComplexity: 85,
      semanticCoherence: 84,
      speechFluency: 76,
      memoryCues: 86
    },
    trend: 'declined',
    notes: 'Slight decline noted during period of increased stress and poor sleep.'
  },
  { 
    id: 5, 
    date: '2023-04-02', 
    type: 'Clinical Assessment',
    overallScore: 84,
    categories: {
      lexicalDiversity: 81,
      syntacticComplexity: 86,
      semanticCoherence: 85,
      speechFluency: 80,
      memoryCues: 88
    },
    trend: 'stable',
    notes: 'Clinical assessment conducted by neuropsychologist Dr. Johnson.'
  }
];

// Mock data for training activity
const trainingActivity = [
  { 
    id: 1, 
    date: '2023-08-22', 
    game: 'Word Recall Challenge',
    score: 85,
    timeSpent: '8 min',
    improvement: '+5%'
  },
  { 
    id: 2, 
    date: '2023-08-20', 
    game: 'Verbal Fluency Sprint',
    score: 72,
    timeSpent: '5 min',
    improvement: '+3%'
  },
  { 
    id: 3, 
    date: '2023-08-18', 
    game: 'Narrative Memory',
    score: 90,
    timeSpent: '12 min',
    improvement: '+8%'
  },
  { 
    id: 4, 
    date: '2023-08-15', 
    game: 'Word Associations',
    score: 78,
    timeSpent: '6 min',
    improvement: '+2%'
  },
  { 
    id: 5, 
    date: '2023-08-12', 
    game: 'Complex Sentence Builder',
    score: 81,
    timeSpent: '9 min',
    improvement: '+4%'
  }
];

// Data for trend line chart
const getTrendChartData = (theme) => {
  return {
    labels: ['Apr', 'May', 'Jun', 'Jul', 'Aug'],
    datasets: [
      {
        label: 'Overall Cognitive Score',
        data: [84, 82, 86, 83, 85],
        borderColor: theme.palette.primary.main,
        backgroundColor: `${theme.palette.primary.main}20`,
        fill: true,
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 7,
      }
    ]
  };
};

// Data for category comparison chart
const getCategoryChartData = (theme) => {
  return {
    labels: ['Apr', 'May', 'Jun', 'Jul', 'Aug'],
    datasets: [
      {
        label: 'Lexical Diversity',
        data: [81, 79, 84, 80, 82],
        borderColor: theme.palette.primary.main,
        backgroundColor: 'transparent',
        tension: 0.4,
        pointRadius: 3,
      },
      {
        label: 'Syntactic Complexity',
        data: [86, 85, 88, 85, 88],
        borderColor: theme.palette.secondary.main,
        backgroundColor: 'transparent',
        tension: 0.4,
        pointRadius: 3,
      },
      {
        label: 'Speech Fluency',
        data: [80, 76, 82, 79, 78],
        borderColor: theme.palette.warning.main,
        backgroundColor: 'transparent',
        tension: 0.4,
        pointRadius: 3,
      },
      {
        label: 'Memory Cues',
        data: [88, 86, 91, 89, 92],
        borderColor: theme.palette.success.main,
        backgroundColor: 'transparent',
        tension: 0.4,
        pointRadius: 3,
      }
    ]
  };
};

// Chart options
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
    },
    tooltip: {
      mode: 'index',
      intersect: false,
    }
  },
  scales: {
    y: {
      min: 50,
      max: 100,
      title: {
        display: true,
        text: 'Score'
      }
    },
    x: {
      title: {
        display: true,
        text: 'Month'
      }
    }
  }
};

const HealthMonitoringPage = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [timeRange, setTimeRange] = useState('6months');
  const [shareMenuAnchor, setShareMenuAnchor] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [doctorEmail, setDoctorEmail] = useState('');
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleTimeRangeChange = (event) => {
    setTimeRange(event.target.value);
  };
  
  const handleShareMenuOpen = (event) => {
    setShareMenuAnchor(event.currentTarget);
  };
  
  const handleShareMenuClose = () => {
    setShareMenuAnchor(null);
  };
  
  const handleExportData = () => {
    setShareMenuAnchor(null);
    setExportDialogOpen(true);
  };
  
  const handleShareWithDoctor = () => {
    // In a real app, this would send the data to the doctor's email
    console.log(`Sharing data with doctor at: ${doctorEmail}`);
    setExportDialogOpen(false);
    setDoctorEmail('');
  };
  
  const handleAssessmentClick = (assessment) => {
    setSelectedAssessment(assessment);
    setDetailDialogOpen(true);
  };
  
  // Trend icon based on assessment trend
  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'improved':
        return <TrendingUpIcon sx={{ color: theme.palette.success.main }} />;
      case 'declined':
        return <TrendingDownIcon sx={{ color: theme.palette.error.main }} />;
      case 'baseline':
        return <AssessmentIcon sx={{ color: theme.palette.info.main }} />;
      default:
        return <TrendingFlatIcon sx={{ color: theme.palette.warning.main }} />;
    }
  };
  
  const getFormattedDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  return (
    <Container component="main" maxWidth="lg" sx={{ py: 6 }} id="main-content">
      <Box sx={{ mb: 6 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Cognitive Health Monitoring
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Track your cognitive health over time with detailed analytics and assessment history.
        </Typography>
      </Box>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <FormControl variant="outlined" size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Time Range</InputLabel>
          <Select
            value={timeRange}
            onChange={handleTimeRangeChange}
            label="Time Range"
            startAdornment={<DateRangeIcon sx={{ mr: 1 }} />}
          >
            <MenuItem value="3months">Last 3 Months</MenuItem>
            <MenuItem value="6months">Last 6 Months</MenuItem>
            <MenuItem value="1year">Last Year</MenuItem>
            <MenuItem value="all">All Time</MenuItem>
          </Select>
        </FormControl>
        
        <Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            component={RouterLink}
            to="/screening"
            sx={{ mr: 1 }}
          >
            New Assessment
          </Button>
          
          <Button
            variant="outlined"
            color="primary"
            startIcon={<ShareIcon />}
            onClick={handleShareMenuOpen}
          >
            Share Data
          </Button>
          
          <Menu
            anchorEl={shareMenuAnchor}
            open={Boolean(shareMenuAnchor)}
            onClose={handleShareMenuClose}
          >
            <MenuItem onClick={handleExportData}>
              <ListItemIcon>
                <LocalHospitalIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Share with Doctor</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleShareMenuClose}>
              <ListItemIcon>
                <GetAppIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Download as PDF</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleShareMenuClose}>
              <ListItemIcon>
                <PrintIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Print Report</ListItemText>
            </MenuItem>
          </Menu>
        </Box>
      </Box>
      
      <Grid container spacing={4}>
        {/* Cognitive Health Score Card */}
        <Grid item xs={12} sm={6} md={4}>
          <Card elevation={2} sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Typography variant="h6" gutterBottom>
                  Current Cognitive Score
                </Typography>
                <Tooltip title="Based on your most recent assessment">
                  <InfoOutlinedIcon fontSize="small" color="action" />
                </Tooltip>
              </Box>
              
              <Box 
                sx={{ 
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  my: 2
                }}
              >
                <Box 
                  sx={{ 
                    position: 'relative', 
                    display: 'inline-flex',
                    mb: 1
                  }}
                >
                  <CircularProgress
                    variant="determinate"
                    value={85}
                    size={120}
                    thickness={5}
                    sx={{
                      color: theme.palette.primary.main,
                    }}
                  />
                  <CircularProgress
                    variant="determinate"
                    value={100}
                    size={120}
                    thickness={5}
                    sx={{
                      color: theme.palette.grey[200],
                      position: 'absolute',
                      left: 0,
                    }}
                  />
                  <Box
                    sx={{
                      top: 0,
                      left: 0,
                      bottom: 0,
                      right: 0,
                      position: 'absolute',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography variant="h3" component="div" color="text.primary" fontWeight="bold">
                      85
                    </Typography>
                  </Box>
                </Box>
                
                <Chip 
                  icon={<AssessmentIcon />} 
                  label="Healthy Range" 
                  color="success"
                  variant="outlined"
                />
                
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
                  Your cognitive health score is in the healthy range. Continue with your current training program.
                </Typography>
              </Box>
              
              <Button
                variant="text"
                color="primary"
                fullWidth
                endIcon={<ExpandMoreIcon />}
                onClick={() => handleAssessmentClick(assessmentHistory[0])}
                sx={{ mt: 2 }}
              >
                View Details
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Category Breakdown Card */}
        <Grid item xs={12} sm={6} md={4}>
          <Card elevation={2} sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Cognitive Categories
              </Typography>
              
              <Box sx={{ my: 2 }}>
                {Object.entries(assessmentHistory[0].categories).map(([category, score]) => {
                  const formattedCategory = category
                    .replace(/([A-Z])/g, ' $1')
                    .replace(/^./, str => str.toUpperCase());
                  
                  return (
                    <Box key={category} sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2">{formattedCategory}</Typography>
                        <Typography variant="body2" fontWeight="medium">{score}/100</Typography>
                      </Box>
                      <Box sx={{ width: '100%', bgcolor: 'grey.100', borderRadius: 5, height: 8 }}>
                        <Box
                          sx={{
                            width: `${score}%`,
                            bgcolor: category === 'lexicalDiversity' ? theme.palette.primary.main :
                                    category === 'syntacticComplexity' ? theme.palette.secondary.main :
                                    category === 'memoryCues' ? theme.palette.success.main :
                                    theme.palette.warning.main,
                            borderRadius: 5,
                            height: 8,
                          }}
                        />
                      </Box>
                    </Box>
                  );
                })}
              </Box>
              
              <Button
                variant="text"
                color="primary"
                fullWidth
                component={RouterLink}
                to="/cognitive-training"
                endIcon={<ArrowForwardIcon />}
                sx={{ mt: 2 }}
              >
                Improve With Training
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Recent Activity Card */}
        <Grid item xs={12} md={4}>
          <Card elevation={2} sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Activity
              </Typography>
              
              <Box sx={{ my: 1 }}>
                <Stack spacing={2}>
                  {trainingActivity.slice(0, 3).map((activity) => (
                    <Paper 
                      key={activity.id} 
                      variant="outlined"
                      sx={{ 
                        p: 1.5, 
                        borderRadius: 2,
                        border: 'none',
                        bgcolor: theme.palette.grey[50]
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="subtitle2">{activity.game}</Typography>
                        <Chip 
                          label={activity.improvement} 
                          size="small" 
                          color="success" 
                          sx={{ height: 20, fontSize: '0.7rem' }}
                        />
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="caption" color="text.secondary">
                          {getFormattedDate(activity.date)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Score: {activity.score}/100
                        </Typography>
                      </Box>
                    </Paper>
                  ))}
                </Stack>
              </Box>
              
              <Button
                variant="text"
                color="primary"
                fullWidth
                component={RouterLink}
                to="/cognitive-training"
                endIcon={<ArrowForwardIcon />}
                sx={{ mt: 2 }}
              >
                View All Training Activity
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      <Paper sx={{ mt: 4, mb: 4 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ 
            borderBottom: 1, 
            borderColor: 'divider',
            '& .MuiTab-root': {
              py: 2
            }
          }}
        >
          <Tab label="Trend Analysis" icon={<TrendingUpIcon />} iconPosition="start" />
          <Tab label="Assessment History" icon={<AssessmentIcon />} iconPosition="start" />
          <Tab label="Category Comparison" icon={<TrendingUpIcon />} iconPosition="start" />
        </Tabs>
        
        <Box sx={{ p: 3 }}>
          {/* Trend Analysis Tab */}
          {tabValue === 0 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Cognitive Score Trend
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                This graph shows your overall cognitive score trend over time. Regular assessments help track changes and identify patterns.
              </Typography>
              
              <Box sx={{ height: 400, mb: 3 }}>
                <Line data={getTrendChartData(theme)} options={chartOptions} />
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                <Typography variant="body2" color="text.secondary">
                  Baseline established on April 2, 2023
                </Typography>
                <Button
                  variant="outlined"
                  color="primary"
                  component={RouterLink}
                  to="/screening"
                >
                  Take New Assessment
                </Button>
              </Box>
            </Box>
          )}
          
          {/* Assessment History Tab */}
          {tabValue === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Assessment History
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                A record of all your cognitive assessments, including AI screenings and clinical evaluations.
              </Typography>
              
              <TableContainer>
                <Table sx={{ minWidth: 650 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Overall Score</TableCell>
                      <TableCell>Trend</TableCell>
                      <TableCell>Notes</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {assessmentHistory.map((assessment) => (
                      <TableRow
                        key={assessment.id}
                        sx={{ '&:hover': { backgroundColor: theme.palette.action.hover } }}
                      >
                        <TableCell>{getFormattedDate(assessment.date)}</TableCell>
                        <TableCell>
                          <Chip 
                            label={assessment.type} 
                            size="small"
                            color={assessment.type === "AI Screening" ? "primary" : "secondary"}
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>{assessment.overallScore}/100</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {getTrendIcon(assessment.trend)}
                            <Typography variant="body2" sx={{ ml: 1, textTransform: 'capitalize' }}>
                              {assessment.trend}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              maxWidth: 250,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {assessment.notes}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Button 
                            size="small" 
                            color="primary"
                            onClick={() => handleAssessmentClick(assessment)}
                          >
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
          
          {/* Category Comparison Tab */}
          {tabValue === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Cognitive Categories Comparison
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Compare how different aspects of your cognitive function have changed over time.
              </Typography>
              
              <Box sx={{ height: 400, mb: 3 }}>
                <Line data={getCategoryChartData(theme)} options={chartOptions} />
              </Box>
              
              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={12} sm={6} md={3}>
                  <Paper 
                    elevation={1} 
                    sx={{ 
                      p: 2, 
                      borderLeft: `4px solid ${theme.palette.primary.main}`,
                    }}
                  >
                    <Typography variant="subtitle2" gutterBottom>
                      Lexical Diversity
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Measures the variety and richness of your vocabulary during speech or writing.
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Paper 
                    elevation={1} 
                    sx={{ 
                      p: 2, 
                      borderLeft: `4px solid ${theme.palette.secondary.main}`,
                    }}
                  >
                    <Typography variant="subtitle2" gutterBottom>
                      Syntactic Complexity
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Evaluates the complexity and structure of your sentences and grammar usage.
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Paper 
                    elevation={1} 
                    sx={{ 
                      p: 2, 
                      borderLeft: `4px solid ${theme.palette.warning.main}`,
                    }}
                  >
                    <Typography variant="subtitle2" gutterBottom>
                      Speech Fluency
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Assesses how smoothly you speak, including hesitations, pauses, and speech rate.
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Paper 
                    elevation={1} 
                    sx={{ 
                      p: 2, 
                      borderLeft: `4px solid ${theme.palette.success.main}`,
                    }}
                  >
                    <Typography variant="subtitle2" gutterBottom>
                      Memory Cues
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Evaluates memory-related linguistic patterns such as recall and references.
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          )}
        </Box>
      </Paper>
      
      <Box sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2, bgcolor: theme.palette.primary.light + '10' }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'medium' }}>
                Professional Assessment
              </Typography>
              <Typography variant="body1" paragraph>
                While our AI-powered screenings provide valuable insights, consider consulting with a healthcare provider for a comprehensive evaluation.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Our platform allows you to easily share your assessment history and trends with your healthcare provider to facilitate more informed discussions about your cognitive health.
              </Typography>
            </Grid>
            <Grid item xs={12} md={5} sx={{ textAlign: 'center' }}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                startIcon={<LocalHospitalIcon />}
                onClick={handleExportData}
                sx={{ px: 3, py: 1.5 }}
              >
                Share With Healthcare Provider
              </Button>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Your data is encrypted and shared securely
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Box>
      
      {/* Assessment Detail Dialog */}
      <Dialog
        open={detailDialogOpen}
        onClose={() => setDetailDialogOpen(false)}
        fullWidth
        maxWidth="md"
      >
        {selectedAssessment && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">
                  Assessment Details - {getFormattedDate(selectedAssessment.date)}
                </Typography>
                <Chip 
                  label={selectedAssessment.type} 
                  size="small"
                  color={selectedAssessment.type === "AI Screening" ? "primary" : "secondary"}
                />
              </Box>
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    Overall Score
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Box 
                      sx={{ 
                        width: 60, 
                        height: 60, 
                        borderRadius: '50%', 
                        bgcolor: theme.palette.primary.main,
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        fontSize: '1.5rem',
                        mr: 2
                      }}
                    >
                      {selectedAssessment.overallScore}
                    </Box>
                    <Box>
                      <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                        {getTrendIcon(selectedAssessment.trend)}
                        <span style={{ marginLeft: 8, textTransform: 'capitalize' }}>
                          {selectedAssessment.trend}
                        </span>
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        compared to previous assessment
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Typography variant="subtitle1" gutterBottom>
                    Notes
                  </Typography>
                  <Typography variant="body2" paragraph>
                    {selectedAssessment.notes}
                  </Typography>
                  
                  <Typography variant="subtitle1" gutterBottom>
                    Recommendations
                  </Typography>
                  <Box component="ul" sx={{ pl: 2 }}>
                    <Typography component="li" variant="body2">
                      Continue with regular cognitive training exercises
                    </Typography>
                    <Typography component="li" variant="body2">
                      Focus on {selectedAssessment.overallScore < 85 ? 'improving speech fluency' : 'maintaining current cognitive function'}
                    </Typography>
                    <Typography component="li" variant="body2">
                      Schedule your next assessment in 4-6 weeks
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    Category Breakdown
                  </Typography>
                  
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Category</TableCell>
                          <TableCell align="right">Score</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {Object.entries(selectedAssessment.categories).map(([category, score]) => {
                          const formattedCategory = category
                            .replace(/([A-Z])/g, ' $1')
                            .replace(/^./, str => str.toUpperCase());
                          
                          return (
                            <TableRow key={category}>
                              <TableCell>{formattedCategory}</TableCell>
                              <TableCell align="right">{score}/100</TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
                
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle1" gutterBottom>
                    Compare with Previous Assessment
                  </Typography>
                  
                  <Box sx={{ height: 300 }}>
                    <Line 
                      data={{
                        labels: Object.keys(selectedAssessment.categories).map(cat => 
                          cat.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())
                        ),
                        datasets: [
                          {
                            label: `Current (${getFormattedDate(selectedAssessment.date)})`,
                            data: Object.values(selectedAssessment.categories),
                            borderColor: theme.palette.primary.main,
                            backgroundColor: `${theme.palette.primary.main}20`,
                            fill: true
                          },
                          {
                            label: 'Previous Assessment',
                            data: Object.values(assessmentHistory.find(a => a.id === selectedAssessment.id + 1)?.categories || {}),
                            borderColor: theme.palette.grey[500],
                            backgroundColor: 'transparent',
                            borderDash: [5, 5]
                          }
                        ]
                      }} 
                      options={{
                        ...chartOptions,
                        scales: {
                          ...chartOptions.scales,
                          x: {
                            title: {
                              display: true,
                              text: 'Category'
                            }
                          }
                        }
                      }} 
                    />
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDetailDialogOpen(false)}>Close</Button>
              <Button 
                variant="outlined" 
                color="primary"
                startIcon={<PrintIcon />}
              >
                Print Report
              </Button>
              <Button 
                variant="contained" 
                color="primary"
                startIcon={<ShareIcon />}
                onClick={handleExportData}
              >
                Share With Doctor
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
      
      {/* Export Data Dialog */}
      <Dialog
        open={exportDialogOpen}
        onClose={() => setExportDialogOpen(false)}
      >
        <DialogTitle>Share Data with Healthcare Provider</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Enter your healthcare provider's email address to share your cognitive assessment history and trends.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="doctorEmail"
            label="Healthcare Provider's Email"
            type="email"
            fullWidth
            variant="outlined"
            value={doctorEmail}
            onChange={(e) => setDoctorEmail(e.target.value)}
          />
          
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              What will be shared:
            </Typography>
            <Box component="ul" sx={{ pl: 2 }}>
              <Typography component="li" variant="body2">
                Cognitive assessment scores and trends
              </Typography>
              <Typography component="li" variant="body2">
                Category breakdown and analysis
              </Typography>
              <Typography component="li" variant="body2">
                Training activity and progress
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setExportDialogOpen(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            color="primary"
            onClick={handleShareWithDoctor}
            disabled={!doctorEmail.includes('@')}
          >
            Share Data
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default HealthMonitoringPage; 