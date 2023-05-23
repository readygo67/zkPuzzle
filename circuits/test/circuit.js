const { assert } = require("chai");
const wasm_tester = require("circom_tester").wasm;

describe("puzzle circuit", function () {
  let puzzleCircuit;

  before(async function () {
    puzzleCircuit = await wasm_tester("puzzle/puzzle.circom");
  });


  it("Generate the witness successfully", async function () {
    let input = {
      in: [4, 9, 1, 3, 8, 2, 5, 6, 7],
      bound: [1, 9],
    };
    const witness = await puzzleCircuit.calculateWitness(input);
    await puzzleCircuit.assertOut(witness, {});
  });

  it("Fail because there is a number out of bounds", async function () {
    // The number 10 in the first row of solved is > 9
    let input = {
        in: [4, 9, 1, 3, 8, 2, 5, 6, 10],
        bound: [1, 9],
    };

    try {
      await puzzleCircuit.calculateWitness(input);
    } catch (err) {
      // console.log(err);
      assert(err.message.includes("Assert Failed"));
    }
  });

  it("Fail because of repeated numbers", async function () {
     // The number 10 in the first row of solved is > 9
    let input = {
        in: [4, 9, 1, 3, 8, 2, 5, 6, 4],
        bound: [1, 9],
    };

    try {
      await puzzleCircuit.calculateWitness(input);
    } catch (err) {
      // console.log(err);
      assert(err.message.includes("Assert Failed"));
    }
  });

  it("Fail because of not meeting sum = 13", async function () {
    let input = {
      in: [1, 9, 4, 3, 8, 2, 5, 6, 7],
      bound: [1, 9],
    };
    
    try {
        await puzzleCircuit.calculateWitness(input);
      } catch (err) {
        // console.log(err);
        assert(err.message.includes("Assert Failed"));
      }
  });
});
