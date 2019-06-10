log.trace("Started executing 'fb-cloud:azure:operation:update_ad_user.js' flintbit")

log.trace("Inputs for 'fb-cloud:azure:operation:update_ad_user.js' :: " + input)
action = "update-user"
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

// Connector call
log.trace("Calling MS Azure connector for action: " + action)

// Azure AD Username - Mandatory
if(input_clone.hasOwnProperty('username')){
    username = input.get('username')
    if(username != null && username != ""){
        log.trace("Azure AD username is "+username)
    }else{
        log.error("Azure AD username is empty or null")
    }
}else{
    log.error("Please provide Azure AD users, username")
}

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
    .set('username', username)
    .set('active-directory-domain' , active_directory_domain)
    .timeout(120000)


// Optional parameters

// Account Enabled 
if(input_clone.hasOwnProperty('account_enabled')){
    account_enabled = input.get('account_enabled')
    log.trace("Account is enabled? "+account_enabled)
    connector_call.set('accountEnabled', account_enabled)
}

// User Principal Name
if(input_clone.hasOwnProperty('user_principal_name')){
    user_principal_name = input.get('user_principal_name')
    log.trace("User Principal Name is "+user_principal_name)
    connector_call.set('userPrincipalName', user_principal_name)
}

// Department
if(input_clone.hasOwnProperty('department')){
    department = input.get('department')
    log.trace("Department is "+department)
    connector_call.set('department', department)
}

// City
if(input_clone.hasOwnProperty('city')){
    city = input.get('city')
    log.trace("City is "+city)
    connector_call.set('city', city)
}

// Country
if(input_clone.hasOwnProperty('country')){
    country = input.get('country')
    log.trace("Country is "+country)
    connector_call.set('country', country)
}

// Display Name
if(input_clone.hasOwnProperty('display_name')){
    display_name = input.get('display_name')
    log.trace("Display name is "+display_name)
    connector_call.set('displayName ', display_name)
}

// Immutable ID
//This property is used to associate an on-premises Active Directory user account to their Azure AD user object. 
// This property must be specified when creating a new user account in the Graph if you are using a federated domain 
// for the user’s userPrincipalName (UPN) property. The $ and _ characters cannot be used when specifying this property. 
// Requires version 2013-11-08 or newer

if(input_clone.hasOwnProperty('immutable_id')){
    immutable_id = input.get('immutable_id')
    log.trace("Immutable ID is "+immutable_id)
    connector_call.set('immutableId ', immutable_id)
}

// Usage location
if(input_clone.hasOwnProperty('usage_location')){
    usage_location = input.get('usage_location')
    log.trace("Usage location is "+usage_location)
    connector_call.set('usageLocation ', usage_location)
}

// Given Name - First Name
if(input_clone.hasOwnProperty('given_name')){
    given_name = input.get('given_name')
    log.trace("Given name/ first name is "+given_name)
    connector_call.set('givenName', given_name)
}

// Job Title
if(input_clone.hasOwnProperty('job_title')){
    job_title = input.get('job_title')
    log.trace("Job title is "+job_title)
    connector_call.set('jobTitle', job_title)
}

// Mobile
if(input_clone.hasOwnProperty('mobile')){
    mobile = input.get('mobile')
    log.trace("Mobile is "+mobile)
    connector_call.set('mobile', mobile)
}

// Other mails
if(input_clone.hasOwnProperty('other_mails')){
    other_mails = input.get('other_mails')
    log.trace("Other mails is "+other_mails)
    connector_call.set('otherMails', other_mails)
}

// Password Policies
if(input_clone.hasOwnProperty('password_policies')){
    password_policies = input.get('password_policies')
    log.trace("Password policy is "+password_policies)
    connector_call.set('passwordPolicies', password_policies)
}

// Physical Delivery Office Name
if(input_clone.hasOwnProperty('physical_delivery_office_name')){
    physical_delivery_office_name = input.get('physical_delivery_office_name')
    log.trace("Physical Delivery Office Name is "+physical_delivery_office_name)
    connector_call.set('physicalDeliveryOfficeName', physical_delivery_office_name)
}

// Preferred Language
if(input_clone.hasOwnProperty('preferred_language')){
    preferred_language = input.get('preferred_language')
    log.trace("Preferred Language is "+preferred_language)
    connector_call.set('preferredLanguage', preferred_language)
}

// State
if(input_clone.hasOwnProperty('state')){
    state = input.get('state')
    log.trace("state is "+state)
    connector_call.set('state', state)
}

// Street Address
if(input_clone.hasOwnProperty('street_address')){
    street_address = input.get('street_address')
    log.trace("Street address is "+street_address)
    connector_call.set('streetAddress', street_address)
}

// Postal Code
if(input_clone.hasOwnProperty('postal_code')){
    postal_code = input.get('postal_code')
    log.trace("Postal code is "+postal_code)
    connector_call.set('postalCode', postal_code)
}

// On Premises Security Identifier
if(input_clone.hasOwnProperty('on_premise_security_identifier')){
    on_premise_security_identifier = input.get('on_premise_security_identifier')
    log.trace("On Premises Security Identifier is "+on_premise_security_identifier)
    connector_call.set('onPremisesSecurityIdentifier', on_premise_security_identifier)
}

// Object Type
if(input_clone.hasOwnProperty('object_type')){
    object_type = input.get('object_type')
    log.trace("Object type is "+object_type)
    connector_call.set('objectType', object_type)
}

// Surname
if(input_clone.hasOwnProperty('surname')){
    surname = input.get('surname')
    log.trace("Surname is "+surname)
    connector_call.set('surname', surname)
}

// Telephone Number
if(input_clone.hasOwnProperty('telephone_number')){
    telephone_number = input.get('telephone_number')
    log.trace("Telephone Number is "+surname)
    connector_call.set('telephoneNumber', telephone_number)
}

// Facsimile Telephone Number
if(input_clone.hasOwnProperty('facsimile_telephone_number')){
    facsimile_telephone_number = input.get('facsimile_telephone_number')
    log.trace("Facsimile Telephone Number is "+facsimile_telephone_number)
    connector_call.set('facsimileTelephoneNumber', facsimile_telephone_number)
}

// User Type
if(input_clone.hasOwnProperty('user_type')){
    user_type = input.get('user_type')
    log.trace("Facsimile Telephone Number is "+user_type)
    connector_call.set('userType', user_type)
}

// Mail Nickname
if(input_clone.hasOwnProperty('mail_nickname')){
    mail_nickname = input.get('mail_nickname')
    log.trace("Mail nickname is "+mail_nickname)
    connector_call.set('mailNickname', mail_nickname)
}

log.info("Connector request generated. Making connector call.")
connector_call_response = connector_call.sync()


exit_code = connector_call_response.exitcode()
message = connector_call_response.message()

log.trace("Update Azure AD User response: " + connector_call_response)

if (exit_code == 0) {
    log.trace("Exitcode is " + exit_code)
    log.trace("Message: "+message)
    output.set('result', message)

} else {
    log.error("Error: " + message)
    output.set('error', message)
    output.exit(-3, message)
}

log.trace("Finsihed executing 'fb-cloud:azure:operation:update_ad_user.js' flintbit")
