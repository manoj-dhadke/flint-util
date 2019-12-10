/*
 *
 * INFIVERVE TECHNOLOGIES PTE LIMITED CONFIDENTIAL
 * _______________________________________________
 *
 *  (C) INFIVERVE TECHNOLOGIES PTE LIMITED, SINGAPORE
 *  All Rights Reserved.
 *  Product / Project: Flint IT Automation Platform
 *  NOTICE:  All information contained herein is, and remains
 *  the property of INFIVERVE TECHNOLOGIES PTE LIMITED.
 *  The intellectual and technical concepts contained
 *  herein are proprietary to INFIVERVE TECHNOLOGIES PTE LIMITED.
 *  Dissemination of this information or any form of reproduction of this material
 *  is strictly forbidden unless prior written permission is obtained
 *  from INFIVERVE TECHNOLOGIES PTE LIMITED, SINGAPORE.
*/

log.trace("Started executing 'fb-cloud:azure:operation:delete_ad_user.js' flintbit")

log.trace("Inputs for 'fb-cloud:azure:operation:delete_ad_user.js' :: "+input)
action = "aad-delete-user"
connector_name = "msazure"

// Input clone
input_clone = JSON.parse(input)

// Initializaing vars
client_id = ""
tenant_id = ""
key = ""
subscription_id = ""
ms_azure_parameters = ""

// Check if service params for Azure exist
if (input_clone.hasOwnProperty('ms_azure_parameters')) {
    ms_azure_parameters = input.get('ms_azure_parameters')

    // Client ID
    if (!input_clone.hasOwnProperty('client_id')) {
        client_id = ms_azure_parameters.get('client_id')
        log.trace("Client ID taken from service parameters")
    }

    // Tenant ID
    if (!input_clone.hasOwnProperty('tenant_id')) {
        tenant_id = ms_azure_parameters.get('tenant_id')
        log.trace("Tenant ID taken from service parameters")
    }

    // Key
    if (!input_clone.hasOwnProperty('key')) {
        key = ms_azure_parameters.get('key')
        log.trace("Key taken from service parameters")
    }

    // Subscription ID
    if (!input_clone.hasOwnProperty('subscription_id')) {
        subscription_id = ms_azure_parameters.get('subscription_id')
        log.trace("Subscription ID taken from service parameters")
    }
} else {
    log.info("Optional azure service parameters are not present")

    client_id = input.get('client_id')
    log.trace("Client ID: "+client_id)
    tenant_id = input.get('tenant_id')
    log.trace("Tenant ID is given")
    key = input.get('key')
    log.trace("Key is given")
    subscription_id = input.get('subscription_id')
    log.trace("Subscription ID: "+subscription_id)

}

// Get user to delete
username = input.get('username')
if(username != null || username != ""){
    log.trace("User to delete is "+username)
}

log.trace("Calling MS Azure connector for action: "+action)
connector_call_response = call.connector(connector_name)
    .set('action', action)
    .set('client-id', client_id)
    .set('tenant-id', tenant_id)
    .set('key', key)
    .set('subscription-id', subscription_id)
    .set('name-of-user', username)
    .set('azureAd','')
    .timeout(120000)
    .sync()

exit_code = connector_call_response.exitcode()
message = connector_call_response.message()

log.trace("Delete Azure AD User response: "+connector_call_response)

if(exit_code == 0){
    log.trace("Exitcode is "+exit_code)
    output.set('result', message)

}else{
    log.trace("Error: "+message)
    output.set('error', message)
    output.exit(-3, message)
}

log.trace("Finsihed executing 'fb-cloud:azure:operation:delete_ad_user.js' flintbit")
