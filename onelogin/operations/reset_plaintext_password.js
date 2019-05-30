/**
** Creation Date: 15th April 2019
** Summary: Reset Password (Cleartext) of OneLogin User. 
** Description: This flintbit is developed to logout an user on OneLogin.
**/

log.info("Started executing 'example:reset_plaintext_password.js' flintbit")
log.trace("Flintbit inputs: "+input)
action = 'reset-password-plaintext'

input_clone = JSON.parse(input)

result = ""
client_id = ""
client_secret = ""
connector_name = ""

if (input_clone.hasOwnProperty('onelogin_configurations')) {
    // Service parameters
    onelogin_config = input.get('onelogin_configurations')
    client_id = onelogin_config.get('client_id')
    client_secret = onelogin_config.get('client_secret')
    connector_name = onelogin_config.get('connector_name')
}else{
    client_id = input.get('client_id')
    client_secret = input.get('client_secret')
    connector_name = input.get('connector_name')
}

region = input.get('region')
user_id = input.get('user_id')
password = input.get('password')
confirm_password = input.get('confirm_password')

validate_policy = input.get('validate_policy')


response = call.connector(connector_name)
                        .set('client_id',client_id)
                        .set('client_secret', client_secret)
                        .set('region', region)
                        .set('action', action)
                        .set('user_id', user_id)
                        .set('password', password)
                        .set('password_confirmation', confirm_password)


input_clone = JSON.parse(input)
// Optional Parameters
if(input_clone.hasOwnProperty('validate_policy') && input_clone['validate_policy'] != null && input_clone['validate_policy'] != ""){
    validate_policy = input.get('validate_policy')
    response.set('validate_policy', validate_policy)
    log.trace("Validation policy is "+validate_policy)
}

log.trace("Calling OneLogin connector")
connector_response =  response.sync()

log.trace(connector_response)
exit_code = connector_response.exitcode()
message = connector_response.message()

if(exit_code == 0){
    result = connector_response.get('status')
    log.trace("Successfully reset password for user with ID: "+user_id)
    log.trace("Message: "+message)
    output.set('result', result)
}else{
    log.trace("Failed to get reset user password: "+message)
    output.set('error', message.toString())
}

log.info("Finished executing 'example:reset_plaintext_password.js' flintbit")