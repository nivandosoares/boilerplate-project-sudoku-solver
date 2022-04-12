const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", () => {
  suite("POST request to /api/solve", function () {
    test("Solve a puzzle with valid puzzle string", function (done) {
      chai
        .request(server)
        .post("/api/solve")
        .send({
          puzzle:
            "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.",
        })
        .end(function (error, res) {
          assert.equal(res.status, 200);
          assert.equal(
            res.body.solution,
            "135762984946381257728459613694517832812936745357824196473298561581673429269145378"
          );
          done();
        });
    });
    test("Solve a puzzle with missing puzzle string", function (done) {
      chai
        .request(server)
        .post("/api/solve")
        .send({})
        .end(function (error, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "Required field missing");
          done();
        });
    });
    test("Solve a puzzle with invalid characters", function (done) {
      chai
        .request(server)
        .post("/api/solve")
        .send({
          puzzle:
            "1.5..2.84..63.12.7.2..5.....9..1..c.8.2.3674.3.7.2..9.47...8..1..16....926914.37.",
        })
        .end(function (error, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "Invalid characters in puzzle");
          done();
        });
    });
    test("Solve a puzzle with incorrect length", function (done) {
      chai
        .request(server)
        .post("/api/solve")
        .send({
          puzzle:
            "1.5..2.84..63.12.7.2..5....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(
            res.body.error,
            "Expected puzzle to be 81 characters long"
          );
          done();
        });
    });
    test("Solve a puzzle that cannot be solved", function (done) {
      chai
        .request(server)
        .post("/api/solve")
        .send({
          puzzle:
            "55.91372.33..8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "Puzzle cannot be solved");
          done();
        });
    });
  });

  suite("POST request to /api/check", function () {
    test("Check a puzzle placement with all fields", function (done) {
      chai
        .request(server)
        .post("/api/check")
        .send({
          puzzle:
            "..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1",
          coordinate: "A1",
          value: "1",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.valid, true);
          done();
        });
    });
    test("Check a puzzle placement with single placement conflict", function (done) {
      chai
        .request(server)
        .post("/api/check")
        .send({
          puzzle:
            "..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1",
          coordinate: "A6",
          value: "2",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.valid, false);
          assert.isArray(res.body.conflict);
          assert.equal(res.body.conflict[0], "column");
          done();
        });
    });
    test("Check a puzzle placement with multiple placement conflicts", function (done) {
      chai
        .request(server)
        .post("/api/check")
        .send({
          puzzle:
            "..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1",
          coordinate: "B4",
          value: "5",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.valid, false);
          assert.isArray(res.body.conflict);
          assert.equal(res.body.conflict[0], "row");
          assert.equal(res.body.conflict[1], "column");
          done();
        });
    });
    test("Check a puzzle placement with all placement conflicts", function (done) {
      chai
        .request(server)
        .post("/api/check")
        .send({
          puzzle:
            "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
          coordinate: "A1",
          value: "5",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.valid, false);
          assert.isArray(res.body.conflict);
          assert.equal(res.body.conflict[0], "row");
          assert.equal(res.body.conflict[1], "column");
          assert.equal(res.body.conflict[2], "region");
          done();
        });
    });
    test("Check a puzzle placement with missing required fields", function (done) {
      chai
        .request(server)
        .post("/api/check")
        .send({})
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "Required field(s) missing");
          done();
        });
    });
    test("Check a puzzle placement with invalid characters", function (done) {
      chai
        .request(server)
        .post("/api/check")
        .send({
          puzzle:
            "..9..5.1.85.4....2432...c..1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
          coordinate: "A2",
          value: "9",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "Invalid characters in puzzle");
          done();
        });
    });
    test("Check a puzzle placement with incorrect length", function (done) {
      chai
        .request(server)
        .post("/api/check")
        .send({
          puzzle:
            "..9..5.1.85.4...2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
          coordinate: "C3",
          value: "4",
        })
        .end(function (error, res) {
          assert.equal(res.status, 200);
          assert.equal(
            res.body.error,
            "Expected puzzle to be 81 characters long"
          );
          done();
        });
    });
    test("Check a puzzle placement with invalid placement coordinate", function (done) {
      chai
        .request(server)
        .post("/api/check")
        .send({
          puzzle:
            ".7.89.....5....3.4.2..4..1.5689..472...6.....1.7.5.63873.1.2.8.6..47.1..2.9.387.6",
          coordinate: "J2",
          value: "5",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "Invalid coordinate");
          done();
        });
    });
    test("Check a puzzle placement with invalid placement value", function (done) {
      chai
        .request(server)
        .post("/api/check")
        .send({
          puzzle:
            ".7.89.....5....3.4.2..4..1.5689..472...6.....1.7.5.63873.1.2.8.6..47.1..2.9.387.6",
          coordinate: "A5",
          value: "12",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "Invalid value");
          done();
        });
    });
  });
});
