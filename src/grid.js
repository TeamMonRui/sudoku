// Funciones generales para la grilla
const fnGrid = {
  // simbolos usados para denotar celda vacia
  EMPTY_SYMBOL: " ",
  EMPTY_SYMBOL2: "0",

  //string con todos los simbolos validos
  VALID_SYMBOLS: "123456789",
  
  //Coloca el valor de una celda en la matriz de la grilla
  //regresa una copia de la grilla
  setValue: (grid, row, col, value) => grid.setIn(['matrix', row, col], value),

  //Regresa el bloque que contenga una celda dada
  getBlock: (grid, row, col) => {
    const blockLength = fnGrid.getBlockLen(grid)
    const rowOffset = row - (row % blockLength)
    const colOffset = col - (col % blockLength)
    return fnMatrix.submatrix(grid.get("matrix"), rowOffset, colOffset, blockLength, blockLength)
  },

  //Regresa el numero de bloques
  getBlockLen: grid => Math.floor(Math.sqrt(grid.get("matrix").count())),

  //Regresa true si es una solucion valida
  validate: grid => fnGrid.checkSymbols(grid) && fnGrid.checkRowsUnique(grid) && fnGrid.checkColsUnique(grid) && fnGrid.checkBlockUnique(grid),

  //regresa true si contiene simbolos validos
  checkSymbols: grid => grid.get("matrix").every(row => row.every(v => grid.get("symbols").has(v))),

  //regresa true si hay filas unicas
  checkRowsUnique: grid => grid.get("matrix").every(row => row.sort().every((v, i, list) => i!=0 ? v!=list.get(i-1) : true)),

  //regresa true si hay columnas rapidas
  checkColsUnique: grid => fnGrid.checkRowsUnique(grid.set("matrix", fnMatrix.transpose(grid.get("matrix")))),

  //regresa true si hay bloques unicos
  checkBlockUnique: (grid, allowEmpty=false, emptyVal=fnGrid.EMPTY_SYMBOL) => {
    const _checkBlocksUnique = (row, col, matrix, blockLength) => {
      if (row >= matrix.count()) return true
      else if (!_checkCellsUnique(0, 0, fnMatrix.submatrix(matrix, row, col, blockLength, blockLength), Immutable.Set())) return false
      else {
        const nextRow = col+blockLength >= matrix.count() ? row+blockLength : row
        const nextCol = col+blockLength >= matrix.count() ? 0 : col+blockLength
        return _checkBlocksUnique(nextRow, nextCol, matrix, blockLength)
      }
    }
    const _checkCellsUnique = (row, col, block, valueSet) => {
      if (row >= block.count()) return true
      const value = block.get(row).get(col)
      if (value==fnGrid.EMPTY_SYMBOL || valueSet.has(value)) return false
      else {
        const nextRow = col+1 >= block.count() ? row+1 : row
        const nextCol = col+1 >= block.count() ? 0 : col+1
        return _checkCellsUnique(nextRow, nextCol, block, allowEmpty && value==emptyVal ? valueSet :valueSet.add(value))
      }
    }

    if(Immutable.Map.isMap(grid)) return _checkBlocksUnique(0, 0, grid.get("matrix"), fnGrid.getBlockLen(grid))

    else return _checkBlocksUnique(0, 0, grid, fnGrid.getBlockLen(Immutable.Map({matrix:grid})))
  },

  //regresa una representacion en string de la grilla
  exportString: grid => grid.get("symbols").join(fnGrid.EMPTY_SYMBOL) + "\n" + fnMatrix.toString(grid.get("matrix")),
  
  //regresa un objeto grilla en base a un string
  importString: (str, symbolSep=fnGrid.EMPTY_SYMBOL, rowValueSep=",") => {
    const data = str.split("\n")
    const grid = Immutable.Map({
      symbols: Immutable.Set(data[0].split(symbolSep)),
      matrix: Immutable.List(data.slice(1).map(row => Immutable.List(row.split(rowValueSep)))),
    })
    return grid.set("isComplete", fnGrid.validate(grid))
  },

  //regresa true si cumple con las condiciones de ingreso
  strIsValid2: str => {
    const rowsAreUnique = data => data.every(row => row.every((c, i, arr) => c=="0" || (c!="0" && arr.indexOf(c)==i)))
    const colsAreUnique = data => rowsAreUnique(fnMatrix.transpose(Immutable.fromJS(data)).toJS())
    const blocksAreUnique = data => fnGrid.checkBlockUnique(Immutable.fromJS(data), true, "0")
    const allSymbolsAreValid = data => data
      .reduce((acc, row) => acc.concat(row), []) 
      .every(v => validSymbols.indexOf(v)>=0) 
    const VALID_SYMBOLS = (fnGrid.EMPTY_SYMBOL2 + fnGrid.VALID_SYMBOLS).split("") 
    const validSizes = [2,3,4,5].map(n => n*n)
    const data = str.toUpperCase().split("\n").map(row => row.split(""))

    const validSymbols = VALID_SYMBOLS.slice(0, data.length+1) 
    if(!data.every(row => row.length==data[0].length)) return 0 
    else if(data.length != data[0].length) return -1 
    else if(!validSizes.some(s => s==data.length)) return -2
    else if(!allSymbolsAreValid(data)) return -3
    else if(!rowsAreUnique(data)) return -4 
    else if(!colsAreUnique(data)) return -5 
    else if(!blocksAreUnique(data)) return -6 
    else return 1 
  },

  //regresa true si cumple con las condiciones de ingreso
  importString2: str => {
    const validSymbols = Immutable.List(fnGrid.VALID_SYMBOLS.split(""))
    const data = str.toUpperCase().split("\n")
    const grid = Immutable.Map({
      symbols: validSymbols.slice(0, data[0].length).toSet(),
      matrix: Immutable.List(data.map(row => Immutable.List(row.replace(/0/g, fnGrid.EMPTY_SYMBOL).split("")))),
    })
    return grid.set("isComplete", fnGrid.validate(grid))
  },

  //regresa la representacion del puzzle en una matriz
  exportString2: grid => grid.get("matrix").map(row => row.join("").replace(/\s/g, fnGrid.EMPTY_SYMBOL2)).reduce((str, row) => str + "\n" + row),
}
