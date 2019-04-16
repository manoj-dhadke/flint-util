/**
** Creation Date: 9th April 2019
** Summary: Create OneLogin User. 
** Description: This flintbit is developed to create a OneLogin user.
**/

log.info("Started executing 'example:create_user.js' flintbit")

client_id = input.get('client_id')
client_secret = input.get('client_secret')
region = input.get('region')
action = 'create-user'
connector_name = input.get('connector_name')

// Create User Params
first_name = input.get('first_name')
last_name = input.get('last_name')
email = input.get('username')
username = input.get('username')


connector_response = call.connector(connector_name)
                        .set('client_id',client_id)
                        .set('client_secret', client_secret)
                        .set('region', region)
                        .set('action', action)
                        .set('firstname', first_name)
                        .set('lastname', last_name)
                        .set('email', email)
                        .set('username', username)
                        .sync()

log.trace(connector_response)
exit_code = connector_response.exitcode()
message = connector_response.message()

if(exit_code == 0){
    log.trace("Created user details are : "+result)
    result = connector_response.get('created-user')
    output.set('result', result)
}else{
    log.trace("failed to get users list "+message)
    output.set('error', message)
}

log.info("Finished executing 'example:create_user.js' flintbit")