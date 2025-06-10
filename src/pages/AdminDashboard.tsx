import { useState } from 'react'
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
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  useToast,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { useAuthStore } from '../stores/authStore'

interface Student {
  id: string
  name: string
  score: number
  level: number
  completedLectures: number
}

interface Question {
  id: string
  text: string
  difficulty: 'easy' | 'medium' | 'hard'
  lectureId: string
  status: 'pending' | 'approved' | 'rejected'
}

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState(0)
  const toast = useToast()
  const user = useAuthStore((state) => state.user)

  // Mock data for demonstration
  const mockStudents: Student[] = [
    { id: '1', name: 'John Doe', score: 450, level: 9, completedLectures: 15 },
    { id: '2', name: 'Jane Smith', score: 380, level: 8, completedLectures: 12 },
    { id: '3', name: 'Mike Johnson', score: 290, level: 6, completedLectures: 10 },
  ]

  const mockQuestions: Question[] = [
    {
      id: '1',
      text: 'What is the capital of France?',
      difficulty: 'easy',
      lectureId: 'L1',
      status: 'pending',
    },
    {
      id: '2',
      text: 'Explain the concept of recursion',
      difficulty: 'hard',
      lectureId: 'L2',
      status: 'approved',
    },
  ]

  const mockChartData = [
    { name: 'Week 1', students: 65 },
    { name: 'Week 2', students: 75 },
    { name: 'Week 3', students: 85 },
    { name: 'Week 4', students: 95 },
  ]

  const handleQuestionAction = (questionId: string, action: 'approve' | 'reject') => {
    toast({
      title: `Question ${action}d`,
      description: `Question ${questionId} has been ${action}d`,
      status: 'success',
      duration: 2000,
    })
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Heading>Admin Dashboard</Heading>

        <Tabs onChange={(index) => setActiveTab(index)}>
          <TabList>
            <Tab>Overview</Tab>
            <Tab>Questions</Tab>
            <Tab>Students</Tab>
          </TabList>

          <TabPanels>
            {/* Overview Panel */}
            <TabPanel>
              <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={6}>
                <Card>
                  <CardBody>
                    <VStack align="start">
                      <Text color="gray.500">Total Students</Text>
                      <Heading size="xl">{mockStudents.length}</Heading>
                    </VStack>
                  </CardBody>
                </Card>
                <Card>
                  <CardBody>
                    <VStack align="start">
                      <Text color="gray.500">Active Questions</Text>
                      <Heading size="xl">
                        {mockQuestions.filter((q) => q.status === 'approved').length}
                      </Heading>
                    </VStack>
                  </CardBody>
                </Card>
                <Card>
                  <CardBody>
                    <VStack align="start">
                      <Text color="gray.500">Pending Questions</Text>
                      <Heading size="xl">
                        {mockQuestions.filter((q) => q.status === 'pending').length}
                      </Heading>
                    </VStack>
                  </CardBody>
                </Card>
              </Grid>

              <Card mt={8}>
                <CardBody>
                  <Heading size="md" mb={4}>
                    Student Progress
                  </Heading>
                  <Box h="300px">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={mockChartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="students" fill="#3182CE" />
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                </CardBody>
              </Card>
            </TabPanel>

            {/* Questions Panel */}
            <TabPanel>
              <Card>
                <CardBody>
                  <Table>
                    <Thead>
                      <Tr>
                        <Th>Question</Th>
                        <Th>Difficulty</Th>
                        <Th>Lecture</Th>
                        <Th>Status</Th>
                        <Th>Actions</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {mockQuestions.map((question) => (
                        <Tr key={question.id}>
                          <Td>{question.text}</Td>
                          <Td>
                            <Badge
                              colorScheme={
                                question.difficulty === 'easy'
                                  ? 'green'
                                  : question.difficulty === 'medium'
                                  ? 'yellow'
                                  : 'red'
                              }
                            >
                              {question.difficulty}
                            </Badge>
                          </Td>
                          <Td>{question.lectureId}</Td>
                          <Td>
                            <Badge
                              colorScheme={
                                question.status === 'approved'
                                  ? 'green'
                                  : question.status === 'rejected'
                                  ? 'red'
                                  : 'yellow'
                              }
                            >
                              {question.status}
                            </Badge>
                          </Td>
                          <Td>
                            <HStack spacing={2}>
                              <Button
                                size="sm"
                                colorScheme="green"
                                onClick={() => handleQuestionAction(question.id, 'approve')}
                              >
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                colorScheme="red"
                                onClick={() => handleQuestionAction(question.id, 'reject')}
                              >
                                Reject
                              </Button>
                            </HStack>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </CardBody>
              </Card>
            </TabPanel>

            {/* Students Panel */}
            <TabPanel>
              <Card>
                <CardBody>
                  <Table>
                    <Thead>
                      <Tr>
                        <Th>Name</Th>
                        <Th>Level</Th>
                        <Th>Score</Th>
                        <Th>Completed Lectures</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {mockStudents.map((student) => (
                        <Tr key={student.id}>
                          <Td>{student.name}</Td>
                          <Td>
                            <Badge colorScheme="green">Level {student.level}</Badge>
                          </Td>
                          <Td>{student.score}</Td>
                          <Td>{student.completedLectures}</Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </CardBody>
              </Card>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </Container>
  )
}

export default AdminDashboard 