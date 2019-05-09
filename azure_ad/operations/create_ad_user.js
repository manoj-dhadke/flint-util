log.trace("Started executing 'fb-cloud:azure:operation:create_ad_user.js' flintbit")

log.trace("Inputs for 'fb-cloud:azure:operation:create_ad_user.js' :: "+input)
action = "aad-create-user"
connector_name = "msazure"

client_id = input.get('client_id')
tenant_id= input.get('tenant_id')
key = input.get('key')
subscription_id = input.get('subscription_id')
username = input.get('username')
user_principal_name = input.get('user_principal_name')
password = input.get('password')


log.trace("Calling MS Azure connector for action: "+action)
connector_call_response = call.connector(connector_name)
    .set('action', action)
    .set('client-id', client_id)
    .set('tenant-id', tenant_id)
    .set('key', key)
    .set('subscription-id', subscription_id)
    .set('name-of-user', username)
    .set('user-principal-name', user_principal_name)
    .set('password', password)
    .set('azureAd','')
    .timeout(120000)
    .sync()

exit_code = connector_call_response.exitcode()
message = connector_call_response.message()

log.trace("New Azure AD User creation response: "+connector_call_response)

if(exit_code == 0){
    log.trace("Exitcode is "+exit_code)
    output.set('result', connector_call_response.get('id'))

}else{
    log.trace("Error: "+message)
    output.set('error', message)
}

log.trace("Finsihed executing 'fb-cloud:azure:operation:create_ad_user.js' flintbit")