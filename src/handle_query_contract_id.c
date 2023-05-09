#include "open_ocean_plugin.h"

void handle_query_contract_id(void *parameters) {
    ethQueryContractID_t *msg = (ethQueryContractID_t *) parameters;
    open_ocean_parameters_t *context = (open_ocean_parameters_t *) msg->pluginContext;

    strlcpy(msg->name, PLUGIN_NAME, msg->nameLength);

    switch (context->selectorIndex) {
        case SWAP:
            strlcpy(msg->version, "Swap", msg->versionLength);
            break;
        case CALL_UNISWAP:
            strlcpy(msg->version, "Call Uniswap", msg->versionLength);
            break;
        case CALL_UNISWAP_TO:
            strlcpy(msg->version, "Call Uniswap To", msg->versionLength);
            break;
        case UNISWAP_V3_SWAP_TO:
            strlcpy(msg->version, "Uniswap V3 Swap To", msg->versionLength);
            break;
        default:
            PRINTF("Selector Index :%d not supported\n", context->selectorIndex);
            msg->result = ETH_PLUGIN_RESULT_ERROR;
            return;
    }

    msg->result = ETH_PLUGIN_RESULT_OK;
}
