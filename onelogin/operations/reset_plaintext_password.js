/**
** Creation Date: 15th April 2019
** Summary: Reset Password (Cleartext) of OneLogin User. 
** Description: This flintbit is developed to logout an user on OneLogin.
**/

log.info("Started executing 'flint-util:onelogin:operations:reset_plaintext_password.js' flintbit")
log.trace("Flintbit inputs: " + input)

action = 'reset-password-plaintext'

input_clone = JSON.parse(input)

// Check if request is coming from freshservice
if (input_clone.hasOwnProperty('fw_subdomain') || input_clone.hasOwnProperty('fw_account_id')) {
    log.info("Input context is " + input.context())
    body = {
        "fw_subdomain": input.get('fw_subdomain'),
        "fw_account_id": input.get('fw_account_id'),
        "timestamp": + new Date(),
        "input_context": input.context()
    }

    body = util.json(body)
    log.debug("Body to be sent to MQ: " + body)

    // Call Flintbit to send data to MQ
    log.info("Calling flintbit 'flint-util:freshservice:post_data_to_mq.js' flinbit to post freshworks app request data to RabbitMQ")
    flintbit_response = call.bit('flint-util:freshservice:post_data_to_mq.js')
        .set('body', body)
        .sync()

    log.debug("Call to 'example:post_data_to_mq.js' was made. \nResult: " + flintbit_response.get("result"))
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
} else {
    client_id = input.get('client_id')
    client_secret = input.get('client_secret')
    connector_name = input.get('connector_name')
}

region = input.get('onelogin_region')
username = input.get('username')
password = input.get('password')
confirm_password = input.get('confirm_password')

response = call.connector(connector_name)
    .set('client_id', client_id)
    .set('client_secret', client_secret)
    .set('region', region)
    .set('action', action)
    .set('username', username)
    .set('password', password)
    .set('password_confirmation', confirm_password)


input_clone = JSON.parse(input)
// Optional Parameters
if (input_clone.hasOwnProperty('validate_policy') && input_clone['validate_policy'] != null && input_clone['validate_policy'] != "") {
    validate_policy = input.get('validate_policy')
    if (validate_policy == "true") {
        validate_policy = true
    } else if (validate_policy == "false") {
        validate_policy = false
    } else {
        validate_policy = false
    }
    response.set('validate_policy', validate_policy)
    log.trace("Validation policy is " + validate_policy)
}

log.trace("Calling OneLogin connector")
connector_response = response.sync()

log.trace(connector_response)
exit_code = connector_response.exitcode()
message = connector_response.message()

if (exit_code == 0) {
    result = connector_response.get('status')
    log.trace("Successfully reset password for user with username: " + username)
    log.trace("Message: " + message)
    output.set('result', result)
} else {
    log.trace("Failed to get reset user password: " + message)
    output.set('error', message.toString())
    output.exit(-3, message.toString())
}

log.info("Finished executing 'flint-util:onelogin:operations:reset_plaintext_password.js' flintbit")