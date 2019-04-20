/**
** Creation Date: 20th April 2019
** Summary: Unlock Okta User. 
** Description: This flintbit is developed to unlock an user on Okta.
**/

log.info("Started executing 'flint-util:okta:operations:unlock_user.js' flintbit")

log.trace("Flintbit Inputs: \n"+input)

action = 'unlock-user'

// Service parameters
okta_config = input.get('okta_configurations')
organization_url = okta_config.get('organization_url')
api_token = okta_config.get('api_token')
connector_name = okta_config.get('connector_name')

// Service Inputs
email = input.get('email')

log.trace("Setting Okta Connector Inputs")

connector_response = call.connector(connector_name)
                        .set('organization_url',organization_url)
                        .set('api_token', api_token)
                        .set('action', action)
                        .set('email', email)
                        .sync()

log.trace(connector_response)
exit_code = connector_response.exitcode()
message = connector_response.message()

if(exit_code == 0){
    log.trace("Successfully unlocked user")
    log.trace("Message: "+message)
    result = connector_response.get('result')
    output.set('result', result)
}else{
    message = message.split('(')[1].split(')')[0]
    log.trace("Failed to unlock user : "+message)
    output.set('error', message)
}

log.info("Finished executing 'flint-util:okta:operations:unlock_user.js' flintbit")