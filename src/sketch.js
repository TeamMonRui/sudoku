const sketch = ( p ) => {
  const DFS = "depthfs"
  const BFS = "breadthfs"

  let input_grid = fnGrid.importString(fnStrings.input)
  let data = null
  const dataMap = Immutable.Map()
    .set(DFS, basicSearch.mkDataMap)
    .set(BFS, basicSearch.mkDataMap)

  let runSolve = false
  let nSteps = 0

  const solveStepMap = Immutable.Map()
    .set(DFS, basicSearch.solveStep(false))
    .set(BFS, basicSearch.solveStep(true))

  const isFinishedMap = Immutable.Map()
    .set(DFS, basicSearch.isFinished)
    .set(BFS, basicSearch.isFinished)

  const customPuzzleParseErrorMap = Immutable.Map()
    .set(1, "")
    .set(0, "Las filas no son del mismo tamaño.")
    .set(-1, "El sudoku introducido no es cuadrado.")
    .set(-2, "Es un tamaño no valido.")
    .set(-3, "Uno o más caracteres no son validos.")
    .set(-4, "Hay filas duplicadas.")
    .set(-5, "Hay columnas duplicadas.")
    .set(-6, "Hay caracteres duplicados en los bloques.")

  let canvas = null

  let stepCounter = null
  let stepBtn = null
  let solveBtn = null
  let pauseBtn = null
  let resetBtn = null
  let solverSelect = null

  let parsePuzzleBtn = null
  let parsePuzzleErrorMsg = null
  let insertExample4x4Btn = null
  let insertExample9x9Btn = null

  const setNSteps = n => {
    nSteps = n
    stepCounter.html(nSteps)
  }

  const mkDataMap = grid => {
    setNSteps(0)
    return dataMap.get(solverSelect.value())(grid)
  }
  // Obtiene el solucionador especifico en base a lo seleccionado
  const solveStep = data => {
    const newData = solveStepMap.get(solverSelect.value())(data)
    if (isFinished(newData)) {
      runSolve = false
    } else {
      setNSteps(nSteps+1)
    }
    return newData
  }
  const isFinished = data => isFinishedMap.get(solverSelect.value())(data)

  const initBtn = (label, parent, callback) => initInteractive(p.createButton(label), parent, callback)

  const initInteractive = (obj, parent, callback) => {
    obj.parent(parent)
    obj.mousePressed(callback)
    return obj
  }

  const initCanvas = () => {
    canvas = p.createCanvas(400, 400)
    canvas.parent("#cv")
  }

  // Sección de configuración inicial
  p.setup = () => {
    const initPlaybackControl = () => {
      stepCounter = p.createSpan("0")
      stepCounter.parent("#stepCount")
      stepBtn = initBtn("Siguiente", "#playbackBtns", () => data = solveStep(data))
      solveBtn = initBtn("Resolver", "#playbackBtns", () => runSolve = true)
      pauseBtn = initBtn("Pausar", "#playbackBtns", () => runSolve = false)
      resetBtn = initBtn("Reiniciar", "#playbackBtns", () => data = mkDataMap(input_grid))
    }

    const initSolverSelect = () => {
      solverSelect = p.createSelect()
      solverSelect.style('font-size', '13px')
      solverSelect.parent("#solverSelect")
      solverSelect.option("Depth First", DFS)
      solverSelect.option("Breadth First", BFS)
      solverSelect.value(DFS)
      solverSelect.changed(() => data = mkDataMap(input_grid))
    }

    const initCustomInputArea = () => {
      parsePuzzleBtn = initBtn("Cambiar", "#customPuzzleBtns", () => {
        const str = customInput.value()
        const validity = fnGrid.strIsValid2(str)
        parsePuzzleErrorMsg.html(customPuzzleParseErrorMap.get(validity))
        if (validity==1) {
          input_grid = fnGrid.importString2(str)
          data = mkDataMap(input_grid)
        }
      })
      parsePuzzleErrorMsg = p.createSpan("")
      parsePuzzleErrorMsg.parent("#customPuzzleBtns")
      parsePuzzleErrorMsg.style('font-size', '12px')
      parsePuzzleErrorMsg.style("padding-left", "1em")

      customInput = p.createElement('textarea')
      customInput.parent("#customInputArea")
      customInput.attribute("rows", 10)
      customInput.attribute("cols", 50)

      insertExample4x4Btn = initBtn("Ejemplo de 4x4", "#insertExampleBtns", () => {
        customInput.value(fnStrings.example4)
      })
      insertExample9x9Btn = initBtn("Ejemplo de 9x9", "#insertExampleBtns", () => {
        customInput.value(fnStrings.example9)
      })
    }

    initCanvas()
    initPlaybackControl()
    initSolverSelect()
    initCustomInputArea()

    data = mkDataMap(input_grid)
  }

  // Bucle de ejecución principal
  p.draw = () => {
    p.background(240)
    p5Grid.draw(p, data.get("grid"), 0, 0, 400, 400)
    if (runSolve) { 
      data = solveStep(data)
    }
  }
}

const p5Grid = {
  draw: (p, grid, x, y, w, h) => {
    const matrix = grid.get("matrix")
    const nCols = matrix.get(0).count()
    const nRows = matrix.count()
    
    const cellW = w/nCols
    const cellH = h/nRows
    matrix.map((row, j) => row.map((v, i) => p5Grid.drawCell(p, v, x+i*cellW, y+j*cellH, cellW, cellH)))
    
    const blockLen = fnGrid.getBlockLen(grid)
    const blockW = blockLen * cellW
    const blockH = blockLen * cellH
    
    const blockXs = Immutable.Range(x, x+w, blockW)
    const blockYs = Immutable.Range(y, y+h, blockH)
    blockYs.forEach(by => blockXs.forEach(bx => p5Grid.drawBlock(p, bx, by, blockW, blockH)))
  },

  drawCell: (p, v, x, y, w, h) => {
    p.noFill()
    p.stroke(0)
    p.strokeWeight(1)
    p.rect(x, y, w, h)
 
    p.fill(0)
    p.textAlign(p.CENTER, p.CENTER)
    p.textSize(16);
    p.text(v, x+w/2, y+h/2)
  },

  
  drawBlock: (p, x, y, w, h) => {
    p.noFill()
    p.stroke(0)
    p.strokeWeight(4)
    p.rect(x, y, w, h)
  }
}

let p5Instance = new p5(sketch);
