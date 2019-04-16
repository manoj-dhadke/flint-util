/**
** Creation Date: 10th April 2019
** Summary: Delete OneLogin User. 
** Description: This flintbit is developed to delete a user on OneLogin.
**/

log.info("Started executing 'example:delete_user.js' flintbit")

client_id = input.get('client_id')
client_secret = input.get('client_secret')
region = input.get('region')
user_id = input.get('user_id')
connector_name = input.get('connector_name')
action = 'delete-user'

connector_response = call.connector(connector_name)
                        .set('client_id',client_id)
                        .set('client_secret', client_secret)
                        .set('region', region)
                        .set('action', action)
                        .set('user_id', user_id)
                        .sync()

log.trace(connector_response)
exit_code = connector_response.exitcode()
message = connector_response.message()
if(exit_code == 0){
    log.trace("Successfully deleted user with ID:"+user_id)
    log.trace("Message: "+message)
    result = connector_response.get('status')
    output.set('result', result)
}else{
    log.trace("Failed to get users list: "+message)
    output.set('error', message.toString())
}

log.info("Finished executing 'example:delete_user.js' flintbit")