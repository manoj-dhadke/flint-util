log.trace("Started executing 'fb-cloud:azure:operation:create_ad_user.js' flintbit")

log.trace("Inputs for 'fb-cloud:azure:operation:create_ad_user.js' :: " + input)
action = "aad-create-user"
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

username = input.get('username')
user_principal_name = input.get('user_principal_name')
password = input.get('password')

// Username check
if(username != null && username != ""){
    log.trace("Azure AD Username is "+username)
}

// User Principal Name
if(user_principal_name != null && user_principal_name != ""){
    log.trace("Azure AD User Principal name is "+user_principal_name)
}

log.trace("Calling MS Azure connector for action: " + action)
connector_call_response = call.connector(connector_name)
    .set('action', action)
    .set('client-id', client_id)
    .set('tenant-id', tenant_id)
    .set('key', key)
    .set('subscription-id', subscription_id)
    .set('name-of-user', username)
    .set('user-principal-name', user_principal_name)
    .set('password', password)
    .set('azureAd', '')
    .timeout(120000)
    .sync()

exit_code = connector_call_response.exitcode()
message = connector_call_response.message()

log.trace("New Azure AD User creation response: " + connector_call_response)

if (exit_code == 0) {
    log.trace("Exitcode is " + exit_code)
    output.set('result', connector_call_response.get('id'))

} else {
    log.trace("Error: " + message)
    output.set('error', message)
}

log.trace("Finsihed executing 'fb-cloud:azure:operation:create_ad_user.js' flintbit")