import { useState, useEffect } from 'react'
import {
  Box,
  Grid,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Card,
  CardBody,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { FaPlay, FaStepForward, FaCrown, FaStar, FaRedo } from 'react-icons/fa'
import { Icon } from '@chakra-ui/react'

const MotionBox = motion(Box)
const MotionCard = motion(Card)

// 8 Queens Game
const EightQueens = () => {
  const [board, setBoard] = useState(Array(8).fill().map(() => Array(8).fill(0)))
  const [solutions, setSolutions] = useState([])
  const [currentSolution, setCurrentSolution] = useState(0)
  const [isWrong, setIsWrong] = useState(false)
  const [queensPlaced, setQueensPlaced] = useState(0)
  const toast = useToast()

  const isValid = (board, row, col) => {
    // Check row
    for (let i = 0; i < col; i++) {
      if (board[row][i]) return false
    }

    // Check upper diagonal
    for (let i = row, j = col; i >= 0 && j >= 0; i--, j--) {
      if (board[i][j]) return false
    }

    // Check lower diagonal
    for (let i = row, j = col; i < 8 && j >= 0; i++, j--) {
      if (board[i][j]) return false
    }

    return true
  }

  const solveNQueens = (board, col = 0) => {
    if (col >= 8) {
      setSolutions([...solutions, JSON.parse(JSON.stringify(board))])
      return
    }

    for (let i = 0; i < 8; i++) {
      if (isValid(board, i, col)) {
        board[i][col] = 1
        solveNQueens(board, col + 1)
        board[i][col] = 0
      }
    }
  }

  const handleSolve = () => {
    setSolutions([])
    const newBoard = Array(8).fill().map(() => Array(8).fill(0))
    solveNQueens(newBoard)
    if (solutions.length > 0) {
      setBoard(solutions[0])
      toast({
        title: 'Solution found!',
        description: `Found ${solutions.length} solutions`,
        status: 'success',
        duration: 3000,
      })
    } else {
      setIsWrong(true)
      toast({
        title: 'No solution found',
        description: 'Try a different arrangement',
        status: 'error',
        duration: 3000,
      })
      setTimeout(() => setIsWrong(false), 1000)
    }
  }

  const handleNextSolution = () => {
    if (currentSolution < solutions.length - 1) {
      setCurrentSolution(currentSolution + 1)
      setBoard(solutions[currentSolution + 1])
    }
  }

  const handleCellClick = (row, col) => {
    if (queensPlaced >= 8) {
      toast({
        title: 'Maximum queens placed',
        description: 'You can only place 8 queens',
        status: 'warning',
        duration: 2000,
      })
      return
    }

    const newBoard = JSON.parse(JSON.stringify(board))
    if (newBoard[row][col] === 0) {
      newBoard[row][col] = 1
      setQueensPlaced(queensPlaced + 1)
    } else {
      newBoard[row][col] = 0
      setQueensPlaced(queensPlaced - 1)
    }
    setBoard(newBoard)
  }

  return (
    <VStack spacing={4}>
      <Heading size="md">8 Queens Puzzle</Heading>
      <Text>Click on cells to place queens. Place 8 queens so that no queen can attack another</Text>
      <Text color="blue.500" fontWeight="bold">
        Queens placed: {queensPlaced}/8
      </Text>
      <Box
        p={4}
        borderRadius="lg"
        bg={isWrong ? 'red.50' : 'white'}
        transition="all 0.3s ease"
        boxShadow="xl"
        _hover={{ boxShadow: '2xl' }}
      >
        <Grid templateColumns="repeat(8, 1fr)" gap={1}>
          {board.map((row, i) =>
            row.map((cell, j) => (
              <MotionBox
                key={`${i}-${j}`}
                w="40px"
                h="40px"
                bg={cell ? 'blue.500' : (i + j) % 2 === 0 ? 'gray.100' : 'gray.300'}
                borderRadius="md"
                whileHover={{ scale: 1.1 }}
                transition="all 0.2s"
                boxShadow="md"
                _hover={{ boxShadow: 'lg' }}
                cursor="pointer"
                onClick={() => handleCellClick(i, j)}
              />
            ))
          )}
        </Grid>
      </Box>
      <HStack>
        <Button
          onClick={handleSolve}
          colorScheme="blue"
          leftIcon={<FaPlay />}
          boxShadow="md"
          _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
          transition="all 0.2s"
        >
          Check Solution
        </Button>
        <Button
          onClick={() => {
            setBoard(Array(8).fill().map(() => Array(8).fill(0)))
            setQueensPlaced(0)
          }}
          colorScheme="red"
          leftIcon={<FaRedo />}
          boxShadow="md"
          _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
          transition="all 0.2s"
        >
          Reset
        </Button>
      </HStack>
    </VStack>
  )
}

// Sudoku Game
const Sudoku = () => {
  // Initial puzzle with some numbers filled in
  const initialPuzzle = [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9],
  ]

  const [board, setBoard] = useState(initialPuzzle)
  const [selectedCell, setSelectedCell] = useState(null)
  const [isWrong, setIsWrong] = useState(false)
  const [isInitial, setIsInitial] = useState(true)
  const toast = useToast()

  const isValid = (board, row, col, num) => {
    // Check row
    for (let i = 0; i < 9; i++) {
      if (board[row][i] === num) return false
    }

    // Check column
    for (let i = 0; i < 9; i++) {
      if (board[i][col] === num) return false
    }

    // Check 3x3 box
    const boxRow = Math.floor(row / 3) * 3
    const boxCol = Math.floor(col / 3) * 3
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[boxRow + i][boxCol + j] === num) return false
      }
    }

    return true
  }

  const solveSudoku = (board) => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === 0) {
          for (let num = 1; num <= 9; num++) {
            if (isValid(board, row, col, num)) {
              board[row][col] = num
              if (solveSudoku(board)) return true
              board[row][col] = 0
            }
          }
          return false
        }
      }
    }
    return true
  }

  const handleCellClick = (row, col) => {
    // Don't allow editing initial numbers
    if (initialPuzzle[row][col] !== 0) {
      toast({
        title: 'Cannot edit',
        description: 'This is an initial number',
        status: 'warning',
        duration: 2000,
      })
      return
    }
    setSelectedCell({ row, col })
  }

  const handleNumberInput = (num) => {
    if (selectedCell) {
      const newBoard = JSON.parse(JSON.stringify(board))
      if (isValid(newBoard, selectedCell.row, selectedCell.col, num)) {
        newBoard[selectedCell.row][selectedCell.col] = num
        setBoard(newBoard)
        setIsWrong(false)
        setIsInitial(false)
      } else {
        setIsWrong(true)
        toast({
          title: 'Invalid number',
          description: 'This number cannot be placed here',
          status: 'error',
          duration: 2000,
        })
        setTimeout(() => setIsWrong(false), 1000)
      }
    }
  }

  const handleSolve = () => {
    const newBoard = JSON.parse(JSON.stringify(board))
    if (solveSudoku(newBoard)) {
      setBoard(newBoard)
      toast({
        title: 'Puzzle solved!',
        status: 'success',
        duration: 3000,
      })
    } else {
      setIsWrong(true)
      toast({
        title: 'No solution exists',
        description: 'Check your current numbers',
        status: 'error',
        duration: 3000,
      })
      setTimeout(() => setIsWrong(false), 1000)
    }
  }

  return (
    <VStack spacing={4}>
      <Heading size="md">Sudoku</Heading>
      <Text>Fill the grid so that every row, column, and 3x3 box contains the digits 1-9</Text>
      <Box
        p={4}
        borderRadius="lg"
        bg={isWrong ? 'red.50' : 'white'}
        transition="all 0.3s ease"
        boxShadow="xl"
        _hover={{ boxShadow: '2xl' }}
      >
        <Grid templateColumns="repeat(9, 1fr)" gap={1}>
          {board.map((row, i) =>
            row.map((cell, j) => (
              <MotionBox
                key={`${i}-${j}`}
                w="40px"
                h="40px"
                bg={selectedCell?.row === i && selectedCell?.col === j ? 'blue.100' : 'white'}
                border="1px solid"
                borderColor="gray.200"
                display="flex"
                alignItems="center"
                justifyContent="center"
                cursor="pointer"
                onClick={() => handleCellClick(i, j)}
                whileHover={{ scale: 1.1 }}
                transition="all 0.2s"
                boxShadow="md"
                _hover={{ boxShadow: 'lg' }}
                fontSize="lg"
                fontWeight={initialPuzzle[i][j] !== 0 ? 'bold' : 'normal'}
                color={initialPuzzle[i][j] !== 0 ? 'blue.600' : 'black'}
              >
                {cell || ''}
              </MotionBox>
            ))
          )}
        </Grid>
      </Box>
      <HStack wrap="wrap" justify="center" spacing={2}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <Button
            key={num}
            onClick={() => handleNumberInput(num)}
            colorScheme="blue"
            variant="outline"
            size="lg"
            boxShadow="md"
            _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
            transition="all 0.2s"
          >
            {num}
          </Button>
        ))}
      </HStack>
      <HStack>
        <Button
          onClick={handleSolve}
          colorScheme="green"
          leftIcon={<FaPlay />}
          size="lg"
          boxShadow="md"
          _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
          transition="all 0.2s"
        >
          Check Solution
        </Button>
        <Button
          onClick={() => {
            setBoard(JSON.parse(JSON.stringify(initialPuzzle)))
            setSelectedCell(null)
            setIsInitial(true)
          }}
          colorScheme="red"
          leftIcon={<FaRedo />}
          size="lg"
          boxShadow="md"
          _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
          transition="all 0.2s"
        >
          Reset
        </Button>
      </HStack>
    </VStack>
  )
}

const EducationalGames = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [selectedGame, setSelectedGame] = useState(null)

  const games = [
    {
      id: '8queens',
      title: '8 Queens Puzzle',
      description: 'Place 8 queens on a chessboard so that no queen can attack another',
      component: EightQueens,
      icon: FaCrown,
      color: 'purple',
    },
    {
      id: 'sudoku',
      title: 'Sudoku',
      description: 'Fill the grid with numbers following Sudoku rules',
      component: Sudoku,
      icon: FaStar,
      color: 'blue',
    },
  ]

  const handleGameSelect = (game) => {
    setSelectedGame(game)
    onOpen()
  }

  return (
    <VStack spacing={8} align="stretch">
      <Heading size="lg">Educational Games</Heading>
      <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6}>
        {games.map((game) => (
          <MotionCard
            key={game.id}
            whileHover={{ scale: 1.02 }}
            transition="all 0.2s"
            cursor="pointer"
            onClick={() => handleGameSelect(game)}
            boxShadow="xl"
            _hover={{ boxShadow: '2xl' }}
          >
            <CardBody>
              <VStack spacing={4}>
                <Icon
                  as={game.icon}
                  boxSize={12}
                  color={`${game.color}.500`}
                  _hover={{ transform: 'scale(1.1)' }}
                  transition="all 0.2s"
                />
                <Heading size="md">{game.title}</Heading>
                <Text>{game.description}</Text>
                <Button
                  colorScheme={game.color}
                  leftIcon={<FaPlay />}
                  boxShadow="md"
                  _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
                  transition="all 0.2s"
                >
                  Play Now
                </Button>
              </VStack>
            </CardBody>
          </MotionCard>
        ))}
      </Grid>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay backdropFilter="blur(10px)" />
        <ModalContent
          boxShadow="2xl"
          borderRadius="xl"
          overflow="hidden"
        >
          <ModalHeader
            bg={`${selectedGame?.color}.500`}
            color="white"
            py={4}
          >
            {selectedGame?.title}
          </ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody p={6}>
            {selectedGame && <selectedGame.component />}
          </ModalBody>
        </ModalContent>
      </Modal>
    </VStack>
  )
}

export default EducationalGames 