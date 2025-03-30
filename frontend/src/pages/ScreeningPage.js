import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  TextField,
  Grid,
  Card,
  CardContent,
  Step,
  Stepper,
  StepLabel,
  StepContent,
  CircularProgress,
  Alert,
  Divider,
  IconButton,
  LinearProgress,
  Tooltip,
  Chip
} from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import MicOffIcon from '@mui/icons-material/MicOff';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { useTheme } from '@mui/material/styles';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip as ChartTooltip,
  Legend
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import { analyzeText } from '../api/aiService';
import ScoreExplanation from '../components/ScoreExplanation';

// Register Chart.js components
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  ChartTooltip,
  Legend
);

const ScreeningPage = () => {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [recording, setRecording] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioURL, setAudioURL] = useState('');
  const [recordingTime, setRecordingTime] = useState(0);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [inputMethod, setInputMethod] = useState('speech'); // 'speech' or 'text'

  // Prompt suggestions
  const prompts = [
    "Describe what you did yesterday from morning to evening.",
    "Tell me about your favorite vacation or trip.",
    "Describe the plot of a movie or book you enjoyed recently.",
    "Explain how to prepare your favorite meal.",
    "Share a memorable experience from your childhood."
  ];

  // Real analysis function that calls the API
  const analyzeLanguage = async (data) => {
    try {
      const isTextData = typeof data === 'string';
      const analysisType = isTextData ? 'text' : 'speech';

      // For text input, directly call the API
      if (isTextData) {
        return await analyzeText(data, analysisType, true);
      }
      // For audio input, we would first transcribe the audio to text
      // and then analyze the text
      else {
        // This would be replaced with actual speech-to-text conversion
        // For now, we're simulating it:
        const simulatedTranscription = "This is a simulated transcription of speech. In a real application, we would convert your audio to text using a speech recognition service, and then analyze the resulting text.";

        // Now analyze the transcribed text
        return await analyzeText(simulatedTranscription, analysisType, true);
      }
    } catch (error) {
      console.error('Error analyzing language:', error);
      throw error;
    }
  };

  // Start recording audio
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const audioChunks = [];

      recorder.addEventListener('dataavailable', event => {
        audioChunks.push(event.data);
      });

      recorder.addEventListener('stop', () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioBlob(audioBlob);
        setAudioURL(audioUrl);
      });

      setMediaRecorder(recorder);
      recorder.start();
      setRecording(true);
      setRecordingTime(0);
    } catch (err) {
      console.error('Error accessing microphone:', err);
      setError('Could not access microphone. Please check your browser permissions.');
    }
  };

  // Stop recording audio
  const stopRecording = () => {
    if (mediaRecorder && recording) {
      mediaRecorder.stop();
      setRecording(false);
      // Stop all audio tracks
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
    }
  };

  // Timer for recording
  useEffect(() => {
    let interval;
    if (recording) {
      interval = setInterval(() => {
        setRecordingTime(prevTime => {
          // Auto-stop after 2 minutes
          if (prevTime >= 120) {
            stopRecording();
            return prevTime;
          }
          return prevTime + 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [recording]);

  // Format recording time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  // Handle submit for analysis
  const handleSubmit = async () => {
    try {
      setAnalyzing(true);
      setError('');

      let dataToAnalyze;
      if (inputMethod === 'speech') {
        if (!audioBlob) {
          setError('Please record a speech sample before submitting.');
          setAnalyzing(false);
          return;
        }
        dataToAnalyze = audioBlob;
      } else {
        if (!textInput.trim()) {
          setError('Please enter some text before submitting.');
          setAnalyzing(false);
          return;
        }
        dataToAnalyze = textInput;
      }

      // Call API to analyze the data
      const apiResults = await analyzeLanguage(dataToAnalyze);

      if (!apiResults.success) {
        throw new Error(apiResults.error || 'Analysis failed');
      }

      // Transform API response to match the UI expectations
      const transformedResults = {
        scores: {
          // Convert domain scores from API (higher = more risk) to UI format (higher = better)
          // and map API domain names to UI score names
          lexicalDiversity: apiResults.domain_scores.LANGUAGE ?
            Math.round((1 - apiResults.domain_scores.LANGUAGE) * 100) : 75,
          syntacticComplexity: apiResults.domain_scores.EXECUTIVE_FUNCTION ?
            Math.round((1 - apiResults.domain_scores.EXECUTIVE_FUNCTION) * 100) : 75,
          semanticCoherence: apiResults.domain_scores.VISUOSPATIAL ?
            Math.round((1 - apiResults.domain_scores.VISUOSPATIAL) * 100) : 85,
          speechFluency: apiResults.domain_scores.ATTENTION ?
            Math.round((1 - apiResults.domain_scores.ATTENTION) * 100) : 70,
          memoryCues: apiResults.domain_scores.MEMORY ?
            Math.round((1 - apiResults.domain_scores.MEMORY) * 100) : 80
        },
        // Convert overall score (0-1, higher = more risk) to UI format (0-100, higher = better)
        overallScore: Math.round((1 - apiResults.overall_score) * 100),
        // Map risk level based on API overall score
        risk: {
          level: apiResults.overall_score < 0.3 ? 'Low' :
            apiResults.overall_score < 0.6 ? 'Moderate' : 'High',
          color: apiResults.overall_score < 0.3 ? theme.palette.success.main :
            apiResults.overall_score < 0.6 ? theme.palette.warning.main :
              theme.palette.error.main
        },
        recommendations: apiResults.recommendations || [
          "Regular cognitive training exercises 3-4 times per week",
          "Daily reading and writing practice to maintain language skills",
          "Social engagement through conversation and group activities"
        ],
        insights: apiResults.features ?
          `Analysis shows ${apiResults.features.lexical_diversity ? 'a vocabulary richness of ' +
            Math.round(apiResults.features.lexical_diversity.ttr * 100) + '%. ' : ''}${apiResults.features.syntactic_complexity ? 'Average sentence complexity is ' +
              Math.round(apiResults.features.syntactic_complexity.mean_sentence_length) +
              ' words per sentence. ' : ''}Consider regular cognitive exercises to maintain language skills.` :
          "Analysis complete. Results show patterns in your language use that can help identify cognitive health trends."
      };

      setResults(transformedResults);
      setActiveStep(3); // Go to results step
    } catch (err) {
      console.error('Error during analysis:', err);
      setError('An error occurred during analysis: ' + (err.message || 'Please try again.'));
    } finally {
      setAnalyzing(false);
    }
  };

  // Reset the form for a new submission
  const resetForm = () => {
    setActiveStep(0);
    setTextInput('');
    setAudioBlob(null);
    setAudioURL('');
    setResults(null);
    setError('');
  };

  // Generate chart data from results
  const getChartData = () => {
    if (!results) return null;

    return {
      labels: [
        'Lexical Diversity',
        'Syntactic Complexity',
        'Semantic Coherence',
        'Speech Fluency',
        'Memory Cues'
      ],
      datasets: [
        {
          label: 'Your Score',
          data: [
            results.scores.lexicalDiversity,
            results.scores.syntacticComplexity,
            results.scores.semanticCoherence,
            results.scores.speechFluency,
            results.scores.memoryCues
          ],
          backgroundColor: `${theme.palette.primary.main}50`,
          borderColor: theme.palette.primary.main,
          borderWidth: 2,
          pointBackgroundColor: theme.palette.primary.main,
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: theme.palette.primary.main
        },
        {
          label: 'Average Healthy Range',
          data: [85, 85, 85, 85, 85],
          backgroundColor: `${theme.palette.success.main}30`,
          borderColor: theme.palette.success.main,
          borderWidth: 1,
          borderDash: [5, 5],
          pointRadius: 0,
          fill: false
        }
      ]
    };
  };

  const chartOptions = {
    scales: {
      r: {
        angleLines: {
          display: true
        },
        suggestedMin: 50,
        suggestedMax: 100
      }
    },
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  };

  // Steps for the screening process
  const steps = [
    {
      label: 'Select Input Method',
      description: 'Choose how you would like to provide your language sample.',
      content: (
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <Card
              onClick={() => setInputMethod('speech')}
              sx={{
                cursor: 'pointer',
                height: '100%',
                border: inputMethod === 'speech' ? `2px solid ${theme.palette.primary.main}` : 'none',
                boxShadow: inputMethod === 'speech' ? `0 0 10px ${theme.palette.primary.main}30` : 'none',
                transition: 'all 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 4
                }
              }}
            >
              <CardContent sx={{ textAlign: 'center' }}>
                <MicIcon sx={{ fontSize: 60, color: theme.palette.primary.main, mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Voice Recording
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Record a speech sample for our AI to analyze speech patterns,
                  hesitations, and vocal biomarkers.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Card
              onClick={() => setInputMethod('text')}
              sx={{
                cursor: 'pointer',
                height: '100%',
                border: inputMethod === 'text' ? `2px solid ${theme.palette.primary.main}` : 'none',
                boxShadow: inputMethod === 'text' ? `0 0 10px ${theme.palette.primary.main}30` : 'none',
                transition: 'all 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 4
                }
              }}
            >
              <CardContent sx={{ textAlign: 'center' }}>
                <TextFieldsIcon sx={{ fontSize: 60, color: theme.palette.primary.main, mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Text Input
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Type or paste a writing sample for our AI to analyze word choice,
                  grammar patterns, and linguistic structures.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )
    },
    {
      label: 'Prompt Selection',
      description: 'Choose a topic to speak or write about, or create your own.',
      content: (
        <>
          <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
            Suggested Prompts:
          </Typography>
          <Box sx={{ mb: 3 }}>
            {prompts.map((prompt, index) => (
              <Chip
                key={index}
                label={prompt}
                onClick={() => inputMethod === 'text' ? setTextInput(prompt) : null}
                sx={{
                  m: 0.5,
                  cursor: 'pointer',
                  bgcolor: theme.palette.grey[100],
                  '&:hover': {
                    bgcolor: theme.palette.primary.light + '20',
                  }
                }}
              />
            ))}
          </Box>
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body2">
              {inputMethod === 'speech'
                ? "Please speak for at least 30 seconds for accurate analysis. Our AI works best with natural, conversational speech."
                : "Please write at least 150 words for accurate analysis. Our AI looks for patterns in your writing style and word choice."
              }
            </Typography>
          </Alert>
        </>
      )
    },
    {
      label: inputMethod === 'speech' ? 'Record Speech' : 'Enter Text',
      description: inputMethod === 'speech'
        ? 'Record yourself speaking about the chosen topic.'
        : 'Type or paste your text about the chosen topic.',
      content: inputMethod === 'speech' ? (
        <Box sx={{ textAlign: 'center', py: 2 }}>
          <Box
            sx={{
              display: 'inline-flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: 150,
              height: 150,
              borderRadius: '50%',
              bgcolor: recording ? theme.palette.error.main : theme.palette.primary.main,
              boxShadow: recording ? `0 0 0 8px ${theme.palette.error.main}30` : `0 0 0 8px ${theme.palette.primary.main}30`,
              transition: 'all 0.3s',
              animation: recording ? 'pulse 1.5s infinite' : 'none',
              mb: 3,
              '@keyframes pulse': {
                '0%': {
                  boxShadow: `0 0 0 0 ${theme.palette.error.main}70`
                },
                '70%': {
                  boxShadow: `0 0 0 15px ${theme.palette.error.main}00`
                },
                '100%': {
                  boxShadow: `0 0 0 0 ${theme.palette.error.main}00`
                }
              }
            }}
          >
            <IconButton
              color="inherit"
              onClick={recording ? stopRecording : startRecording}
              sx={{
                width: 100,
                height: 100,
                color: 'white',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.1)',
                },
              }}
            >
              {recording ? <StopIcon sx={{ fontSize: 50 }} /> : <MicIcon sx={{ fontSize: 50 }} />}
            </IconButton>
          </Box>

          <Typography variant="h6" sx={{ mb: 1 }}>
            {recording ? 'Recording...' : audioBlob ? 'Recording Complete' : 'Start Recording'}
          </Typography>

          {recording && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="body1" sx={{ fontFamily: 'monospace', mb: 1 }}>
                {formatTime(recordingTime)}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={(recordingTime / 120) * 100}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  maxWidth: 300,
                  mx: 'auto',
                  bgcolor: theme.palette.grey[200]
                }}
              />
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                Recording will automatically stop after 2 minutes
              </Typography>
            </Box>
          )}

          {audioBlob && !recording && (
            <Box sx={{ mb: 3, mt: 3 }}>
              <audio src={audioURL} controls />
              <Button
                startIcon={<MicIcon />}
                variant="outlined"
                color="primary"
                onClick={startRecording}
                sx={{ mt: 2 }}
              >
                Record Again
              </Button>
            </Box>
          )}

          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 500, mx: 'auto', mt: 2 }}>
            Speak naturally about the chosen topic. Try to provide detailed descriptions and use complex sentences when possible.
          </Typography>
        </Box>
      ) : (
        <Box sx={{ py: 2 }}>
          <TextField
            fullWidth
            multiline
            rows={8}
            placeholder="Enter your text here..."
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">
              Word count: {textInput.split(/\s+/).filter(word => word.length > 0).length}
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              size="small"
              onClick={() => setTextInput('')}
              disabled={!textInput}
            >
              Clear Text
            </Button>
          </Box>
        </Box>
      )
    },
    {
      label: 'Results',
      description: 'View your cognitive assessment results and recommendations.',
      content: results ? (
        <Box sx={{ py: 2 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={5}>
              <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                  <Typography variant="h5" gutterBottom>
                    Overall Cognitive Score
                  </Typography>
                  <Box
                    sx={{
                      position: 'relative',
                      display: 'inline-flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: 180,
                      height: 180,
                    }}
                  >
                    <CircularProgress
                      variant="determinate"
                      value={results.overallScore}
                      size={180}
                      thickness={5}
                      sx={{
                        color: results.risk.color,
                        position: 'absolute',
                        zIndex: 1,
                      }}
                    />
                    <CircularProgress
                      variant="determinate"
                      value={100}
                      size={180}
                      thickness={5}
                      sx={{
                        color: theme.palette.grey[200],
                        position: 'absolute',
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
                        flexDirection: 'column',
                      }}
                    >
                      <Typography variant="h3" component="div" color="text.primary" fontWeight="bold">
                        {Math.round(results.overallScore)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        out of 100
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Box sx={{ textAlign: 'center', mb: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Cognitive Risk Level
                  </Typography>
                  <Chip
                    label={results.risk.level}
                    sx={{
                      bgcolor: results.risk.color + '20',
                      color: results.risk.color,
                      fontWeight: 'bold',
                      fontSize: '1rem',
                      py: 2,
                      px: 1
                    }}
                  />
                </Box>

                <Divider sx={{ my: 3 }} />

                <Typography variant="h6" gutterBottom>
                  AI Insights
                </Typography>
                <Typography variant="body2" paragraph>
                  {results.insights}
                </Typography>

                <Box sx={{ mt: 4 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={resetForm}
                  >
                    Take Another Assessment
                  </Button>
                </Box>
              </Paper>
            </Grid>

            <Grid item xs={12} md={7}>
              <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  Cognitive Profile
                  <Tooltip title="This radar chart shows your performance across five key cognitive domains related to language processing.">
                    <IconButton size="small" sx={{ ml: 1 }}>
                      <InfoOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Typography>
                <Box sx={{ height: 300 }}>
                  <Radar data={getChartData()} options={chartOptions} />
                </Box>
              </Paper>

              <ScoreExplanation scores={results.scores} />

              <Paper elevation={2} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Personalized Recommendations
                </Typography>
                <Box component="ul" sx={{ pl: 2 }}>
                  {results.recommendations.map((rec, index) => (
                    <Typography component="li" variant="body2" key={index} sx={{ mb: 1 }}>
                      {rec}
                    </Typography>
                  ))}
                </Box>
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<FitnessCenterIcon />}
                    href="/cognitive-training"
                  >
                    Start Training
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    startIcon={<InfoOutlinedIcon />}
                    href="/resources"
                  >
                    Learn More
                  </Button>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      ) : (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <CircularProgress />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Loading your results...
          </Typography>
        </Box>
      )
    }
  ];

  const handleStepChange = (step) => {
    // Validation before proceeding to next step
    if (activeStep === 0 && !inputMethod) {
      setError('Please select an input method.');
      return;
    }

    if (activeStep === 2) {
      if (inputMethod === 'speech' && !audioBlob) {
        setError('Please record a speech sample before continuing.');
        return;
      }

      if (inputMethod === 'text' && (!textInput.trim() || textInput.split(/\s+/).filter(word => word.length > 0).length < 20)) {
        setError('Please enter at least 20 words for accurate analysis.');
        return;
      }

      // If validation passes, submit for analysis
      handleSubmit();
      return;
    }

    setActiveStep(step);
    setError('');
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }} id="main-content">
      <Box textAlign="center" sx={{ mb: 6 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          AI-Powered Cognitive Screening
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 800, mx: 'auto' }}>
          Analyze language patterns to detect subtle cognitive changes that might indicate early signs of MCI or Alzheimer's.
        </Typography>
      </Box>

      <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, borderRadius: 2 }}>
        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel>
                <Typography variant="h6">{step.label}</Typography>
              </StepLabel>
              <StepContent>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                  {step.description}
                </Typography>

                {step.content}

                <Box sx={{ mb: 2, mt: 3 }}>
                  <div>
                    {index < steps.length - 1 && (
                      <Button
                        variant="contained"
                        onClick={() => handleStepChange(index + 1)}
                        sx={{ mt: 1, mr: 1 }}
                        disabled={analyzing}
                      >
                        {index === 2 ? (
                          analyzing ? (
                            <>
                              <CircularProgress size={24} sx={{ mr: 1 }} />
                              Analyzing...
                            </>
                          ) : (
                            'Submit for Analysis'
                          )
                        ) : (
                          'Continue'
                        )}
                      </Button>
                    )}

                    <Button
                      disabled={index === 0 || analyzing}
                      onClick={() => setActiveStep(index - 1)}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      Back
                    </Button>
                  </div>
                </Box>
              </StepContent>
            </Step>
          ))}
        </Stepper>
      </Paper>

      <Box sx={{ mt: 8, mb: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'medium' }}>
          Frequently Asked Questions
        </Typography>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          {[
            {
              question: "How accurate is this screening tool?",
              answer: "Our AI screening tool achieves up to 85% accuracy in detecting early linguistic markers of cognitive decline when compared to clinical assessments. However, it's designed as a preliminary screening tool, not a medical diagnosis."
            },
            {
              question: "How often should I take this assessment?",
              answer: "We recommend taking the assessment every 3-6 months to track changes over time. Consistent monitoring provides the most valuable insights into cognitive health trends."
            },
            {
              question: "Is my data private and secure?",
              answer: "Yes, all your speech and text data is encrypted and stored securely. We adhere to HIPAA guidelines and never share your personal health information without explicit consent."
            },
            {
              question: "What happens if the tool detects potential cognitive decline?",
              answer: "The platform will provide personalized recommendations based on your results. For moderate to high risk scores, we suggest consulting with a healthcare professional and sharing your assessment results."
            }
          ].map((faq, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <HelpOutlineIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                    {faq.question}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {faq.answer}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default ScreeningPage; 