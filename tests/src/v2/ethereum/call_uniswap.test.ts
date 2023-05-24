import { processTest, populateTransaction } from "../../test.fixture";

const contractName = "ExchangeV2";

const testLabel = "callUniswap"; // <= Name of the test
const testDirSuffix = "call_uniswap"; // <= directory to compare device snapshots to
const testNetwork = "ethereum";
const signedPlugin = false;

const contractAddr = "0x6352a56caadc4f1e25cd6c75970fa768a3304e64";
const chainID = 1;

// From : https://etherscan.io/tx/0x07e15e124cb355b2a0d6523870ea32c9279733c070713f739985465f304a1b25
const inputData = "0x8980041a0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002386f26fc100000000000000000000000000000000000000000000000000000000000a01511b430000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000000280000000000000003b6d0340397ff1542f962076d0bfe58ea045ffa2d347aca080000000000000003b6d0340e60ec4e49dd46dbe45ee79308b00405897310227";

const serializedTx = populateTransaction(contractAddr, inputData, chainID);

const devices = [
    {
        name: "nanos",
        label: "Nano S",
        steps: 7, // <= Define the number of steps for this test case and this device
    },
    {
        name: "nanox",
        label: "Nano X",
        steps: 6, // <= Define the number of steps for this test case and this device
    },
    {
        name: "nanosp",
        label: "Nano S+",
        steps: 6, // <= Define the number of steps for this test case and this device
    }
];

devices.forEach((device) =>{
        processTest(device, contractName, testLabel, testDirSuffix, "", signedPlugin, serializedTx, testNetwork);
    }
);
