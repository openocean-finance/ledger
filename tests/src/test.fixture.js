import Zemu from '@zondax/zemu';
import Eth from '@ledgerhq/hw-app-eth';
import { generate_plugin_config } from './generate_plugin_config';
import { parseEther, parseUnits, RLP } from 'ethers/lib/utils';
import { ethers } from "ethers";
import ledgerService from "@ledgerhq/hw-app-eth/lib/services/ledger"


const transactionUploadDelay = 60000;

export async function waitForAppScreen(sim) {
    await sim.waitUntilScreenIsNot(sim.getMainMenuSnapshot(), transactionUploadDelay);
}

const simOptions = {
    logging: true,
    X11: false,
    startDelay: 15000,
    startText: 'is ready'
};

const Resolve = require('path').resolve;

const APP_PATH_NANOS = Resolve('elfs/ethereum_nanos.elf');
const APP_PATH_NANOX = Resolve('elfs/ethereum_nanox.elf');
const APP_PATH_NANOSP = Resolve('elfs/ethereum_nanosp.elf');

const PLUGIN_LIB_NANOS = { 'openocean': Resolve('elfs/plugin_nanos.elf') };
const PLUGIN_LIB_NANOX = { 'openocean': Resolve('elfs/plugin_nanox.elf') };
const PLUGIN_LIB_NANOSP = { 'openocean': Resolve('elfs/plugin_nanosp.elf') };

const RANDOM_ADDRESS = "0xaaaabbbbccccddddeeeeffffgggghhhhiiiijjjj";

let genericTx = {
    nonce: Number(0),
    gasLimit: Number(21000),
    gasPrice: parseUnits("1", "gwei"),
    value: parseEther("1"),
    chainId: 1,
    to: RANDOM_ADDRESS,
    data: null,
};

let config ;

const TIMEOUT = 2000000;

/**
 * Generates a serializedTransaction from a rawHexTransaction copy pasted from etherscan.
 * @param {string} rawTx Raw transaction
 * @returns {string} serializedTx
 */
function txFromEtherscan(rawTx) {
    // Remove 0x prefix
    rawTx = rawTx.slice(2);

    let txType = rawTx.slice(0, 2);
    if (txType == "02" || txType == "01") {
      // Remove "02" prefix
      rawTx = rawTx.slice(2);
    } else {
      txType = "";
    }

    let decoded = RLP.decode("0x" + rawTx);
    if (txType != "") {
      decoded = decoded.slice(0, decoded.length - 3); // remove v, r, s
    } else {
      decoded[decoded.length - 1] = "0x"; // empty
      decoded[decoded.length - 2] = "0x"; // empty
      decoded[decoded.length - 3] = "0x01"; // chainID 1
    }

    // Encode back the data, drop the '0x' prefix
    let encoded = RLP.encode(decoded).slice(2);

    // Don't forget to prepend the txtype
    return txType + encoded;
}

/**
 * Emulation of the device using zemu
 * @param {string} device name of the device to emulate (nanos, nanox)
 * @param {function} func
 * @param {boolean} signed the plugin is already signed
 * @returns {Promise}
 */
function zemu(device, func, testNetwork, signed = false) {
    return async () => {
      jest.setTimeout(TIMEOUT);
      let eth_path;
      let plugin;
      let sim_options = simOptions;

      if (device === "nanos") {
        eth_path = APP_PATH_NANOS;
        plugin = PLUGIN_LIB_NANOS;
        sim_options.model = "nanos";
      } else if (device === "nanox") {
        eth_path = APP_PATH_NANOX;
        plugin = PLUGIN_LIB_NANOX;
        sim_options.model = "nanox";
      }else {
        eth_path = APP_PATH_NANOSP;
        plugin = PLUGIN_LIB_NANOSP;
        sim_options.model = "nanosp";
      }

      const sim = new Zemu(eth_path, plugin);

      try {
        await sim.start(sim_options);
        const transport = await sim.getTransport();
        const eth = new Eth(transport);

        if (!signed) {
          config = generate_plugin_config(testNetwork);
          eth.setLoadConfig({
            pluginBaseURL: null,
            extraPlugins: config,
          });
        }
        await func(sim, eth);
      } finally {
        await sim.close();
      }
    };
}

/**
 * Process the trasaction through the full test process in interaction with the simulator
 * @param {Eth} eth Device to test (nanos, nanox)
 * @param {function} sim Zemu simulator
 * @param {int} steps Number of steps to push right button
 * @param {string} label directory against which the test snapshots must be checked.
 * @param {string} rawTxHex RawTransaction Hex to process
 */
async function processTransaction(eth, sim, steps, label, rawTxHex, srlTx = "") {
    let serializedTx;
    if (srlTx == "")
      serializedTx = txFromEtherscan(rawTxHex);
    else
      serializedTx = srlTx;

    const resolution = await ledgerService.resolveTransaction(serializedTx, {
      nftExplorerBaseURL: null,
      pluginBaseURL: null,
      extraPlugins: config,
    }, {
      nft: false,
      externalPlugins: true,
      erc20: false,
    })
    .catch((e) => {
      console.warn(
        "an error occurred in resolveTransaction => fallback to blind signing: " +
          String(e)
      );
      return null;
    });

    let tx = eth.signTransaction("44'/60'/0'/0/0", serializedTx, resolution);

    await sim.waitUntilScreenIsNot(
      sim.getMainMenuSnapshot(),
      transactionUploadDelay
    );

    await sim.navigateAndCompareSnapshots(".", label, [steps, 0]);
    await tx;
}

/**
 * Function to execute test with the simulator
 * @param {Object} device Device including its name, its label, and the number of steps to process the use case
 * @param {string} contractName Name of the contract
 * @param {string} testLabel Name of the test case
 * @param {string} testDirSuffix Name of the folder suffix for snapshot comparison
 * @param {string} rawTxHex RawTx Hex to test
 * @param {boolean} signed The plugin is already signed and existing in Ledger database
 */
function processTest(device, contractName, testLabel, testDirSuffix, rawTxHex, signed, serializedTx, testNetwork) {
    test(
      "[" + contractName + "] - " + device.label + " - " + testLabel,
      zemu(device.name, async (sim, eth) => {
        await processTransaction(
          eth,
          sim,
          device.steps,
          testNetwork + "_" + device.name + "_" + testDirSuffix,
          rawTxHex,
          serializedTx
        );
      }, testNetwork, signed)
    );
}


function populateTransaction(contractAddr, inputData, chainId, value = "0.0") {
    // Get the generic transaction template
    let unsignedTx = genericTx;
    //adapt to the appropriate network
    unsignedTx.chainId = chainId;
    // Modify `to` to make it interact with the contract
    unsignedTx.to = contractAddr;
    // Modify the attached data
    unsignedTx.data = inputData;
    // Modify the number of ETH sent
    unsignedTx.value = parseEther(value);
    // Create serializedTx and remove the "0x" prefix
    return ethers.utils.serializeTransaction(unsignedTx).slice(2);
}


module.exports = {
    processTest,
    genericTx,
    populateTransaction
};
