/**
** Creation Date: 9th April 2019
** Summary: Get OneLogin Users List. 
** Description: This flintbit is developed to get a list of OneLogin users list.
**/

log.info("Started executing 'example:get_users.js' flintbit")

client_id = input.get('client_id')
client_secret = input.get('client_secret')
region = input.get('region')
connector_name = input.get('connector_name')
action = 'get-users'

connector_response = call.connector(connector_name)
                        .set('client_id',client_id)
                        .set('client_secret', client_secret)
                        .set('region', region)
                        .set('action', action)
                        .sync()

log.trace(connector_response)
result = connector_response.get('users-list')
exit_code = connector_response.exitcode()
message = connector_response.message()
if(exit_code == 0){
    log.trace("Users List: "+result)
    output.set('result', result)
}else{
    log.trace("Failed to get users list: "+message)
    output.set('error', message)
}

log.info("Finished executing 'example:get_users.js' flintbit")