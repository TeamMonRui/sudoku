// Operaciiones genericas para matrices
const fnMatrix = {
  //Regresa la copia de una subseccion de la matriz
  submatrix: (matrix, row, col, rowLength, colLength) => {
    return matrix
      .filter((_, i) => i >= row && i < row + rowLength)
      .map(r => r.slice(col, col + colLength))
  },
  
  //Regresa la copia de la matriz transpuesta
  transpose: matrix => matrix.get(0).map((col, i) => matrix.map(row => row.get(i))),

  //Regresa una representacion en string de la matriz con columnas separadas por , y filas por \n
  toString: (matrix, sep=",") => matrix.reduce((ga, row) => ga + row.reduce((ra, v) => ra + sep + v) + "\n", "").slice(0, -1),
}

const fnArr = {
  // Regresa una lista de numeros del 0 al n-1
  range: n => Immutable.List(fnArr._range(n)),

  // Regresa un conjunto de numeros del 0 al n-1
  rangeSet: n => Immutable.Set(fnArr._range(n)),

  // Regresa un array JS de numeros del 0 al n-1
  _range:n => Array(n).fill().map((_, i) => i),
}

//Miscelaneas de strings usados para ejemplos
const fnStrings = {
  input: `1 2 3 4 5 6 7 8 9
 ,1, , ,4,8,7,2, 
 ,7, ,2, , ,5, ,6
3, , ,7, , ,4, , 
 , ,5, ,6, , ,7,8
6, , ,5, ,3, , ,9
2,3, , ,9, ,1, , 
 , ,8, , ,6, , ,2
4, ,3, , ,5, ,1, 
 ,9,2,3,8, , ,5, `,
 example4: `1400
0041
2100
0012`,
 example9: `200080300
060070084
030500209
000105408
000000000
402706000
301007040
720040060
004010003`,
}