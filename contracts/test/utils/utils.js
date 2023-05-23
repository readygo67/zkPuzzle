const { plonk } = require("snarkjs");

async function exportCallDataPlonk(input, wasmPath, zkeyPath) {
  const { proof: _proof, publicSignals: _publicSignals } =
    await plonk.fullProve(input, wasmPath, zkeyPath);
  // console.log("proof:", _proof);
  const calldata = await plonk.exportSolidityCallData(_proof, _publicSignals);

  // console.log("calldata", calldata);
  const calldataSplit = calldata.split(",");
  const [proof, ...rest] = calldataSplit;
  const publicSignals = JSON.parse(rest.join(",")).map((x) =>
    BigInt(x).toString()
  );
  return { proof, publicSignals };
}

module.exports = {
  exportCallDataPlonk,
};
