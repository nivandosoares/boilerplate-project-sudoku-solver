const chai = require("chai");
const assert = chai.assert;

const Solver = require("../controllers/sudoku-solver.js");
let solver = new Solver();

suite("UnitTests", () => {
  suite("Valid tests", () => {
    test("Logic handles a valid puzzle string of 81 characters", function (done) {
      const puzzleString =
        "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
      assert.equal(solver.validate(puzzleString), true);
      done();
    });

    test("Logic handles a puzzle string with invalid characters (not 1-9 or .)", function (done) {
      const puzzleString =
        "1.5..2.84..63.12.7.2..5.a...9..1.c..8.2.3674.3.7.2..9.47.f.8..1..16....926914.37.";
      assert.deepEqual(solver.validate(puzzleString), {
        error: "Invalid characters in puzzle",
      });
      assert.deepEqual(solver.validate(puzzleString), {
        error: "Invalid characters in puzzle",
      });
      done();
    });
    test("Logic handles a puzzle string that is not 81 characters in length", function (done) {
      const puzzleString =
        "1.5..2.84..63.12..2..5....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
      assert.deepEqual(solver.validate(puzzleString), {
        error: "Expected puzzle to be 81 characters long",
      });
      done();
    });
  });
  suite("Valid placement", () => {
    test("Logic handles a valid row placement", function (done) {
      const puzzleString =
        "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
      assert.equal(solver.checkRowPlacement(puzzleString, "A", 1, 3), true);
      done();
    });
    test("Logic handles an invalid row placement", function (done) {
      const puzzleString =
        "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
      assert.equal(solver.checkRowPlacement(puzzleString, "A", 1, 1), false);
      done();
    });
    test("Logic handles a valid column placement", function (done) {
      const puzzleString =
        "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
      assert.equal(solver.checkColPlacement(puzzleString, "A", 1, 9), true);
      done();
    });
    test("Logic handles an invalid column placement", function (done) {
      const puzzleString =
        "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
      assert.equal(solver.checkColPlacement(puzzleString, "A", 1, 6), false);
      done();
    });
    test("Logic handles a valid region (3x3 grid) placement", function (done) {
      const puzzleString =
        "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
      assert.equal(solver.checkRegionPlacement(puzzleString, "H", 7, 8), true);
      done();
    });
    test("Logic handles an invalid region (3x3 grid) placement", function (done) {
      const puzzleString =
        "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
      assert.equal(solver.checkRegionPlacement(puzzleString, "H", 7, 9), false);
      done();
    });
  });
  suite("Solver testing", () => {
    test("Valid puzzle strings pass the solver", function (done) {
      const puzzleString =
        "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
      assert.equal(
        solver.solve(puzzleString),
        "135762984946381257728459613694517832812936745357824196473298561581673429269145378"
      );
      done();
    });
    test("Invalid puzzle strings fail the solver", function (done) {
      const puzzleString =
        "115..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
      assert.equal(solver.solve(puzzleString), false);
      done();
    });
    test("Solver returns the the expected solution for an incomplete puzzzle", function (done) {
      const puzzleString =
        "5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3";
      assert.equal(
        solver.solve(puzzleString),
        "568913724342687519197254386685479231219538467734162895926345178473891652851726943"
      );
      done();
    });
  });
});
