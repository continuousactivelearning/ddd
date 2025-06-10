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
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
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
} from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { FaSearch, FaUsers, FaBook, FaQuestionCircle, FaChartLine, FaEdit, FaTrash } from 'react-icons/fa'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

const MotionBox = motion(Box)

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState(0)
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  // Mock data for charts
  const studentProgressData = [
    { name: 'Week 1', students: 65 },
    { name: 'Week 2', students: 75 },
    { name: 'Week 3', students: 85 },
    { name: 'Week 4', students: 95 },
  ]

  const questionDistributionData = [
    { name: 'Easy', value: 40 },
    { name: 'Medium', value: 35 },
    { name: 'Hard', value: 25 },
  ]

  const COLORS = ['#48BB78', '#ECC94B', '#F56565']

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        {/* Header Section */}
        <Flex justify="space-between" align="center">
          <VStack align="start" spacing={2}>
            <Heading size="lg">Admin Dashboard</Heading>
            <Text color="gray.600">Manage your learning platform</Text>
          </VStack>
          <InputGroup maxW="300px">
            <InputLeftElement pointerEvents="none">
              <Icon as={FaSearch} color="gray.400" />
            </InputLeftElement>
            <Input placeholder="Search..." />
          </InputGroup>
        </Flex>

        {/* Stats Overview */}
        <Grid templateColumns={{ base: '1fr', md: 'repeat(4, 1fr)' }} gap={6}>
          <MotionBox
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <Card bg={bgColor} borderColor={borderColor} borderWidth="1px">
              <CardBody>
                <Stat>
                  <StatLabel>Total Students</StatLabel>
                  <StatNumber>150</StatNumber>
                  <StatHelpText>
                    <Icon as={FaUsers} color="blue.500" /> +12 this week
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>
          </MotionBox>

          <MotionBox
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <Card bg={bgColor} borderColor={borderColor} borderWidth="1px">
              <CardBody>
                <Stat>
                  <StatLabel>Active Lectures</StatLabel>
                  <StatNumber>12</StatNumber>
                  <StatHelpText>
                    <Icon as={FaBook} color="green.500" /> 3 new this month
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>
          </MotionBox>

          <MotionBox
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <Card bg={bgColor} borderColor={borderColor} borderWidth="1px">
              <CardBody>
                <Stat>
                  <StatLabel>Total Questions</StatLabel>
                  <StatNumber>85</StatNumber>
                  <StatHelpText>
                    <Icon as={FaQuestionCircle} color="purple.500" /> 15 pending review
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>
          </MotionBox>

          <MotionBox
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <Card bg={bgColor} borderColor={borderColor} borderWidth="1px">
              <CardBody>
                <Stat>
                  <StatLabel>Average Score</StatLabel>
                  <StatNumber>78%</StatNumber>
                  <StatHelpText>
                    <Icon as={FaChartLine} color="yellow.500" /> +5% this week
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>
          </MotionBox>
        </Grid>

        {/* Charts Section */}
        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6}>
          <Card bg={bgColor} borderColor={borderColor} borderWidth="1px">
            <CardBody>
              <VStack align="start" spacing={4}>
                <Heading size="md">Student Progress</Heading>
                <Box w="100%" h="300px">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={studentProgressData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="students" fill="#3182CE" />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </VStack>
            </CardBody>
          </Card>

          <Card bg={bgColor} borderColor={borderColor} borderWidth="1px">
            <CardBody>
              <VStack align="start" spacing={4}>
                <Heading size="md">Question Distribution</Heading>
                <Box w="100%" h="300px">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={questionDistributionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {questionDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </VStack>
            </CardBody>
          </Card>
        </Grid>

        {/* Tabs Section */}
        <Card bg={bgColor} borderColor={borderColor} borderWidth="1px">
          <CardBody>
            <Tabs onChange={(index) => setActiveTab(index)}>
              <TabList>
                <Tab>Lectures</Tab>
                <Tab>Questions</Tab>
                <Tab>Students</Tab>
              </TabList>

              <TabPanels>
                {/* Lectures Panel */}
                <TabPanel>
                  <Table>
                    <Thead>
                      <Tr>
                        <Th>Title</Th>
                        <Th>Status</Th>
                        <Th>Students</Th>
                        <Th>Questions</Th>
                        <Th>Actions</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      <Tr>
                        <Td>Introduction to ML</Td>
                        <Td>
                          <Badge colorScheme="green">Active</Badge>
                        </Td>
                        <Td>45</Td>
                        <Td>8</Td>
                        <Td>
                          <HStack spacing={2}>
                            <Button size="sm" leftIcon={<FaEdit />}>
                              Edit
                            </Button>
                            <Button size="sm" colorScheme="red" leftIcon={<FaTrash />}>
                              Delete
                            </Button>
                          </HStack>
                        </Td>
                      </Tr>
                      <Tr>
                        <Td>Neural Networks</Td>
                        <Td>
                          <Badge colorScheme="yellow">Draft</Badge>
                        </Td>
                        <Td>0</Td>
                        <Td>5</Td>
                        <Td>
                          <HStack spacing={2}>
                            <Button size="sm" leftIcon={<FaEdit />}>
                              Edit
                            </Button>
                            <Button size="sm" colorScheme="red" leftIcon={<FaTrash />}>
                              Delete
                            </Button>
                          </HStack>
                        </Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </TabPanel>

                {/* Questions Panel */}
                <TabPanel>
                  <Table>
                    <Thead>
                      <Tr>
                        <Th>Question</Th>
                        <Th>Lecture</Th>
                        <Th>Difficulty</Th>
                        <Th>Status</Th>
                        <Th>Actions</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      <Tr>
                        <Td>What is supervised learning?</Td>
                        <Td>Introduction to ML</Td>
                        <Td>
                          <Badge colorScheme="green">Easy</Badge>
                        </Td>
                        <Td>
                          <Badge colorScheme="blue">Active</Badge>
                        </Td>
                        <Td>
                          <HStack spacing={2}>
                            <Button size="sm" leftIcon={<FaEdit />}>
                              Edit
                            </Button>
                            <Button size="sm" colorScheme="red" leftIcon={<FaTrash />}>
                              Delete
                            </Button>
                          </HStack>
                        </Td>
                      </Tr>
                      <Tr>
                        <Td>Explain backpropagation</Td>
                        <Td>Neural Networks</Td>
                        <Td>
                          <Badge colorScheme="red">Hard</Badge>
                        </Td>
                        <Td>
                          <Badge colorScheme="yellow">Review</Badge>
                        </Td>
                        <Td>
                          <HStack spacing={2}>
                            <Button size="sm" leftIcon={<FaEdit />}>
                              Edit
                            </Button>
                            <Button size="sm" colorScheme="red" leftIcon={<FaTrash />}>
                              Delete
                            </Button>
                          </HStack>
                        </Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </TabPanel>

                {/* Students Panel */}
                <TabPanel>
                  <Table>
                    <Thead>
                      <Tr>
                        <Th>Name</Th>
                        <Th>Progress</Th>
                        <Th>Score</Th>
                        <Th>Status</Th>
                        <Th>Actions</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      <Tr>
                        <Td>John Doe</Td>
                        <Td>75%</Td>
                        <Td>85%</Td>
                        <Td>
                          <Badge colorScheme="green">Active</Badge>
                        </Td>
                        <Td>
                          <Button size="sm" leftIcon={<FaEdit />}>
                            View Details
                          </Button>
                        </Td>
                      </Tr>
                      <Tr>
                        <Td>Jane Smith</Td>
                        <Td>60%</Td>
                        <Td>78%</Td>
                        <Td>
                          <Badge colorScheme="green">Active</Badge>
                        </Td>
                        <Td>
                          <Button size="sm" leftIcon={<FaEdit />}>
                            View Details
                          </Button>
                        </Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </CardBody>
        </Card>
      </VStack>
    </Container>
  )
}

export default AdminDashboard 