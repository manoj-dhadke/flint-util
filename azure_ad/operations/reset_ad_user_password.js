/**
** Creation Date: 9th May 2019
** Summary: Reset Azure AD Password. 
** Description: This flintbit is developed to reset password for an Azure AD user.
**/

log.trace("Started executing 'flint-util:azure:operation:reset_ad_user_password.js' flintbit")

log.trace("Inputs for 'fb-cloud:azure:operation:reset_ad_user_password.js' :: "+input)

// Action name
action = "aad-reset-password"

// Connector name
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
if(input_clone.hasOwnProperty('ms_azure_parameters')){
    ms_azure_parameters = input.get('ms_azure_parameters')
}else{
    log.info("Azure service parameters are not present")
}

// Client ID
if(input_clone.hasOwnProperty('client_id')){
    client_id = input.get('client_id')
}else{
    client_id = ms_azure_parameters.get('client_id')
}

// Tenant ID
if(input_clone.hasOwnProperty('tenant_id')){
    tenant_id = input.get('tenant_id')
}else{
    tenant_id= ms_azure_parameters.get('tenant_id')
}

// Key
if(input_clone.hasOwnProperty('key')){
    key = input.get('key')
}else{
    key= ms_azure_parameters.get('key')
}

// Subscription ID
if(input_clone.hasOwnProperty('subscription_id')){
    subscription_id = input.get('subscription_id')
}else{
    subscription_id = ms_azure_parameters.get('subscription_id')
}

// Azure AD username
username = input.get('username')

log.trace("Calling MS Azure connector for action: "+action)
connector_call_response = call.connector(connector_name)
    .set('action', action)
    .set('client-id', client_id)
    .set('tenant-id', tenant_id)
    .set('key', key)
    .set('subscription-id', subscription_id)
    .set('username', username)
    .set('azureAd','')
    .timeout(120000)
    .sync()

exit_code = connector_call_response.exitcode()
message = connector_call_response.message()

log.trace("Reset Azure AD users password response: "+connector_call_response)

if(exit_code == 0){
    log.trace("Exitcode is "+exit_code)
    output.set('result', message)

}else{
    log.trace("Error: "+message)
    output.set('error', message)
}

log.trace("Finsihed executing 'fb-cloud:azure:operation:reset_ad_user_password.js' flintbit")