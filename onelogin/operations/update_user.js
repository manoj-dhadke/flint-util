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

/**
** Creation Date: 26th July 2019
** Summary: Update OneLogin User. 
** Description: This flintbit is developed to update a OneLogin user.
**/

log.info("Started executing 'flint-util:onelogin:operations:update_user.js' flintbit")

log.info("Flintbit Inputs: \n" + input)

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


// Generic flintbit action
action = 'update-user'

if (input_clone.hasOwnProperty('username') && input_clone['username'] != null && input_clone['username'] != "") {
    username = input.get('username')
    log.trace("Updating user " + username)
    if (input_clone.hasOwnProperty('onelogin_region') && input_clone['onelogin_region'] != null && input_clone['onelogin_region'] != "") {
        region = input.get('onelogin_region')
        log.trace("Onelogin region is given " + region)

        log.trace("Calling OneLogin connector")

        response = call.connector(connector_name)
            .set('client_id', client_id)
            .set('client_secret', client_secret)
            .set('action', action)
            .set('username', username)
            .set('region', region)
           

        // Setting optional parameter to OneLogin connector

        if (input_clone.hasOwnProperty('first_name') && input_clone['first_name'] != null && input_clone['first_name'] != "") {
            // company = input.get('company')
            first_name = input.get('first_name')
            response.set('firstname', first_name)
            log.trace("First name is " + first_name)
        }

        if (input_clone.hasOwnProperty('last_name') && input_clone['last_name'] != null && input_clone['last_name'] != "") {
            // company = input.get('company')
            last_name = input.get('last_name')
            response.set('lastname', last_name)
            log.trace("Last name is " + last_name)
        }

        if (input_clone.hasOwnProperty('email') && input_clone['email'] != null && input_clone['email'] != "") {
            // company = input.get('company')
            email = input.get('email')
            response.set('email', email)
            log.trace("Email is " + email)
        }


        if (input_clone.hasOwnProperty('company') && input_clone['company'] != null && input_clone['company'] != "") {
            // company = input.get('company')
            company = input.get('company')
            response.set('company', company)
            log.trace("Company is " + company)
        }

        if (input_clone.hasOwnProperty('department') && input_clone['department'] != null && input_clone['department'] != "") {
            department = input.get('department')
            response.set('department', department)
            log.trace("Department is " + department)

        }

        if (input_clone.hasOwnProperty('directory_id') && input_clone['directory_id'] != null && input_clone['directory_id'] != "") {
            directory_id = input.get('directory_id')   // Integer 
            directory_id = Number(directory_id)
            response.set('directory_id', directory_id)
            log.trace("Directory Id is " + directory_id)
        }

        if (input_clone.hasOwnProperty('distinguished_name') && input_clone['distinguished_name'] != null && input_clone['distinguished_name'] != "") {
            distinguished_name = input.get('distinguished_name')

            response.set('distinguished_name', distinguished_name)
            log.trace("Distinguished Name is " + distinguished_name)
        }

        if (input_clone.hasOwnProperty('external_id') && input_clone['external_id'] != null && input_clone['external_id'] != "") {
            external_id = input.get('external_id')
            response.set('external_id', external_id)
            log.trace("External ID is " + external_id)

        }

        if (input_clone.hasOwnProperty('group_id') && input_clone['group_id'] != null && input_clone['group_id'] != "") {
            group_id = input.get('group_id')           // Integer
            group_id = Number(group_id)
            response.set('group_id', group_id)
            log.trace("Group ID is " + group_id)

        }

        if (input_clone.hasOwnProperty('invalid_login_attempts') && input_clone['invalid_login_attempts'] != null && input_clone['invalid_login_attempts'] != "") {
            invalid_login_attempts = input.get('invalid_login_attempts') // Integer
            invalid_login_attempts = Number(invalid_login_attempts)
            response.set('invalid_login_attempts', invalid_login_attempts)
            log.trace("Invalid login attempts are set to " + invalid_login_attempts)

        }

        if (input_clone.hasOwnProperty('locale_code') && input_clone['locale_code'] != null && input_clone['locale_code'] != "") {
            locale_code = input.get('locale_code')
            response.set('locale_code', locale_code)
            log.trace("Locale code is " + locale_code)

        }

        if (input_clone.hasOwnProperty('member_of') && input_clone['member_of'] != null && input_clone['member_of'] != "") {
            member_of = input.get('member_of')
            response.set('member_of', member_of)
            log.trace("Member of " + member_of)
        }

        if (input_clone.hasOwnProperty('openid_name') && input_clone['openid_name'] != null && input_clone['openid_name'] != "") {
            openid_name = input.get('openid_name')

            response.set('openid_name', openid_name)
            log.trace("OpenID Name is " + openid_name)

        }

        if (input_clone.hasOwnProperty('phone') && input_clone['phone'] != null && input_clone['phone'] != "") {
            phone = input.get('phone')

            response.set('phone', phone)
            log.trace("Phone is " + phone)

        }

        if (input_clone.hasOwnProperty('sam_account_name') && input_clone['sam_account_name'] != null && input_clone['sam_account_name'] != "") {
            samaccountname = input.get('sam_account_name')

            response.set('samaccountname', samaccountname)
            log.trace("Sam Account Name is " + samaccountname)

        }

        if (input_clone.hasOwnProperty('title') && input_clone['title'] != null && input_clone['title'] != "") {
            title = input.get('title')
            response.set('title', title)
            log.trace("Title is " + title)

        }

        // Calling OneLogin Connector
        connector_response = response.sync()

        log.trace(connector_response)
        exit_code = connector_response.exitcode()
        message = connector_response.message()

        if (exit_code == 0) {
            result = JSON.parse(connector_response)
            log.trace("Created user details are : " + result)
            output.set('result', result)
        } else {
            log.trace("Failed to create user: " + message)
            output.set('error', message)
            output.exit(-3, message.toString())
        }


    } else {
        log.error("Onelogin region is not provided or null or empty")
    }

} else {
    log.error("Username is not provided or null or empty")
}



log.info("Finished executing 'flint-util:onelogin:operations:create_user.js' flintbit")
