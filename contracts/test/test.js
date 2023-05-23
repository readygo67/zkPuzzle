const { expect } = require("chai");
const { ethers } = require("hardhat");
const { exportCallDataPlonk } = require("./utils/utils");

describe("Puzzle test", function () {
  let PlonkVerifier,  plonkVerifier;

  beforeEach(async function () {
    PlonkVerifier = await ethers.getContractFactory(
      "PlonkVerifier"
    );
    plonkVerifier = await PlonkVerifier.deploy();
    await plonkVerifier.deployed();
  });


  it("Should return true for valid proof on-chain 1", async function () {
    this.timeout(50000);
    let input = {
        in: [4, 9, 1, 3, 8, 2, 5, 6, 7],
        bound: [1, 9],
    };
    
    let dataResult = await exportCallDataPlonk(
      input,
      "./zkproof/puzzle.wasm",
      "./zkproof/puzzle_final.zkey"
    );

    // Call the function.
    let result = await plonkVerifier.verifyProof(
      dataResult.proof,
      dataResult.publicSignals
    );
    expect(result).to.equal(true);
  });

  it("Should return true for valid proof on-chain 2", async function () {
    this.timeout(50000);
    let input = {
        in: [7, 6, 5, 2, 8, 3, 1, 9, 4],
        bound: [1, 9],
    };
    
    let dataResult = await exportCallDataPlonk(
      input,
      "./zkproof/puzzle.wasm",
      "./zkproof/puzzle_final.zkey"
    );

    // Call the function.
    let result = await plonkVerifier.verifyProof(
      dataResult.proof,
      dataResult.publicSignals
    );
    expect(result).to.equal(true);
  });

  it("Should return true for valid proof on-chain 3", async function () {
    this.timeout(50000);
    let input = {
        in: [7, 6, 5, 2, 3, 8, 1, 4, 9],
        bound: [1, 9],
    };
    
    let dataResult = await exportCallDataPlonk(
      input,
      "./zkproof/puzzle.wasm",
      "./zkproof/puzzle_final.zkey"
    );

    // Call the function.
    let result = await plonkVerifier.verifyProof(
      dataResult.proof,
      dataResult.publicSignals
    );
    expect(result).to.equal(true);
  });

  it("Should return true for valid proof on-chain 4", async function () {
    this.timeout(50000);
    let input = {
        in: [9, 4, 1, 8, 3, 2, 5, 6, 7],
        bound: [1, 9],
    };
    
    let dataResult = await exportCallDataPlonk(
      input,
      "./zkproof/puzzle.wasm",
      "./zkproof/puzzle_final.zkey"
    );

    // Call the function.
    let result = await plonkVerifier.verifyProof(
      dataResult.proof,
      dataResult.publicSignals
    );
    expect(result).to.equal(true);
  });
  
});
