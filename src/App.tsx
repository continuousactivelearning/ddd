import { Routes, Route, Link } from 'react-router-dom'
import { Box, Container, Grid, Heading, Text, VStack, ChakraProvider } from '@chakra-ui/react'
import StudentDashboard from './student/StudentDashboard'
import AdminDashboard from './admin/AdminDashboard'

function App() {
  return (
    <ChakraProvider>
      <Container maxW="container.xl" py={8}>
        <Routes>
          <Route path="/" element={
            <VStack spacing={8} align="stretch">
              <Heading textAlign="center">Learning Dashboard</Heading>
              <Text textAlign="center" color="gray.600">
                Select a dashboard to view:
              </Text>
              
              <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={8}>
                <Link to="/student" style={{ textDecoration: 'none' }}>
                  <Box
                    p={6}
                    borderWidth="1px"
                    borderRadius="lg"
                    _hover={{ shadow: 'lg', transform: 'translateY(-2px)' }}
                    transition="all 0.2s"
                  >
                    <VStack spacing={4}>
                      <Heading size="md">Student Dashboard</Heading>
                      <Text>View your lecture progress and questions</Text>
                    </VStack>
                  </Box>
                </Link>

                <Link to="/admin" style={{ textDecoration: 'none' }}>
                  <Box
                    p={6}
                    borderWidth="1px"
                    borderRadius="lg"
                    _hover={{ shadow: 'lg', transform: 'translateY(-2px)' }}
                    transition="all 0.2s"
                  >
                    <VStack spacing={4}>
                      <Heading size="md">Admin Dashboard</Heading>
                      <Text>Manage lectures and questions</Text>
                    </VStack>
                  </Box>
                </Link>
              </Grid>
            </VStack>
          } />
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </Container>
    </ChakraProvider>
  )
}

export default App 