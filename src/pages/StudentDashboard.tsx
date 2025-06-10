import { useState } from 'react'
import {
  Box,
  Container,
  Grid,
  Heading,
  Text,
  VStack,
  HStack,
  Progress,
  Badge,
  Card,
  CardBody,
  Button,
  useToast,
  Avatar,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
} from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { FaTrophy, FaStar, FaMedal } from 'react-icons/fa'
import { useAuthStore } from '../stores/authStore'

interface Question {
  id: string
  text: string
  options: string[]
  correctAnswer: number
}

const MotionBox = motion(Box)

const StudentDashboard = () => {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [level, setLevel] = useState(1)
  const [showConfetti, setShowConfetti] = useState(false)
  const toast = useToast()
  const user = useAuthStore((state) => state.user)

  // Mock question for demonstration
  const mockQuestion: Question = {
    id: '1',
    text: 'What is the capital of France?',
    options: ['London', 'Berlin', 'Paris', 'Madrid'],
    correctAnswer: 2,
  }

  const handleAnswer = (selectedIndex: number) => {
    if (!currentQuestion) return

    if (selectedIndex === currentQuestion.correctAnswer) {
      setScore((prev) => prev + 10)
      setStreak((prev) => prev + 1)
      setShowConfetti(true)
      toast({
        title: 'Correct! 🎉',
        description: 'Great job! Keep up the good work!',
        status: 'success',
        duration: 2000,
      })

      // Level up every 50 points
      if ((score + 10) % 50 === 0) {
        setLevel((prev) => prev + 1)
        toast({
          title: 'Level Up! 🚀',
          description: `You've reached level ${level + 1}!`,
          status: 'info',
          duration: 3000,
        })
      }
    } else {
      setStreak(0)
      toast({
        title: 'Incorrect',
        description: 'Keep trying!',
        status: 'error',
        duration: 2000,
      })
    }

    // Simulate getting a new question
    setTimeout(() => {
      setCurrentQuestion(mockQuestion)
      setShowConfetti(false)
    }, 2000)
  }

  return (
    <Container maxW="container.xl" py={8}>
      <Grid templateColumns={{ base: '1fr', md: '300px 1fr' }} gap={8}>
        {/* Sidebar */}
        <VStack spacing={6} align="stretch">
          <Card>
            <CardBody>
              <VStack spacing={4}>
                <Avatar size="xl" name={user?.name} />
                <Heading size="md">{user?.name}</Heading>
                <Badge colorScheme="green">Level {level}</Badge>
                <Progress value={(score % 50) * 2} colorScheme="brand" />
                <Text>Progress to next level</Text>
              </VStack>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <VStack spacing={4}>
                <Stat>
                  <StatLabel>Total Score</StatLabel>
                  <StatNumber>{score}</StatNumber>
                  <StatHelpText>
                    <FaTrophy color="gold" /> {Math.floor(score / 50)} badges earned
                  </StatHelpText>
                </Stat>
                <Stat>
                  <StatLabel>Current Streak</StatLabel>
                  <StatNumber>{streak}</StatNumber>
                  <StatHelpText>
                    <FaStar color="gold" /> {streak} correct in a row
                  </StatHelpText>
                </Stat>
              </VStack>
            </CardBody>
          </Card>
        </VStack>

        {/* Main Content */}
        <VStack spacing={8} align="stretch">
          <Card>
            <CardBody>
              <VStack spacing={6}>
                <Heading size="lg">Current Question</Heading>
                {currentQuestion ? (
                  <>
                    <Text fontSize="xl">{currentQuestion.text}</Text>
                    <Grid templateColumns="repeat(2, 1fr)" gap={4} w="100%">
                      {currentQuestion.options.map((option, index) => (
                        <Button
                          key={index}
                          onClick={() => handleAnswer(index)}
                          size="lg"
                          variant="outline"
                          _hover={{ bg: 'brand.50' }}
                        >
                          {option}
                        </Button>
                      ))}
                    </Grid>
                  </>
                ) : (
                  <Button
                    onClick={() => setCurrentQuestion(mockQuestion)}
                    colorScheme="brand"
                    size="lg"
                  >
                    Start New Question
                  </Button>
                )}
              </VStack>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <VStack spacing={4}>
                <Heading size="md">Achievements</Heading>
                <HStack spacing={4}>
                  <Badge colorScheme="purple" p={2}>
                    <FaMedal /> Quick Learner
                  </Badge>
                  <Badge colorScheme="blue" p={2}>
                    <FaStar /> Perfect Score
                  </Badge>
                  <Badge colorScheme="green" p={2}>
                    <FaTrophy /> Level Master
                  </Badge>
                </HStack>
              </VStack>
            </CardBody>
          </Card>
        </VStack>
      </Grid>
    </Container>
  )
}

export default StudentDashboard 