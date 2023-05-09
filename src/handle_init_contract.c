#include "open_ocean_plugin.h"

// Called once to init.
void handle_init_contract(void *parameters) {
    ethPluginInitContract_t *msg = (ethPluginInitContract_t *) parameters;

    if (msg->interfaceVersion != ETH_PLUGIN_INTERFACE_VERSION_LATEST) {
        msg->result = ETH_PLUGIN_RESULT_UNAVAILABLE;
        return;
    }

    if (msg->pluginContextLength < sizeof(open_ocean_parameters_t)) {
        msg->result = ETH_PLUGIN_RESULT_ERROR;
        return;
    }

    open_ocean_parameters_t *context = (open_ocean_parameters_t *) msg->pluginContext;
    memset(context, 0, sizeof(*context));

    // Determine a function to call
    size_t i;
    for (i = 0; i < NUM_OPEN_OCEAN_SELECTORS; i++) {
        if (memcmp((uint8_t *) PIC(OPEN_OCEAN_SELECTORS[i]), msg->selector, SELECTOR_SIZE) == 0) {
            context->selectorIndex = i;
            break;
        }
    }

    if (i == NUM_OPEN_OCEAN_SELECTORS) {
        // Selector was not found
        msg->result = ETH_PLUGIN_RESULT_ERROR;
        return;
    }

    // Set `next_param` to be the first field we expect to parse.
    switch (context->selectorIndex) {
        case SWAP:
            context->skip = 3;
            context->next_param = TOKEN_SENT;
            break;
		case CALL_UNISWAP:
        case CALL_UNISWAP_TO:
            context->next_param = TOKEN_SENT;
            break;
        case UNISWAP_V3_SWAP_TO:        
            context->next_param = DST_RECEIVER;
            break;
        default:
            PRINTF("Missing selectorIndex\n");
            msg->result = ETH_PLUGIN_RESULT_ERROR;
            return;
    }

    msg->result = ETH_PLUGIN_RESULT_OK;
}
