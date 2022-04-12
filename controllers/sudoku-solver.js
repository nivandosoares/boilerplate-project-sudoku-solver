class SudokuSolver {
  validate(puzzleString) {
    if (/^[0-9.]+$/.exec(puzzleString) === null) {
      return {
        error: "Invalid characters in puzzle",
      };
    }

    if (puzzleString.length > 81 || puzzleString.length < 81) {
      return {
        error: "Expected puzzle to be 81 characters long",
      };
    }
    return true;
  }

  rowToNumber(row) {
    switch (row.toUpperCase()) {
      case "A":
        return 1;
        break;
      case "B":
        return 2;
        break;
      case "C":
        return 3;
        break;
      case "D":
        return 4;
        break;
      case "E":
        return 5;
        break;
      case "F":
        return 6;
        break;
      case "G":
        return 7;
        break;
      case "H":
        return 8;
        break;
      case "I":
        return 9;
        break;
      default:
        return false;
    }
  }

  checkRowPlacement(puzzleString, row, column, value) {
    const grid = this.transform(puzzleString);
    row = this.rowToNumber(row);
    if (grid[row - 1][column - 1] !== 0) {
      return false;
    }
    for (let i = 0; i < 9; i++) {
      if (grid[row - 1][i] === parseInt(value)) {
        return false;
      }
    }
    return true;
  }

  checkColPlacement(puzzleString, row, column, value) {
    const grid = this.transform(puzzleString);
    row = this.rowToNumber(row);
    if (grid[row - 1][column - 1] !== 0) {
      return false;
    }
    for (let i = 0; i < 9; i++) {
      if (grid[i][column - 1] === parseInt(value)) {
        return false;
      }
    }
    return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const grid = this.transform(puzzleString);
    row = this.rowToNumber(row);
    if (grid[row - 1][column - 1] !== 0) {
      return false;
    }

    let startRow = row - (row % 3);
    let startCol = column - (column % 3);

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (grid[i + startRow][j + startCol] === parseInt(value)) {
          return false;
        }
      }
    }
    return true;
  }
  solveSuduko(grid, row, col) {
    if (row === 9 - 1 && col === 9) return grid;

    if (col === 9) {
      row++;
      col = 0;
    }

    if (grid[row][col] !== 0) return this.solveSuduko(grid, row, col + 1);

    for (let num = 1; num < 10; num++) {
      if (this.isSafe(grid, row, col, num)) {
        grid[row][col] = num;

        if (this.solveSuduko(grid, row, col + 1)) return grid;
      }
      grid[row][col] = 0;
    }
    return false;
  }

  isSafe(grid, row, col, num) {
    for (let x = 0; x <= 8; x++) if (grid[row][x] === num) return false;

    for (let x = 0; x <= 8; x++) if (grid[x][col] === num) return false;

    let startRow = row - (row % 3),
      startCol = col - (col % 3);
    for (let i = 0; i < 3; i++)
      for (let j = 0; j < 3; j++)
        if (grid[i + startRow][j + startCol] === num) return false;

    return true;
  }

  transform(puzzleString) {
    let grid = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];

    let row = -1;
    let col = 0;

    for (let i = 0; i < puzzleString.length; i++) {
      if (i % 9 === 0) {
        row++;
      }
      if (col % 9 === 0) {
        col = 0;
      }

      grid[row][col] = puzzleString[i] === "." ? 0 : +puzzleString[i];
      col++;
    }
    return grid;
  }

  transformBack(grid) {
    return grid.flat().join("");
  }

  solve(puzzleString) {
    let grid = this.transform(puzzleString);
    let solved = this.solveSuduko(grid, 0, 0);
    if (!solved) {
      return false;
    }

    let solvedString = this.transformBack(solved);
    return solvedString;
  }
}

module.exports = SudokuSolver;
