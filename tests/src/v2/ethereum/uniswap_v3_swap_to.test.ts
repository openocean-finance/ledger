import { processTest, populateTransaction } from "../../test.fixture";

const contractName = "ExchangeV2";

const testLabel = "uniswapV3SwapTo"; // <= Name of the test
const testDirSuffix = "uniswap_v3_swap_to"; // <= directory to compare device snapshots to
const testNetwork = "ethereum";
const signedPlugin = false;

const contractAddr = "0x6352a56caadc4f1e25cd6c75970fa768a3304e64";
const chainID = 1;

// From : https://etherscan.io/tx/0xa670fdde9d23161caf14150f34215cfb814c6668518dda1f3d538dc84b83fcc4
const inputData = "0xbc80f1a80000000000000000000000003c0399da0fef6071848cf5e78f12b4c172df873b0000000000000000000000000000000000000000000000000186cc6acd4b00000000000000000000000000000000000000000000004eb3e8348f07968301268100000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000001c0000000000000000000000011950d141ecb863f01007add7d1a342041227b58";

const serializedTx = populateTransaction(contractAddr, inputData, chainID);

const devices = [
    {
        name: "nanos",
        label: "Nano S",
        steps: 11, // <= Define the number of steps for this test case and this device
    },
    {
        name: "nanox",
        label: "Nano X",
        steps: 7, // <= Define the number of steps for this test case and this device
    },
    {
        name: "nanosp",
        label: "Nano S+",
        steps: 7, // <= Define the number of steps for this test case and this device
    }
];

devices.forEach((device) =>{
        processTest(device, contractName, testLabel, testDirSuffix, "", signedPlugin, serializedTx, testNetwork);
    }
);
