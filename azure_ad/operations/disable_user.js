/*************************************************************************
 * 
 * INFIVERVE TECHNOLOGIES PTE LIMITED CONFIDENTIAL
 * __________________
 * 
 * (C) INFIVERVE TECHNOLOGIES PTE LIMITED, SINGAPORE
 * All Rights Reserved.
 * Product / Project: Flint IT Automation Platform
 * NOTICE:  All information contained herein is, and remains
 * the property of INFIVERVE TECHNOLOGIES PTE LIMITED.
 * The intellectual and technical concepts contained
 * herein are proprietary to INFIVERVE TECHNOLOGIES PTE LIMITED.
 * Dissemination of this information or any form of reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from INFIVERVE TECHNOLOGIES PTE LIMITED, SINGAPORE.
 */

log.trace("Started executing 'flint-util:azure_ad:operation:disable_user.js' flintbit")

log.trace("Inputs for 'fb-cloud:azure:operation:add_user_to_group.js' :: " + input)

action = "disable-user"
log.trace("Action is " + action)

connector_name = input.get('connector_name')
log.trace("Connector name is " + connector_name)
// Input clone
input_clone = JSON.parse(input)

// Initializaing vars
client_id = ""
tenant_id = ""
key = ""
subscription_id = ""
ms_azure_parameters = ""

// Check if service params for Azure exist
if (input_clone.hasOwnProperty('ms_azure_parameters')) {
    ms_azure_parameters = input.get('ms_azure_parameters')

    // Client ID
    if (!input_clone.hasOwnProperty('client_id')) {
        client_id = ms_azure_parameters.get('client_id')
        log.trace("Client ID taken from service parameters")
    }

    // Tenant ID
    if (!input_clone.hasOwnProperty('tenant_id')) {
        tenant_id = ms_azure_parameters.get('tenant_id')
        log.trace("Tenant ID taken from service parameters")
    }

    // Key
    if (!input_clone.hasOwnProperty('key')) {
        key = ms_azure_parameters.get('key')
        log.trace("Key taken from service parameters")
    }

    // Subscription ID
    if (!input_clone.hasOwnProperty('subscription_id')) {
        subscription_id = ms_azure_parameters.get('subscription_id')
        log.trace("Subscription ID taken from service parameters")
    }
} else {
    log.info("Optional azure service parameters are not present")

    client_id = input.get('client_id')
    log.trace("Client ID: " + client_id)
    tenant_id = input.get('tenant_id')
    log.trace("Tenant ID is given")
    key = input.get('key')
    log.trace("Key is given")
    subscription_id = input.get('subscription_id')
    log.trace("Subscription ID: " + subscription_id)

}

// Username, Group name & Active directory domain
username = ""
is_disable_user = false
active_directory_domain = ""

// Username
if (input_clone.hasOwnProperty('username')) {
    log.info("Username value is given")
    username = input.get('username')
    if (username != null && username != "") {
        log.trace("Username is " + username)
    } else {
        log.error("Username is null or empty " + username)
    }
} else {
    log.error("Username value is not given")
}


// Is disable user?
if (input_clone.hasOwnProperty('is_user_enabled')) {
    log.info("Disable user boolean value is given")
    is_user_enabled = input.get('is_user_enabled')
    if (is_user_enabled != null) {
        log.trace("User enabled? " + is_user_enabled)
    } else {
        log.error("User enabled boolean value is null :: " + is_user_enabled)
    }
} else {
    log.error("User enabled boolean value is not given")
}

// Active Directory Domain
if (input_clone.hasOwnProperty('active_directory_domain')) {
    log.info("Active directory domain is given")
    active_directory_domain = input.get('active_directory_domain')
    if (active_directory_domain != null && active_directory_domain != "") {
        active_directory_domain = input.get('active_directory_domain')
        log.trace("Azure AD domain is :: " + active_directory_domain)
    } else {
        log.error("Active directory domain is null or empty")
    }
} else {
    log.error("Active directory domain is not given")
}

log.trace("Calling MS Azure connector for action: " + action)
connector_call_response = call.connector(connector_name)
    .set('action', action)
    .set('client-id', client_id)
    .set('tenant-id', tenant_id)
    .set('key', key)
    .set('subscription-id', subscription_id)
    .set('username', username)
    .set('active-directory-domain', active_directory_domain)
    .set('is-user-enabled', is_user_enabled)
    .timeout(120000)
    .sync()

exit_code = connector_call_response.exitcode()
message = connector_call_response.message()

log.trace("Dsiable Azure AD user " + username + " response: " + connector_call_response)

if (exit_code == 0) {
    log.trace("Exitcode is " + exit_code)
    log.trace("Success message :: "+message)
    output.set('result', message)
    output.set('user_message', message)

} else {
    log.error("Error: " + message)
    output.set('error', message)
    output.set('user_message', message)
    output.exit(-3, message)
}

log.trace("Finished executing 'flint-util:azure_ad:operation:disable_user.js' flintbit")
