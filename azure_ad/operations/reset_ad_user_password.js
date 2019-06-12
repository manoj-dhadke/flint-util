/**
** Creation Date: 9th May 2019
** Summary: Reset Azure AD Password. 
** Description: This flintbit is developed to reset password for an Azure AD user.
**/

log.trace("Started executing 'flint-util:azure:operation:reset_ad_user_password.js' flintbit")

log.trace("Inputs for 'fb-cloud:azure:operation:reset_ad_user_password.js' :: " + input)

// Action name
action = "reset-password"

// Connector name
// connector_name = "msazure"
connector_name = input.get('connector_name')

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

// Azure AD username
username = ""
if (input_clone.hasOwnProperty('username')) {
    log.info("Username is given")
    username = input.get('username')
    if (username != null || username != "") {
        log.trace("Azure AD username is " + username)
    } else {
        log.error("Username is null or empty")
    }
} else {
    log.error("Username is not given")
}

// Active Directory Domain
active_directory_domain = ""
if (input_clone.hasOwnProperty('active_directory_domain')) {
    log.info("Active directory domain is given")
    active_directory_domain = input.get('active_directory_domain')
    if (active_directory_domain != null || active_directory_domain != "") {
        active_directory_domain = input.get('active_directory_domain')
        log.trace("Active directory domain is " + active_directory_domain)
    } else {
        log.error("Active directory domain is null or empty")
    }
} else {
    log.error("Active directory domain is not given")
}

// Password
password = ""
if (input_clone.hasOwnProperty('password')) {
    log.info("Password is given")
    password = input.get('password')
    if (password != null || password != "") {
        password = input.get('password')
        log.trace("Password is given not null or empty")
    } else {
        log.error("Password is null or empty")
    }
} else {
    log.error("Password is not given")
}

// Force password change?
is_force_password_change = input.get('force_password_change')
log.trace("Change password?: " + is_force_password_change)
// if (typeof is_force_password_change != 'boolean') {
//     log.error("Is force password change value is not boolean")
// }
if (is_force_password_change != null && is_force_password_change != "") {
    if (is_force_password_change == "true") {
        is_force_password_change = true
    } else if (is_force_password_change == "false") {
        is_force_password_change = false
    }else{
        is_force_password_change = false
    }
} else {
    is_force_password_change = false
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
    .set('password', password)
    .set('forceChangePasswordNextLogin', is_force_password_change)
    .timeout(120000)
    .sync()

exit_code = connector_call_response.exitcode()
message = connector_call_response.message()

log.trace("Reset Azure AD users password response: " + connector_call_response)

if (exit_code == 0) {
    log.trace("Exitcode is " + exit_code)
    output.set('result', message)

} else {
    log.trace("Error: " + message)
    output.set('error', message)
    output.error(-3, message)
}

log.trace("Finsihed executing 'flint-util:azure:operation:reset_ad_user_password.js' flintbit")