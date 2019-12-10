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

log.info("Started executing 'flint-util:okta:operations:add_role.js' flintbit")

log.trace("Flintbit Inputs: \n"+input)

action = 'add-role'

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

// Service Inputs
role_type = input.get('role_type')
email = input.get('email')

log.trace("Setting Okta Connector Inputs")

connector_response = call.connector(connector_name)
                        .set('organization_url',organization_url)
                        .set('api_token', api_token)
                        .set('action', action)
                        .set('role_type', role_type)
                        .set('email', email)
                        .sync()

log.trace(connector_response)
exit_code = connector_response.exitcode()
message = connector_response.message()

if(exit_code == 0){
    log.trace("Successfully added role type "+role_type+" to user")
    log.trace("Message: "+message)
    result = connector_response.get('result')
    output.set('result', "Successfully added role type "+role_type+" to user")
}else{
    log.trace("Failed to add role to user: "+message)
    output.set('error', message)
    output.exit(-1, message)
}

log.info("Finished executing 'flint-util:okta:operations:add_role.js' flintbit")
