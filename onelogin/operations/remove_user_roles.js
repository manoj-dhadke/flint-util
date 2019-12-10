/*
 *
 * INFIVERVE TECHNOLOGIES PTE LIMITED CONFIDENTIAL
 * _______________________________________________
 *
 *  (C) INFIVERVE TECHNOLOGIES PTE LIMITED, SINGAPORE
 *  All Rights Reserved.
 *  Product / Project: Flint IT Automation Platform
 *  NOTICE:  All information contained herein is, and remains
 *  the property of INFIVERVE TECHNOLOGIES PTE LIMITED.
 *  The intellectual and technical concepts contained
 *  herein are proprietary to INFIVERVE TECHNOLOGIES PTE LIMITED.
 *  Dissemination of this information or any form of reproduction of this material
 *  is strictly forbidden unless prior written permission is obtained
 *  from INFIVERVE TECHNOLOGIES PTE LIMITED, SINGAPORE.
*/

log.info("Started executing 'flint-util:onelogin:operations:remove_user_roles.js' flintbit")

action = 'remove-user-roles'
log.info("Flintbit inputs: "+input)

input_clone = JSON.parse(input)

// Check if request is coming from freshservice
if(input_clone.hasOwnProperty('fw_subdomain') || input_clone.hasOwnProperty('fw_account_id')){
    log.info("Input context is "+input.context())
    body = {
        "fw_subdomain" : input.get('fw_subdomain'),
        "fw_account_id" : input.get('fw_account_id'),
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

// Service Form Inputs
region = input.get('onelogin_region')
username = input.get('username')
role_id_array = input.get('role_id_array')
if (role_id_array != null && role_id_array != "") {
    if (role_id_array.search(',') != -1) {
        role_id_array = role_id_array.replace(/ /g, '')
        role_id_array = role_id_array.split(',')
        log.trace("Roles have been split into an array > "+role_id_array)
    }else{
        role_id_array = [role_id_array]
    }
} else {
    log.error("Please provide roles to assign to user")
}
connector_response = call.connector(connector_name)
                        .set('client_id',client_id)
                        .set('client_secret', client_secret)
                        .set('region', region)
                        .set('action', action)
                        .set('username', username)
                        .set('role_id_array', role_id_array)
                        .sync()

log.trace(connector_response)
exit_code = connector_response.exitcode()
message = connector_response.message()
if(exit_code == 0){
    result = connector_response.get('status')
    log.trace("Successfully removed roles "+role_id_array +" of user with username: "+username)
    log.trace("Message: "+message)
    output.set('result', result)
}else{
    log.trace("Failed to get users list: "+message)
    output.set('error', message.toString())
    output.exit(-3, message.toString())
}

log.info("Finished executing 'flint-util:onelogin:operations:remove_user_roles.js' flintbit")
