import { useState, useEffect } from 'react'
import {
  Box,
  Container,
  Grid,
  Heading,
  Text,
  VStack,
  HStack,
  Card,
  CardBody,
  Badge,
  Button,
  useColorModeValue,
  Flex,
  Icon,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Input,
  InputGroup,
  InputLeftElement,
  Progress,
  Avatar,
  AvatarGroup,
  Tooltip,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Image,
  List,
  ListItem,
  Divider,
  Select,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useToast,
  AspectRatio,
  Center,
  ScaleFade,
  SlideFade,
  Fade,
} from '@chakra-ui/react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FaSearch,
  FaTrophy,
  FaMedal,
  FaStar,
  FaFire,
  FaBook,
  FaQuestionCircle,
  FaChartLine,
  FaYoutube,
  FaPlay,
  FaPause,
  FaVolumeUp,
  FaVolumeMute,
  FaExpand,
  FaCompress,
  FaCog,
  FaList,
  FaStepForward,
  FaStepBackward,
  FaRandom,
  FaRedo,
  FaRocket,
  FaCrown,
  FaAward,
  FaLock,
  FaUnlock,
  FaBell,
  FaUser,
  FaSignOutAlt,
  FaCog as FaSettings,
  FaCheck,
  FaTimes,
} from 'react-icons/fa'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import EducationalGames from '../components/EducationalGames'

const MotionBox = motion(Box)
const MotionCard = motion(Card)

// Mock playlist data
const playlists = [
  {
    id: 'PL-1',
    title: 'Machine Learning Fundamentals',
    thumbnail: 'https://img.youtube.com/vi/KNAWp2S3w94/maxresdefault.jpg',
    videoCount: 12,
    videos: [
      { id: 'KNAWp2S3w94', title: 'Introduction to Machine Learning - 3Blue1Brown' },
      { id: 'aircAruvnKk', title: 'Neural Networks - 3Blue1Brown' },
      { id: 'R9OHn5ZF4Uo', title: 'Gradient Descent - 3Blue1Brown' },
    ],
  },
  {
    id: 'PL-2',
    title: 'Computer Science Fundamentals',
    thumbnail: 'https://img.youtube.com/vi/8hly31xKli0/maxresdefault.jpg',
    videoCount: 8,
    videos: [
      { id: '8hly31xKli0', title: 'Big O Notation - CS Dojo' },
      { id: 'RBSGKlAvoiM', title: 'Data Structures - CS Dojo' },
      { id: 'D6xkbGLQesk', title: 'Algorithms - CS Dojo' },
    ],
  },
]

// Quiz questions data
const quizQuestions = [
  {
    id: 1,
    question: "What is the main difference between supervised and unsupervised learning?",
    options: [
      "Supervised learning uses labeled data",
      "Unsupervised learning is faster",
      "They use different algorithms",
      "No difference"
    ],
    correctAnswer: 0
  },
  {
    id: 2,
    question: "Which of these is NOT a type of machine learning?",
    options: [
      "Supervised Learning",
      "Unsupervised Learning",
      "Reinforcement Learning",
      "Manual Learning"
    ],
    correctAnswer: 3
  },
  {
    id: 3,
    question: "What is overfitting in machine learning?",
    options: [
      "When the model performs well on training data but poorly on new data",
      "When the model is too simple",
      "When the model takes too long to train",
      "When the model has too few parameters"
    ],
    correctAnswer: 0
  },
  {
    id: 4,
    question: "What is the purpose of cross-validation?",
    options: [
      "To increase model complexity",
      "To reduce training time",
      "To evaluate model performance on unseen data",
      "To increase model accuracy"
    ],
    correctAnswer: 2
  },
  {
    id: 5,
    question: "Which algorithm is commonly used for classification?",
    options: [
      "Linear Regression",
      "K-Means Clustering",
      "Support Vector Machine",
      "Principal Component Analysis"
    ],
    correctAnswer: 2
  },
  {
    id: 6,
    question: "What is the main goal of dimensionality reduction?",
    options: [
      "To increase model complexity",
      "To reduce the number of features while preserving important information",
      "To increase training speed",
      "To improve model accuracy"
    ],
    correctAnswer: 1
  },
  {
    id: 7,
    question: "Which of these is a type of neural network?",
    options: [
      "Decision Tree",
      "Random Forest",
      "Convolutional Neural Network",
      "K-Nearest Neighbors"
    ],
    correctAnswer: 2
  },
  {
    id: 8,
    question: "What is the purpose of regularization?",
    options: [
      "To increase model complexity",
      "To reduce overfitting",
      "To speed up training",
      "To improve feature selection"
    ],
    correctAnswer: 1
  },
  {
    id: 9,
    question: "Which metric is commonly used for classification problems?",
    options: [
      "Mean Squared Error",
      "R-squared",
      "Accuracy",
      "Root Mean Squared Error"
    ],
    correctAnswer: 2
  },
  {
    id: 10,
    question: "What is the purpose of a learning rate in gradient descent?",
    options: [
      "To determine the number of iterations",
      "To control the step size in parameter updates",
      "To select the best features",
      "To normalize the data"
    ],
    correctAnswer: 1
  }
];

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)
  const [currentStreak, setCurrentStreak] = useState(5)
  const [level, setLevel] = useState(12)
  const [xp, setXp] = useState(750)
  const [nextLevelXp, setNextLevelXp] = useState(1000)
  const [videoUrl, setVideoUrl] = useState('')
  const [currentVideo, setCurrentVideo] = useState('')
  const [selectedPlaylist, setSelectedPlaylist] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [volume, setVolume] = useState(100)
  const [isShuffle, setIsShuffle] = useState(false)
  const [isRepeat, setIsRepeat] = useState(false)
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()
  const [achievements, setAchievements] = useState([
    { id: 1, title: 'First Video', icon: FaPlay, progress: 100 },
    { id: 2, title: '5 Day Streak', icon: FaFire, progress: 60 },
    { id: 3, title: 'Perfect Score', icon: FaStar, progress: 30 },
  ])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showQuizResults, setShowQuizResults] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState([
    { id: 1, name: "Student 1", score: 95 },
    { id: 2, name: "Student 2", score: 90 },
    { id: 3, name: "Student 3", score: 85 },
    { id: 4, name: "Student 4", score: 80 },
    { id: 5, name: "Student 5", score: 75 },
  ]);

  // Extract video ID from URL
  const extractVideoId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return match && match[2].length === 11 ? match[2] : null
  }

  // Handle video URL input
  const handleVideoUrlChange = (e) => {
    const url = e.target.value
    setVideoUrl(url)
    const videoId = extractVideoId(url)
    if (videoId) {
      setCurrentVideo(videoId)
      setIsPlaying(true)
    }
  }

  // Handle playlist selection
  const handlePlaylistSelect = (playlist) => {
    setSelectedPlaylist(playlist)
    setCurrentVideo(playlist.videos[0].id)
    setIsPlaying(true)
  }

  // Handle video selection from playlist
  const handleVideoSelect = (videoId) => {
    setCurrentVideo(videoId)
    setIsPlaying(true)
  }

  // Mock data for charts
  const weeklyProgressData = [
    { name: 'Mon', completed: 4 },
    { name: 'Tue', completed: 6 },
    { name: 'Wed', completed: 3 },
    { name: 'Thu', completed: 5 },
    { name: 'Fri', completed: 7 },
    { name: 'Sat', completed: 2 },
    { name: 'Sun', completed: 4 },
  ]

  const performanceData = [
    { name: 'Week 1', score: 65 },
    { name: 'Week 2', score: 75 },
    { name: 'Week 3', score: 85 },
    { name: 'Week 4', score: 95 },
  ]

  const COLORS = ['#48BB78', '#ECC94B', '#F56565']

  const handlePollAnswer = (selectedOptionIndex: number) => {
    const currentQuestion = quizQuestions[currentQuestionIndex];
    const isCorrect = selectedOptionIndex === currentQuestion.correctAnswer;
    
    if (isCorrect) {
      setQuizScore(prev => prev + 10);
      toast({
        title: "Correct! 🎉",
        description: "Great job! You've got it right!",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
    } else {
      toast({
        title: "Not quite right 😕",
        description: `The correct answer was: ${currentQuestion.options[currentQuestion.correctAnswer]}`,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }

    // Move to next question or end quiz
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex(prev => prev + 1);
      }, 2000);
    } else {
      setQuizCompleted(true);
      setShowQuizResults(true);
      updateLeaderboard();
    }
  };

  const updateLeaderboard = () => {
    const newScore = quizScore;
    const newLeaderboard = [...leaderboardData];
    const currentStudentIndex = newLeaderboard.findIndex(student => student.name === "Student 1");
    
    if (currentStudentIndex !== -1) {
      newLeaderboard[currentStudentIndex].score = newScore;
      newLeaderboard.sort((a, b) => b.score - a.score);
      setLeaderboardData(newLeaderboard);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setQuizScore(0);
    setQuizCompleted(false);
    setShowQuizResults(false);
  };

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const handleMute = () => {
    setIsMuted(!isMuted)
  }

  const handlePlaybackRateChange = (rate) => {
    setPlaybackRate(rate)
    toast({
      title: `Playback speed: ${rate}x`,
      status: 'info',
      duration: 2000,
      isClosable: true,
    })
  }

  const handleVolumeChange = (value) => {
    setVolume(value)
  }

  const handleShuffle = () => {
    setIsShuffle(!isShuffle)
    if (!isShuffle) {
      toast({
        title: 'Shuffle mode enabled',
        status: 'info',
        duration: 2000,
        isClosable: true,
      })
    }
  }

  const handleRepeat = () => {
    setIsRepeat(!isRepeat)
    if (!isRepeat) {
      toast({
        title: 'Repeat mode enabled',
        status: 'info',
        duration: 2000,
        isClosable: true,
      })
    }
  }

  const handleNextVideo = () => {
    if (selectedPlaylist) {
      const currentIndex = selectedPlaylist.videos.findIndex(v => v.id === currentVideo)
      const nextIndex = (currentIndex + 1) % selectedPlaylist.videos.length
      setCurrentVideo(selectedPlaylist.videos[nextIndex].id)
    }
  }

  const handlePreviousVideo = () => {
    if (selectedPlaylist) {
      const currentIndex = selectedPlaylist.videos.findIndex(v => v.id === currentVideo)
      const prevIndex = (currentIndex - 1 + selectedPlaylist.videos.length) % selectedPlaylist.videos.length
      setCurrentVideo(selectedPlaylist.videos[prevIndex].id)
    }
  }

  return (
    <Container maxW="container.xl" py={8}>
      {/* Header Section */}
      <MotionBox
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        mb={8}
      >
        <Card
          bg={bgColor}
          borderColor={borderColor}
          borderWidth="1px"
          boxShadow="xl"
          _hover={{ boxShadow: '2xl' }}
          transition="all 0.3s ease"
          overflow="hidden"
          borderRadius="2xl"
        >
          <Box
            h="200px"
            position="relative"
            bgGradient="linear(to-r, blue.500, purple.500)"
            _before={{
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'url("https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: 0.2,
            }}
          />
          <CardBody position="relative" mt="-100px">
            <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
              <HStack spacing={6}>
                <Avatar
                  size="2xl"
                  name="Student Name"
                  src="https://bit.ly/dan-abramov"
                  boxShadow="xl"
                  border="4px solid white"
                  _hover={{ transform: 'scale(1.1)' }}
                  transition="all 0.2s"
                />
                <VStack align="start" spacing={2}>
                  <Heading size="xl" color="white" textShadow="0 2px 4px rgba(0,0,0,0.2)">
                    Welcome back, Student!
                  </Heading>
                  <HStack spacing={4}>
                    <Badge colorScheme="green" px={4} py={1} borderRadius="full" fontSize="md">
                      Level {level}
                    </Badge>
                    <Badge colorScheme="blue" px={4} py={1} borderRadius="full" fontSize="md">
                      {xp}/{nextLevelXp} XP
                    </Badge>
                  </HStack>
                </VStack>
              </HStack>

              <HStack spacing={4}>
                <IconButton
                  icon={<FaBell />}
                  aria-label="Notifications"
                  variant="ghost"
                  colorScheme="whiteAlpha"
                  size="lg"
                  _hover={{ transform: 'scale(1.1)' }}
                  transition="all 0.2s"
                />

                <Menu>
                  <MenuButton
                    as={IconButton}
                    icon={<FaUser />}
                    aria-label="User menu"
                    variant="ghost"
                    colorScheme="whiteAlpha"
                    size="lg"
                    _hover={{ transform: 'scale(1.1)' }}
                    transition="all 0.2s"
                  />
                  <MenuList>
                    <MenuItem icon={<FaUser />}>Profile</MenuItem>
                    <MenuItem icon={<FaSettings />}>Settings</MenuItem>
                    <MenuItem icon={<FaSignOutAlt />}>Logout</MenuItem>
                  </MenuList>
                </Menu>
              </HStack>
            </Flex>

            <Grid templateColumns={{ base: '1fr', md: 'repeat(4, 1fr)' }} gap={6} mt={8}>
              <Stat
                bg="white"
                p={6}
                borderRadius="xl"
                boxShadow="lg"
                _hover={{ transform: 'translateY(-2px)', boxShadow: 'xl' }}
                transition="all 0.2s"
              >
                <StatLabel fontSize="lg" color="gray.600">Current Streak</StatLabel>
                <StatNumber fontSize="3xl" color="orange.500">{currentStreak} days</StatNumber>
                <StatHelpText>
                  <Icon as={FaFire} color="orange.500" /> Keep it up!
                </StatHelpText>
              </Stat>

              <Stat
                bg="white"
                p={6}
                borderRadius="xl"
                boxShadow="lg"
                _hover={{ transform: 'translateY(-2px)', boxShadow: 'xl' }}
                transition="all 0.2s"
              >
                <StatLabel fontSize="lg" color="gray.600">Completed Lectures</StatLabel>
                <StatNumber fontSize="3xl" color="green.500">24</StatNumber>
                <StatHelpText>
                  <Icon as={FaBook} color="green.500" /> 3 this week
                </StatHelpText>
              </Stat>

              <Stat
                bg="white"
                p={6}
                borderRadius="xl"
                boxShadow="lg"
                _hover={{ transform: 'translateY(-2px)', boxShadow: 'xl' }}
                transition="all 0.2s"
              >
                <StatLabel fontSize="lg" color="gray.600">Average Score</StatLabel>
                <StatNumber fontSize="3xl" color="purple.500">85%</StatNumber>
                <StatHelpText>
                  <Icon as={FaChartLine} color="purple.500" /> +5% this week
                </StatHelpText>
              </Stat>

              <Stat
                bg="white"
                p={6}
                borderRadius="xl"
                boxShadow="lg"
                _hover={{ transform: 'translateY(-2px)', boxShadow: 'xl' }}
                transition="all 0.2s"
              >
                <StatLabel fontSize="lg" color="gray.600">Class Rank</StatLabel>
                <StatNumber fontSize="3xl" color="yellow.500">#3</StatNumber>
                <StatHelpText>
                  <Icon as={FaTrophy} color="yellow.500" /> Top 5%
                </StatHelpText>
              </Stat>
            </Grid>
          </CardBody>
        </Card>
      </MotionBox>

      <VStack spacing={8} align="stretch">
        {/* Video URL Input */}
        <Flex justify="space-between" align="center">
          <Heading size="lg">Learning Videos</Heading>
          <InputGroup maxW="300px">
            <InputLeftElement pointerEvents="none">
              <Icon as={FaYoutube} color="red.500" />
            </InputLeftElement>
            <Input
              placeholder="Paste YouTube video URL..."
              value={videoUrl}
              onChange={handleVideoUrlChange}
              borderRadius="full"
              _focus={{ boxShadow: '0 0 0 1px #E53E3E' }}
              transition="all 0.2s"
            />
          </InputGroup>
        </Flex>

        {/* Video Player Section */}
        <Card bg={bgColor} borderColor={borderColor} borderWidth="1px" borderRadius="2xl">
          <CardBody>
            <Grid templateColumns={{ base: '1fr', lg: '3fr 1fr' }} gap={6}>
              {/* Video Player */}
              <Box>
                <AspectRatio ratio={16 / 9} mb={4}>
                  <Box
                    bg="black"
                    borderRadius="xl"
                    overflow="hidden"
                    boxShadow="xl"
                    _hover={{ boxShadow: '2xl' }}
                    transition="all 0.3s ease"
                    position="relative"
                    width="100%"
                    height="100%"
                  >
                    <iframe
                      src={`https://www.youtube.com/embed/${currentVideo}?autoplay=1&mute=${isMuted}&playbackRate=${playbackRate}`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        border: 'none'
                      }}
                    />
                  </Box>
                </AspectRatio>

                {/* Video Controls */}
                <MotionBox
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <VStack spacing={4} mt={4}>
                    <HStack w="100%" justify="space-between">
                      <Text fontSize="lg" fontWeight="bold">
                        {selectedPlaylist
                          ? selectedPlaylist.videos.find((v) => v.id === currentVideo)?.title
                          : 'Current Video'}
                      </Text>
                      <HStack>
                        <IconButton
                          icon={<FaStepBackward />}
                          onClick={handlePreviousVideo}
                          aria-label="Previous video"
                          isDisabled={!selectedPlaylist}
                          _hover={{ transform: 'scale(1.1)' }}
                          transition="all 0.2s"
                        />
                        <IconButton
                          icon={<FaStepForward />}
                          onClick={handleNextVideo}
                          aria-label="Next video"
                          isDisabled={!selectedPlaylist}
                          _hover={{ transform: 'scale(1.1)' }}
                          transition="all 0.2s"
                        />
                        <IconButton
                          icon={<FaRandom />}
                          onClick={handleShuffle}
                          aria-label="Shuffle"
                          colorScheme={isShuffle ? 'blue' : 'gray'}
                          isDisabled={!selectedPlaylist}
                          _hover={{ transform: 'scale(1.1)' }}
                          transition="all 0.2s"
                        />
                        <IconButton
                          icon={<FaRedo />}
                          onClick={handleRepeat}
                          aria-label="Repeat"
                          colorScheme={isRepeat ? 'blue' : 'gray'}
                          isDisabled={!selectedPlaylist}
                          _hover={{ transform: 'scale(1.1)' }}
                          transition="all 0.2s"
                        />
                      </HStack>
                    </HStack>
                  </VStack>
                </MotionBox>
              </Box>

              {/* Playlist Sidebar */}
              <MotionBox
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <VStack align="stretch" spacing={4}>
                  <Heading size="md">Available Playlists</Heading>
                  <List spacing={3}>
                    {playlists.map((playlist) => (
                      <ListItem key={playlist.id}>
                        <MotionCard
                          bg={selectedPlaylist?.id === playlist.id ? 'blue.50' : 'white'}
                          cursor="pointer"
                          onClick={() => handlePlaylistSelect(playlist)}
                          _hover={{ bg: 'gray.50', transform: 'translateY(-2px)' }}
                          transition="all 0.2s"
                          whileHover={{ scale: 1.02 }}
                          borderRadius="xl"
                        >
                          <CardBody>
                            <HStack spacing={4}>
                              <Image
                                src={playlist.thumbnail}
                                alt={playlist.title}
                                boxSize="80px"
                                objectFit="cover"
                                borderRadius="lg"
                                transition="all 0.3s"
                                _hover={{ transform: 'scale(1.1)' }}
                              />
                              <VStack align="start" spacing={1}>
                                <Text fontWeight="bold">{playlist.title}</Text>
                                <Text fontSize="sm" color="gray.600">
                                  {playlist.videoCount} videos
                                </Text>
                                <Badge colorScheme="blue">
                                  {playlist.videos.length} available
                                </Badge>
                              </VStack>
                            </HStack>
                          </CardBody>
                        </MotionCard>
                      </ListItem>
                    ))}
                  </List>
                </VStack>
              </MotionBox>
            </Grid>
          </CardBody>
        </Card>

        {/* Current Lecture Section with Poll */}
        <Card bg={bgColor} borderColor={borderColor} borderWidth="1px">
          <CardBody>
            <VStack spacing={6} align="stretch">
              <Heading size="md">Current Lecture: Introduction to Machine Learning</Heading>
              <HStack spacing={4}>
                <Button leftIcon={<FaPlay />} colorScheme="blue">
                  Continue Learning
                </Button>
                <Badge colorScheme="green" p={2} borderRadius="md">
                  <HStack>
                    <Icon as={FaFire} />
                    <Text>Quiz Active</Text>
                  </HStack>
                </Badge>
              </HStack>

              {/* Quiz Progress */}
              <HStack justify="space-between" align="center">
                <Text>Question {currentQuestionIndex + 1} of {quizQuestions.length}</Text>
                <Progress
                  value={(currentQuestionIndex / quizQuestions.length) * 100}
                  size="sm"
                  colorScheme="blue"
                  w="200px"
                />
                <Text>Score: {quizScore}</Text>
              </HStack>

              {/* Quiz Question */}
              <Card bg="blue.50" p={4}>
                <VStack spacing={4} align="stretch">
                  <Text fontWeight="bold">Quiz Question:</Text>
                  <Text>{quizQuestions[currentQuestionIndex].question}</Text>
                  <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                    {quizQuestions[currentQuestionIndex].options.map((option, index) => (
                      <Button
                        key={index}
                        onClick={() => handlePollAnswer(index)}
                        colorScheme="blue"
                        variant="outline"
                        h="100px"
                        fontSize="lg"
                        isDisabled={quizCompleted}
                      >
                        {option}
                      </Button>
                    ))}
                  </Grid>
                </VStack>
              </Card>
            </VStack>
          </CardBody>
        </Card>

        {/* Quiz Results Modal */}
        <Modal isOpen={showQuizResults} onClose={() => setShowQuizResults(false)}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Quiz Results 🎉</ModalHeader>
            <ModalBody>
              <VStack spacing={4} py={4}>
                <Text fontSize="xl" fontWeight="bold" color="blue.500">
                  Your Score: {quizScore}/{quizQuestions.length * 10}
                </Text>
                <Text>Percentage: {Math.round((quizScore / (quizQuestions.length * 10)) * 100)}%</Text>
                <Text>
                  {quizScore >= 80
                    ? "Excellent! You're a machine learning expert! 🌟"
                    : quizScore >= 60
                    ? "Good job! Keep learning! 📚"
                    : "Keep practicing! You'll get better! 💪"}
                </Text>
                <Button
                  colorScheme="blue"
                  onClick={() => {
                    setShowQuizResults(false);
                    resetQuiz();
                  }}
                >
                  Try Again
                </Button>
              </VStack>
            </ModalBody>
          </ModalContent>
        </Modal>

        {/* Achievements and Badges */}
        <Card bg={bgColor} borderColor={borderColor} borderWidth="1px">
          <CardBody>
            <VStack spacing={6} align="stretch">
              <Heading size="md">Achievements & Badges</Heading>
              <Grid templateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }} gap={4}>
                <Tooltip label="Perfect Week - Completed all lectures for 7 days">
                  <MotionBox whileHover={{ scale: 1.1 }} cursor="pointer">
                    <Card bg="yellow.50" p={4}>
                      <VStack>
                        <Icon as={FaMedal} boxSize={8} color="yellow.500" />
                        <Text fontWeight="bold">Perfect Week</Text>
                      </VStack>
                    </Card>
                  </MotionBox>
                </Tooltip>
                <Tooltip label="Quick Learner - Completed 5 lectures in one day">
                  <MotionBox whileHover={{ scale: 1.1 }} cursor="pointer">
                    <Card bg="green.50" p={4}>
                      <VStack>
                        <Icon as={FaRocket} boxSize={8} color="green.500" />
                        <Text fontWeight="bold">Quick Learner</Text>
                      </VStack>
                    </Card>
                  </MotionBox>
                </Tooltip>
                <Tooltip label="Master Mind - Scored 100% on 3 quizzes">
                  <MotionBox whileHover={{ scale: 1.1 }} cursor="pointer">
                    <Card bg="purple.50" p={4}>
                      <VStack>
                        <Icon as={FaCrown} boxSize={8} color="purple.500" />
                        <Text fontWeight="bold">Master Mind</Text>
                      </VStack>
                    </Card>
                  </MotionBox>
                </Tooltip>
                <Tooltip label="Consistent - Maintained a 5-day streak">
                  <MotionBox whileHover={{ scale: 1.1 }} cursor="pointer">
                    <Card bg="blue.50" p={4}>
                      <VStack>
                        <Icon as={FaCrown} boxSize={8} color="blue.500" />
                        <Text fontWeight="bold">Consistent</Text>
                      </VStack>
                    </Card>
                  </MotionBox>
                </Tooltip>
              </Grid>
            </VStack>
          </CardBody>
        </Card>

        {/* Leaderboard */}
        <Card bg={bgColor} borderColor={borderColor} borderWidth="1px">
          <CardBody>
            <VStack spacing={6} align="stretch">
              <Heading size="md">Class Leaderboard</Heading>
              <VStack spacing={4} align="stretch">
                {leaderboardData.map((student, index) => (
                  <MotionBox
                    key={student.id}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card bg={index === 0 ? 'yellow.50' : 'white'}>
                      <CardBody>
                        <HStack justify="space-between">
                          <HStack spacing={4}>
                            <Text fontWeight="bold">#{index + 1}</Text>
                            <Avatar name={student.name} />
                            <Text>{student.name}</Text>
                          </HStack>
                          <HStack>
                            <Icon as={FaStar} color="yellow.500" />
                            <Text fontWeight="bold">{student.score}%</Text>
                          </HStack>
                        </HStack>
                      </CardBody>
                    </Card>
                  </MotionBox>
                ))}
              </VStack>
            </VStack>
          </CardBody>
        </Card>

        {/* Progress Charts */}
        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6}>
          <Card bg={bgColor} borderColor={borderColor} borderWidth="1px">
            <CardBody>
              <VStack align="start" spacing={4}>
                <Heading size="md">Weekly Progress</Heading>
                <Box w="100%" h="300px">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyProgressData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <RechartsTooltip />
                      <Bar dataKey="completed" fill="#3182CE" />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </VStack>
            </CardBody>
          </Card>

          <Card bg={bgColor} borderColor={borderColor} borderWidth="1px">
            <CardBody>
              <VStack align="start" spacing={4}>
                <Heading size="md">Performance Trend</Heading>
                <Box w="100%" h="300px">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <RechartsTooltip />
                      <Line type="monotone" dataKey="score" stroke="#3182CE" />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </VStack>
            </CardBody>
          </Card>
        </Grid>

        {/* Educational Games Section */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <EducationalGames />
        </MotionBox>
      </VStack>

      {/* Confetti Animation Modal */}
      <Modal isOpen={showConfetti} onClose={() => setShowConfetti(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>🎉 Correct Answer! 🎉</ModalHeader>
          <ModalBody>
            <VStack spacing={4} py={4}>
              <Text fontSize="xl" fontWeight="bold" color="green.500">
                +50 XP
              </Text>
              <Text>Great job! Keep up the good work!</Text>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Container>
  )
}

export default StudentDashboard 