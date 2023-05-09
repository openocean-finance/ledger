#include "open_ocean_plugin.h"


// swap 0x90411a32
static const uint8_t OPEN_OCEAN_SWAP_SELECTOR[SELECTOR_SIZE] = {0x90, 0x41, 0x1a, 0x32};
// callUniswap 0x8980041a
static const uint8_t OPEN_OCEAN_CALL_UNISWAP_SELECTOR[SELECTOR_SIZE] = {0x89, 0x80, 0x04, 0x1a};
// callUniswapTo 0x6b58f2f0
static const uint8_t OPEN_OCEAN_CALL_UNISWAP_TO_SELECTOR[SELECTOR_SIZE] = {0x6b, 0x58, 0xf2, 0xf0};
// uniswapV3SwapTo 0xbc80f1a8
static const uint8_t OPEN_OCEAN_UNISWAP_V3_SWAP_TO_SELECTOR[SELECTOR_SIZE] = {0xbc, 0x80, 0xf1, 0xa8};


// Array of all the different openocean selectors.
const uint8_t *const OPEN_OCEAN_SELECTORS[NUM_OPEN_OCEAN_SELECTORS] = {
    OPEN_OCEAN_SWAP_SELECTOR,
	OPEN_OCEAN_CALL_UNISWAP_SELECTOR,
    OPEN_OCEAN_CALL_UNISWAP_TO_SELECTOR,
    OPEN_OCEAN_UNISWAP_V3_SWAP_TO_SELECTOR
};

// openocean uses `0xeeeee` as a dummy address to represent ETH.
const uint8_t OPEN_OCEAN_ETH_ADDRESS[ADDRESS_LENGTH] = {0xee, 0xee, 0xee, 0xee, 0xee, 0xee, 0xee,
                                                      0xee, 0xee, 0xee, 0xee, 0xee, 0xee, 0xee,
                                                      0xee, 0xee, 0xee, 0xee, 0xee, 0xee};

// Used to indicate that the beneficiary should be the sender.
const uint8_t NULL_ETH_ADDRESS[ADDRESS_LENGTH] = {0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
                                                  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
                                                  0x00, 0x00, 0x00, 0x00, 0x00, 0x00};
