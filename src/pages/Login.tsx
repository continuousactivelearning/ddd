import { useState } from 'react'
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  useToast,
  Container,
  Card,
  CardBody,
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const toast = useToast()
  const login = useAuthStore((state) => state.login)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // TODO: Replace with actual API call
      // This is a mock login for demonstration
      const mockUser = {
        id: '1',
        name: 'Test User',
        email: email,
        role: email.includes('admin') ? 'admin' : 'student',
      }

      login(mockUser)
      toast({
        title: 'Login successful!',
        status: 'success',
        duration: 3000,
      })
      navigate(mockUser.role === 'admin' ? '/admin' : '/student')
    } catch (error) {
      toast({
        title: 'Login failed',
        description: 'Please check your credentials and try again.',
        status: 'error',
        duration: 3000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Container maxW="container.sm" py={10}>
      <Card>
        <CardBody>
          <VStack spacing={8}>
            <Heading>Welcome Back!</Heading>
            <Text color="gray.600">Sign in to continue your learning journey</Text>
            <Box as="form" w="100%" onSubmit={handleSubmit}>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Password</FormLabel>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                  />
                </FormControl>
                <Button
                  type="submit"
                  colorScheme="brand"
                  size="lg"
                  w="100%"
                  isLoading={isLoading}
                >
                  Sign In
                </Button>
              </VStack>
            </Box>
          </VStack>
        </CardBody>
      </Card>
    </Container>
  )
}

export default Login 