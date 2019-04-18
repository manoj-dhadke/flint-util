/**
** Creation Date: 10th April 2019
** Summary: Lock OneLogin User Account. 
** Description: This flintbit is developed to lock an users account for specified duration in minutes on OneLogin.
**/

log.info("Started executing 'example:lock_user_account.js' flintbit")

log.trace("Flintbit Inputs: \n"+input)

action = 'lock-user-account'
// Service parameters
onelogin_config = input.get('onelogin_configurations')
client_id = onelogin_config.get('client_id')
client_secret = onelogin_config.get('client_secret')
connector_name = onelogin_config.get('connector_name')

region = input.get('region')
user_id = input.get('user_id')

// Specified the duration in minutes, to lock the specified user account
input_clone = JSON.parse(input)


log.trace("Setting OneLogin Connector Inputs")

response = call.connector(connector_name)
                        .set('client_id',client_id)
                        .set('client_secret', client_secret)
                        .set('region', region)
                        .set('action', action)
                        .set('user_id', user_id)

if(input_clone.hasOwnProperty('locked_until') && input_clone['locked_until'] != null || input_clone['locked_until'] != ""){
    locked_until = input.get('locked_until')
    response.set('locked_until', locked_until)

}

log.trace("Calling OneLogin Connector")
// Call connector
connector_response = response.sync()

log.trace(connector_response)
result = connector_response.get('status')
exit_code = connector_response.exitcode()
message = connector_response.message()
if(exit_code == 0){
    log.trace("Successfully locked user account with ID: "+user_id+" for "+locked_until+" minutes")
    log.trace("Message: "+message)
    output.set('result', result)
}else{
    log.trace("Failed to get users list: "+message)
    output.set('error', message.toString())
}

log.info("Finished executing 'example:lock_user_account.js' flintbit")