log.trace("Started executing 'fb-cloud:azure:operation:remove_user_from_group.js' flintbit")

log.trace("Inputs for 'fb-cloud:azure:operation:remove_user_from_group.js' :: "+input)
action = "aad-add-user-to-group"
connector_name = "msazure"

client_id = input.get('client_id')
tenant_id= input.get('tenant_id')
key = input.get('key')
subscription_id = input.get('subscription_id')
username = input.get('username')
group_name = input.get('group_name')


log.trace("Calling MS Azure connector for action: "+action)
connector_call_response = call.connector(connector_name)
    .set('action', action)
    .set('client-id', client_id)
    .set('tenant-id', tenant_id)
    .set('key', key)
    .set('subscription-id', subscription_id)
    .set('name-of-user', username)
    .set('group-name', group_name)
    .set('azureAd','')
    .timeout(120000)
    .sync()

exit_code = connector_call_response.exitcode()
message = connector_call_response.message()

log.trace("Remove Azure AD user "+username+" from group response: "+connector_call_response)

if(exit_code == 0){
    log.trace("Exitcode is "+exit_code)
    output.set('result', message)

}else{
    log.trace("Error: "+message)
    output.set('error', message)
}

log.trace("Finsihed executing 'fb-cloud:azure:operation:remove_user_from_group.js' flintbit")