import GSAlgorithm from "./algorithm";
import Helper from "./helper";

// const inFile = "data-export.json";
// const outFile = "data-import.json";
const inFile = "test_in_big.json";
const outFile = "test_out_big.json";

process.stdout.write("Reading input file...");
Helper.getFileContents(inFile);
process.stdout.write(" OK\n");

process.stdout.write("Running GS algorithm...");
const algorithm = new GSAlgorithm();
algorithm.initialize();
const start_algorithm = new Date().getTime();
algorithm.run();
const elapsed_algorithm = new Date().getTime() - start_algorithm;
process.stdout.write(" OK\n");
console.log("Finished algorithm in", elapsed_algorithm, "ms");

process.stdout.write("Saving results...");
Helper.mergeResults(algorithm, outFile);
process.stdout.write(" OK\n");
