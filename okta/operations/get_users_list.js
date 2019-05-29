/**
** Creation Date: 19th April 2019
** Summary: Get Okta Users List. 
** Description: This flintbit is developed to get users list from an organization on Okta.
**/

log.info("Started executing 'flint-util:okta:operations:get_users_list.js' flintbit")

log.trace("Flintbit Inputs: \n"+input)

input_clone = JSON.parse(input)

action = "get-users-list"

// Initialize variables
organization_url = ""
api_token = ""
connector_name = ""

// Service parameters
if(input_clone.hasOwnProperty('okta_configurations')){
    okta_config = input.get('okta_configurations')
    organization_url = okta_config.get('organization_url')
    api_token = okta_config.get('api_token')
    connector_name = okta_config.get('connector_name')
}else{
    organization_url = input.get('organization_url')
    api_token = input.get('api_token')
    connector_name = input.get('connector_name')
}


log.trace("Setting Okta Connector Inputs")

connector_response = call.connector(connector_name)
                        .set('organization_url',organization_url)
                        .set('api_token', api_token)
                        .set('action', action)
                        .sync()

log.trace(connector_response)
exit_code = connector_response.exitcode()
message = connector_response.message()

if(exit_code == 0){
    log.trace("Successfully retrieved users list from Okta")
    log.trace("Message: "+message)
    result = connector_response.get('result')
    output.set('result', result)
}else{
    log.trace("Failed to get users list: "+message)
    output.set('error', message)
}

log.info("Finished executing 'flint-util:okta:operations:get_users_list.js' flintbit")