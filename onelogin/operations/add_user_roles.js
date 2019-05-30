/**
** Creation Date: 13th April 2019
** Summary: Assign Roles To OneLogin User. 
** Description: This flintbit is developed to assign roles to OneLogin user.
**/

log.info("Started executing 'flint:add_user_roles.js' flintbit")

action = 'add-user-roles'

result = ""

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
role_id_array = input.get('role_id_array')

connector_response = call.connector(connector_name)
                        .set('client_id',client_id)
                        .set('client_secret', client_secret)
                        .set('region', region)
                        .set('action', action)
                        .set('user_id', user_id)
                        .set('role_id_array', role_id_array)
                        .sync()

log.trace(connector_response)
exit_code = connector_response.exitcode()
message = connector_response.message()
if(exit_code == 0){
    result = connector_response.get('status')
    log.trace("Successfully added roles "+role_id_array +" to user with ID: "+user_id)
    log.trace("Message: "+message)
    output.set('result', result)
}else{
    log.trace("Failed to get users list: "+message)
    output.set('error', message.toString())
}

log.info("Finished executing 'example:add_user_roles.js' flintbit")