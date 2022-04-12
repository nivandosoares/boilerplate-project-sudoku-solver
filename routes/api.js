"use strict";

const SudokuSolver = require("../controllers/sudoku-solver.js");

module.exports = function (app) {
  let solver = new SudokuSolver();

  app.route("/api/check").post((req, res) => {
    const { puzzle, coordinate, value } = req.body;
    if (!puzzle || !coordinate || !value) {
      return res.json({
        error: "Required field(s) missing",
      });
    }

    const validate = solver.validate(puzzle);
    if (validate !== true) {
      return res.json(validate);
    }

    const row = coordinate.split("")[0];
    const col = coordinate.split("")[1];
    if (coordinate.length !== 2 || !/[a-i]/i.test(row) || !/[1-9]/i.test(col)) {
      return res.json({
        error: "Invalid coordinate",
      });
    }
    if (!/[1-9]/i.test(value) || value.toString().length > 1) {
      return res.json({
        error: "Invalid value",
      });
    }

    const validRow = solver.checkRowPlacement(puzzle, row, col, value);
    const validCol = solver.checkColPlacement(puzzle, row, col, value);
    const validReg = solver.checkRegionPlacement(puzzle, row, col, value);

    if (validRow && validCol && validReg) {
      return res.json({
        valid: true,
      });
    }

    const conflict = [];
    if (!validRow) {
      conflict.push("row");
    }
    if (!validCol) {
      conflict.push("column");
    }
    if (!validReg) {
      conflict.push("region");
    }

    return res.json({
      valid: false,
      conflict: conflict,
    });
  });

  app.route("/api/solve").post((req, res) => {
    const { puzzle } = req.body;

    if (!puzzle) {
      return res.json({
        error: "Required field missing",
      });
    }

    const validate = solver.validate(puzzle);
    if (validate !== true) {
      return res.json(validate);
    }

    const solved = solver.solve(puzzle);
    if (!solved) {
      return res.json({
        error: "Puzzle cannot be solved",
      });
    }

    return res.json({
      solution: solved,
    });
  });
};
