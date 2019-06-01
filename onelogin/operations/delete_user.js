/**
** Creation Date: 10th April 2019
** Summary: Delete OneLogin User. 
** Description: This flintbit is developed to delete a user on OneLogin.
**/

log.info("Started executing 'example:delete_user.js' flintbit")

input_clone = JSON.parse(input)
// Check if request is coming from freshservice
if(input_clone.hasOwnProperty('fw_subdomain') || input_clone.hasOwnProperty('fw_account_id')){
    log.info("Input context is "+input.context())
    body = {
        "input" : input,
        "timestamp" : + new Date(),
        "input_context" : input.context()
    }

    body = util.json(body)
    log.debug("Body to be sent to MQ: "+body)

    // Call Flintbit to send data to MQ
    log.info("Calling flintbit 'flint-util:freshservice:post_data_to_mq.js' flinbit to post freshworks app request data to RabbitMQ")
    flintbit_response = call.bit('flint-util:freshservice:post_data_to_mq.js')
                            .set('body', body)
                            .sync()

    log.debug("Call to 'example:post_data_to_mq.js' was made. \nResult: "+flintbit_response.get("result"))
}

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
username = input.get('username')

action = 'delete-user'

connector_response = call.connector(connector_name)
                        .set('client_id',client_id)
                        .set('client_secret', client_secret)
                        .set('region', region)
                        .set('action', action)
                        .set('username', username)
                        .sync()

log.trace(connector_response)
exit_code = connector_response.exitcode()
message = connector_response.message()
if(exit_code == 0){
    log.trace("Successfully deleted user with username:"+username)
    log.trace("Message: "+message)
    result = connector_response.get('status')
    output.set('result', result)
}else{
    log.trace("Failed to get users list: "+message)
    output.set('error', message.toString())
    output.exit(-3, message.toString())
}

log.info("Finished executing 'example:delete_user.js' flintbit")