#include "open_ocean_plugin.h"

static void handle_amount_sent(ethPluginProvideParameter_t *msg, open_ocean_parameters_t *context) {
    memcpy(context->amount_sent, msg->parameter, INT256_LENGTH);
}

static void handle_amount_received(ethPluginProvideParameter_t *msg,
                                   open_ocean_parameters_t *context) {
    memcpy(context->amount_received, msg->parameter, PARAMETER_LENGTH);
}

static void handle_beneficiary(ethPluginProvideParameter_t *msg, open_ocean_parameters_t *context) {
    memset(context->beneficiary, 0, sizeof(context->beneficiary));
    memcpy(context->beneficiary,
           &msg->parameter[PARAMETER_LENGTH - ADDRESS_LENGTH],
           sizeof(context->beneficiary));
    printf_hex_array("BENEFICIARY: ", ADDRESS_LENGTH, context->beneficiary);
}

static void handle_token_sent(ethPluginProvideParameter_t *msg, open_ocean_parameters_t *context) {
    memset(context->contract_address_sent, 0, sizeof(context->contract_address_sent));
    memcpy(context->contract_address_sent,
           &msg->parameter[PARAMETER_LENGTH - ADDRESS_LENGTH],
           ADDRESS_LENGTH);
    printf_hex_array("TOKEN SENT: ", ADDRESS_LENGTH, context->contract_address_sent);
}

static void handle_token_received(ethPluginProvideParameter_t *msg,
                                  open_ocean_parameters_t *context) {
    memset(context->contract_address_received, 0, sizeof(context->contract_address_received));
    memcpy(context->contract_address_received,
           &msg->parameter[PARAMETER_LENGTH - ADDRESS_LENGTH],
           ADDRESS_LENGTH);
    printf_hex_array("TOKEN RECEIVED: ", ADDRESS_LENGTH, context->contract_address_received);
}

static void handle_flags(ethPluginProvideParameter_t *msg, open_ocean_parameters_t *context) {
    context->flags = msg->parameter[PARAMETER_LENGTH - 1];
}

static void handle_swap(ethPluginProvideParameter_t *msg, open_ocean_parameters_t *context) {
    switch (context->next_param) {
        case TOKEN_SENT:  // fromToken
            handle_token_sent(msg, context);
            context->next_param = TOKEN_RECEIVED;
            break;
        case TOKEN_RECEIVED:  // toToken
            handle_token_received(msg, context);
            context->next_param = SRC_RECEIVER;
            break;
        case SRC_RECEIVER:  // srcReceiver
            context->next_param = DST_RECEIVER;
            break;
        case DST_RECEIVER:  // dstReceiver
            handle_beneficiary(msg, context);
            context->next_param = AMOUNT_SENT;
            break;
        case AMOUNT_SENT:  // fromAmount
            handle_amount_sent(msg, context);
            context->next_param = AMOUNT_RECEIVED;
            break;
        case AMOUNT_RECEIVED:  // toAmount
            handle_amount_received(msg, context);
            context->next_param = NONE;
            break;
        case NONE:
            break;
        default:
            PRINTF("Param not supported\n");
            msg->result = ETH_PLUGIN_RESULT_ERROR;
            break;
    }
}

static void handle_call_uniswap(ethPluginProvideParameter_t *msg,
                                open_ocean_parameters_t *context) {
    switch (context->next_param) {
        case TOKEN_SENT:
            handle_token_sent(msg, context);
            context->next_param = AMOUNT_SENT;
            break;
        case AMOUNT_SENT:
            handle_amount_sent(msg, context);
            context->next_param = AMOUNT_RECEIVED;
            break;
        case AMOUNT_RECEIVED:
            handle_amount_received(msg, context);
            // We call the handle_token_received method to print "Unknown Token"
            handle_token_received(msg, context);
            context->next_param = NONE;
            break;
        case NONE:
            break;
        default:
            PRINTF("Param not supported\n");
            msg->result = ETH_PLUGIN_RESULT_ERROR;
            break;
    }
}

static void handle_uniswap_v3_swap_to(ethPluginProvideParameter_t *msg,
                                      open_ocean_parameters_t *context) {
    switch (context->next_param) {
        case DST_RECEIVER:
            handle_beneficiary(msg, context);
            context->next_param = AMOUNT_SENT;
            break;
        case AMOUNT_SENT:
            handle_amount_sent(msg, context);
            // We call the handle_token_sent method to print "Unknown Token"
            handle_token_sent(msg, context);
            context->next_param = AMOUNT_RECEIVED;
            break;
        case AMOUNT_RECEIVED:
            handle_amount_received(msg, context);
            // We call the handle_token_received method to print "Unknown Token"
            handle_token_received(msg, context);
            context->next_param = NONE;
            break;
        case NONE:
            break;
        default:
            PRINTF("Param not supported\n");
            msg->result = ETH_PLUGIN_RESULT_ERROR;
            break;
    }
}

void handle_provide_parameter(void *parameters) {
    ethPluginProvideParameter_t *msg = (ethPluginProvideParameter_t *) parameters;
    open_ocean_parameters_t *context = (open_ocean_parameters_t *) msg->pluginContext;
    printf_hex_array("openocean plugin provide parameter: ", PARAMETER_LENGTH, msg->parameter);

    msg->result = ETH_PLUGIN_RESULT_OK;

    if (context->skip) {
        // Skip this step, and don't forget to decrease skipping counter.
        context->skip--;
    } else {
        if ((context->offset) && msg->parameterOffset != context->checkpoint + context->offset) {
            PRINTF("offset: %d, checkpoint: %d, parameterOffset: %d\n",
                   context->offset,
                   context->checkpoint,
                   msg->parameterOffset);
            return;
        }

        context->offset = 0;  // Reset offset
        switch (context->selectorIndex) {
            case SWAP: {
                handle_swap(msg, context);
                break;
            }
            case CALL_UNISWAP:
            case CALL_UNISWAP_TO: {
                handle_call_uniswap(msg, context);
                break;
            }
            case UNISWAP_V3_SWAP_TO: {
                handle_uniswap_v3_swap_to(msg, context);
                break;
            }
            default:
                PRINTF("Selector Index %d not supported\n", context->selectorIndex);
                msg->result = ETH_PLUGIN_RESULT_ERROR;
                break;
        }
    }
}
