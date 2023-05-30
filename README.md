# Ledger OpenOcean Plugin

This is a plugin for the Ethereum application which helps parsing and displaying relevant information when signing a
OpenOcean transaction.

## Documentation

Need more information about the interface, the architecture, or general stuff about ethereum plugins? You can find more
about them in
the [ethereum-app documentation](https://github.com/LedgerHQ/app-ethereum/blob/master/doc/ethapp_plugins.asc).

## Smart Contracts

Smart contracts covered by this plugin are:

| Network | Version | Smart Contract |
| ---       | --- | --- |
| Ethereum  | V2  | `0x6352a56caadC4F1E25CD6c75970Fa768A3304e64`|

## Functions implemented:

| Function        | Selector  | Available in Ledger Live |
|-----------------| ---       |------|
| swap            | 0x90411a32| Yes  |
| callUniswap     | 0x8980041a| No   |
| callUniswapTo   | 0x6b58f2f0| No   |
| uniswapV3SwapTo | 0xbc80f1a8| No   |

## Continuous Integration

The flow processed in [GitHub Actions](https://github.com/features/actions) is the following:

- Code formatting with [clang-format](http://clang.llvm.org/docs/ClangFormat.html)
- Compilation of the application for Ledger Nano S
  in [ledger-app-builder](https://github.com/LedgerHQ/ledger-app-builder)
