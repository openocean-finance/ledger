import { processTest, populateTransaction } from "../../test.fixture";

const contractName = "ExchangeV2";

const testLabel = "callUniswapTo"; // <= Name of the test
const testDirSuffix = "call_uniswap_to"; // <= directory to compare device snapshots to
const testNetwork = "ethereum";
const signedPlugin = false;

const contractAddr = "0x6352a56caadc4f1e25cd6c75970fa768a3304e64";
const chainID = 1;

// From : https://etherscan.io/tx/0x81beed54f25ec3ec4d8c4a8361606394d8ddfc67bcf1e8875cdc1463346f7312
const inputData = "0x6b58f2f00000000000000000000000000763fdccf1ae541a5961815c0872a8c5bc6de4d7000000000000000000000000000000000000000000000844c106aeb3a9ab98eb00000000000000000000000000000000000000000000000011648e92ded5d2f700000000000000000000000000000000000000000000000000000000000000a00000000000000000000000005828eff23f92e582ddf4fbbc2900e7448e45bd6c000000000000000000000000000000000000000000000000000000000000000100000000000000003b6d03402979fa622ccb9f6b8925ca831f30c405077730c6";

const serializedTx = populateTransaction(contractAddr, inputData, chainID);

const devices = [
    {
        name: "nanos",
        label: "Nano S",
        steps: 11, // <= Define the number of steps for this test case and this device
    }
];

devices.forEach((device) =>{
        processTest(device, contractName, testLabel, testDirSuffix, "", signedPlugin, serializedTx, testNetwork);
    }
);
