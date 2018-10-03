// const board = [
//   [0, 0, 2, 0, 0, 2, 0],
//   [3, 0, 3, 0, 2, 0, 0],
//   [0, 0, 3, 1, 0, 1, 0],
//   [0, 1, 2, 0, 1, 0, 0]
// ]
let board = [
  [0, 1, 2, 1, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0]
]
// const board = [[0, 0], [0, 1], [0, 1]]
let aggregatedGuess = JSON.parse(JSON.stringify(board))

//let aggregatedGuess = [['', '', ''], ['', '', ''], ['', '', '']]
let mineCount = 0

const check = () => {
  let boardMineCount = 0
  for (let row = 0; row < board.length; row++) {
    let line = board[row]
    for (let col = 0; col < line.length; col++) {
      let field = line[col]
      if (board[row][col] === true) {
        boardMineCount++
      }
      if (field !== true && field > 0) {
        let fieldMineCount = 0
        if (isMine(row - 1, col - 1)) fieldMineCount++
        if (isMine(row - 1, col)) fieldMineCount++
        if (isMine(row - 1, col + 1)) fieldMineCount++
        if (isMine(row, col - 1)) fieldMineCount++
        if (isMine(row, col + 1)) fieldMineCount++
        if (isMine(row + 1, col - 1)) fieldMineCount++
        if (isMine(row + 1, col)) fieldMineCount++
        if (isMine(row + 1, col + 1)) fieldMineCount++
        if (field != fieldMineCount) return false
      }
    }
  }
  return mineCount == 0 || mineCount == boardMineCount
}

const isMine = (row, col) => {
  if (row < 0 || row >= board.length) return false
  if (col < 0 || col >= board[0].length) return false
  if (board[row][col] === true) return true
  return false
}

const updateGuesses = () => {
  for (let row = 0; row < board.length; row++) {
    let line = board[row]
    for (let col = 0; col < line.length; col++) {
      if (line[col] === true) aggregatedGuess[row][col] = true
    }
  }
}
const guess = () => {
  aggregatedGuess = JSON.parse(JSON.stringify(board))
  guessRecursive(0, 0)
  console.table(aggregatedGuess)
}

const guessRecursive = (row, col) => {
  let line = board[row]
  if (row == board.length) {
    if (check()) updateGuesses()
    return
  }
  if (col == line.length - 1) guessRecursive(row + 1, 0)
  else guessRecursive(row, col + 1)
  if (board[row][col] == false) {
    board[row][col] = true
    if (col == line.length - 1) guessRecursive(row + 1, 0)
    else guessRecursive(row, col + 1)
  }
  if (board[row][col] === true) board[row][col] = false
}

//guess()
const constructBoard = () => {
  const clicked = event => {
    let id = event.srcElement.id
    if (id && id.indexOf('_') > 0) {
      let row = parseInt(id.split('_')[0])
      let col = parseInt(id.split('_')[1])

      event.shiftKey ? board[row][col]-- : board[row][col]++
    }
    drawBoard()
  }
  const boardElement = document.getElementById('board')

  boardElement.innerHTML = ''

  boardElement.addEventListener('click', clicked)
  drawBoard()

  const buttonElement = document.getElementById('button')
  buttonElement.addEventListener('click', event => {
    event.preventDefault()
    let maxCellsElement = document.getElementById('maxCells')
    mineCount = maxCellsElement.value
    console.log(mineCount)
    guess()
    let cellElement
    aggregatedGuess.forEach((row, i) => {
      row.forEach((cell, j) => {
        cellElement = document.getElementById(`${i}_${j}`)
        cellElement.classList.remove('safe')
        if (cell === false || cell === 0) {
          cellElement.classList.add('safe')
        }
      })
    })
  })
}

const drawBoard = () => {
  const boardElement = document.getElementById('board')
  boardElement.innerHTML = ''
  board.forEach((line, i) => {
    line.forEach((cell, j) => {
      let cellElement = document.createElement('div')
      cellElement.setAttribute('id', `${i}_${j}`)
      if (cell) cellElement.innerText = cell
      else cellElement.innerText = '.'
      cellElement.classList.add('cell')
      boardElement.appendChild(cellElement)
    })
    boardElement.appendChild(document.createElement('br'))
  })
}

const initElement = document.getElementById('initButton')
initElement.addEventListener('click', event => {
  event.preventDefault()
  let rows = document.getElementById('rows').value
  let cols = document.getElementById('cols').value
  if (rows <= 0) rows = 5
  if (cols <= 0) cols = 5
  board = []
  for (let i = 0; i < rows; i++) {
    board.push([])
    for (let j = 0; j < cols; j++) {
      board[i].push(0)
    }
  }
  drawBoard()
})
constructBoard()
