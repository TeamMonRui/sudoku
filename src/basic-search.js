const basicSearch = {
  //crea el objeto utilizado por el solucionador
  mkDataMap: grid => Immutable.Map({
    grid: grid,
    moves: Immutable.List([grid]),
  }),


  //regresa el objeto de datos despues de un paso en la solucion
  solveStep: (isBfs) => data => {
    const grid = data.get("grid")
    const moves = data.get("moves")

    if (fnGrid.validate(grid)){ //si es una solucion valida termina la ejecucion
      return data.setIn(["grid","isComplete"], true)
    } 
    else {
      // Otherwise add the moves from current grid and grab the first one in the stack
      const getNext = () => basicSearch.getNext(grid)
      // si el bfs toma el movimiento de al principio de la lista de los contrario lo toma de al final
      const newMoves = isBfs ? moves.shift().concat(getNext()) : moves.pop().concat(getNext())
      return data
        .set("grid", isBfs ? newMoves.first() : newMoves.last())
        .set("moves", newMoves)
    }
  },

  //obtiene la primera celda vacia y regresa una serie de movimientos validos
  getNext: grid => {
    // toma la posicion de la celda vacia
    const {row, col} = basicSearch.getEmptyCell(grid)
    if (row<0) return Immutable.List()
    else {
      return grid.get("symbols") // obtenemos los simbolos validos
        .filter(v => basicSearch.isValidMove(grid, row, col, v)) // filtra aquellos que sean validos
        .map(v => fnGrid.setValue(grid, row, col, v)) // obtiene nuevas grillas con los simbolos validos añadidos a la posicion
        .toList() // convierte el set a lista
    }
  },

  //regresa true si hay alguna solucion o ya no hay movimientos
  isFinished: data => data.get("grid").get("isComplete") || data.get("moves").count()<=0,

  //regresa la posicion de la siguiente celda vacia, de arriba hacia abajo e izquierda a derecha
  getEmptyCell: (grid, i=0) => {
    const matrix = grid.get("matrix")
    const j = matrix.get(i).indexOf(" ")
    // si j < 0 vamos a la siguiente fila de los contrario regresamos la posicion
    return j<0 ? (i+1<matrix.count() ? basicSearch.getEmptyCell(grid, i+1) : {row:-1, col:-1}) : {row:i, col:j}
  },

  //regresa true si es un movimiento valido
  isValidMove: (grid, row, col, value) => {
    return !grid.get("matrix").get(row).some(v => v==value) && // validamos filas unicas
      !grid.get("matrix").some(row => row.get(col)==value) && // validamos columnas unicas
      !fnGrid.getBlock(grid, row, col).some(row => row.some(v => v==value)) // validamos bloques unicos
  },
}