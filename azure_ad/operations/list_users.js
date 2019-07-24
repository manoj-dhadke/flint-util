log.trace("Started executing 'flint-util:azure_ad:operations:list_users.js' flintbit")

log.trace("Inputs for 'flint-util:azure_ad:operations:list_users.js' :: " + input)
action = "list-users"


// Input clone
input_clone = JSON.parse(input)

// Initializaing vars
client_id = ""
tenant_id = ""
key = ""
subscription_id = ""
ms_azure_parameters = ""
connector_name = ""

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
    // Connector Name
    if (!input_clone.hasOwnProperty('connector_name')) {
        connector_name = ms_azure_parameters.get('connector_name')
        log.trace("Connector name is given in service parameter: "+connector_name)
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
    connector_name = input.get('connector_name')
    log.trace("Connector name is "+connector_name)
}

// Connector call
log.trace("Calling MS Azure connector for action: " + action)

// Active Directory Domain - Mandatory
active_directory_domain = ""
if(input_clone.hasOwnProperty('active_directory_domain')){
    log.info("Active directory domain is given")
    active_directory_domain = input.get('active_directory_domain')
    if (active_directory_domain != null || active_directory_domain != "") {
        active_directory_domain = input.get('active_directory_domain')
        log.trace("Azure Active directory domain is "+ active_directory_domain)
    }else{
        log.error("Active directory domain is null or empty")
    }
}else{
    log.error("Active directory domain is not given")
}

connector_call = call.connector(connector_name)
    .set('action', action)
    .set('client-id', client_id)
    .set('tenant-id', tenant_id)
    .set('key', key)
    .set('subscription-id', subscription_id)
    .set('active-directory-domain' , active_directory_domain)
    .timeout(120000)
    .sync()

    log.trace("Connector response: "+connector_call)

    exit_code = connector_call.exitcode()
    message = connector_call.message()


    if(exit_code == 0){
        log.trace(connector_call)
        output.set("result", JSON.parse(connector_call))
    }else{
        log.trace("Error: "+message)
        output.set("error", message)
    }

    log.trace("Finished executing 'flint-util:azure_ad:operations:list_users.js' flintbit")