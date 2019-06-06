log.trace("Started executing 'fb-cloud:azure:operation:add_user_to_group.js' flintbit")

log.trace("Inputs for 'fb-cloud:azure:operation:add_user_to_group.js' :: "+input)
action = "add-user-to-group"

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
    log.trace("Client ID: "+client_id)
    tenant_id = input.get('tenant_id')
    log.trace("Tenant ID is given")
    key = input.get('key')
    log.trace("Key is given")
    subscription_id = input.get('subscription_id')
    log.trace("Subscription ID: "+subscription_id)

}

// Username, Group name & Active directory domain
username = ""
group_name = ""
active_directory_domain = ""

// Username
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

// Group Name
if(input_clone.hasOwnProperty('group_name')){
    if (group_name != null || group_name != "") {
        group_name = input.get('group_name')
        log.trace(username + " will be added to the group " + group_name)
    }else{
        log.error("Group name is null or empty")
    }
}else{
    log.error("Group name is not given")
}

// Active Directory Domain
if(input_clone.hasOwnProperty('active_directory_domain')){
    log.info("Active directory domain is given")
    active_directory_domain = input.get('active_directory_domain')
    if (group_name != null || group_name != "") {
        group_name = input.get('active_directory_domain')
        log.trace(username + " will be added to the group " + group_name)
    }else{
        log.error("Active directory domain is null or empty")
    }
}else{
    log.error("Active directory domain is not given")
}


log.trace("Calling MS Azure connector for action: "+action)
connector_call_response = call.connector(connector_name)
    .set('action', action)
    .set('client-id', client_id)
    .set('tenant-id', tenant_id)
    .set('key', key)
    .set('subscription-id', subscription_id)
    .set('username', username)
    .set('group-name', group_name)
    .set('azureAd','')
    .set('active-directory-domain', active_directory_domain)
    .timeout(120000)
    .sync()

exit_code = connector_call_response.exitcode()
message = connector_call_response.message()

log.trace("Add Azure AD user "+username+" to group response: "+connector_call_response)

if(exit_code == 0){
    log.trace("Exitcode is "+exit_code)
    output.set('result', message)

}else{
    log.error("Error: "+message)
    output.set('error', message)
    output.exit(-2, message)
}

log.trace("Finsihed executing 'fb-cloud:azure:operation:add_user_to_group.js' flintbit")