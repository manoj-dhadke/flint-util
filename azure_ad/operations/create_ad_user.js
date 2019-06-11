log.trace("Started executing 'fb-cloud:azure:operation:create_ad_user.js' flintbit")

log.trace("Inputs for 'fb-cloud:azure:operation:create_ad_user.js' :: " + input)
action = "create-user"
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
    connector_name = input.get('connector_name')

}

// Mandatory new user parameters
account_enabled = true
display_name = ""
mail_alias_name = ""
password = ""
force_password_change = true
user_principal_name = ""


// Account Enabled?
if (input_clone.hasOwnProperty('account_enabled')) {
    account_enabled = input.get('account_enabled')
    if (account_enabled != null && account_enabled != "") {
        log.trace("Account Enabled? " + account_enabled)
    } else {
        account_enabled = true
    }
} else {
    account_enabled = true
}

// Display Name
if (input_clone.hasOwnProperty('display_name')) {
    display_name = input.get('display_name')
    if (display_name != null && display_name != "") {
        log.trace("Display name is " + display_name)
    } else {
        log.error("Display name is null or empty")
    }
} else {
    log.error("Display name is not given")
}

// Mail Nickname
if (input_clone.hasOwnProperty('mail_alias_name')) {
    mail_alias_name = input.get('mail_alias_name')
    if (mail_alias_name != null && mail_alias_name != '') {
        log.trace("Mail nickname is " + mail_alias_name)
    } else {
        log.error("Mail alias name is null or empty")
    }
} else {
    log.error("Mail alias name is not given")
}

// Password
if (input_clone.hasOwnProperty('password')) {
    password = input.get('password')
    if (password != null && password != '') {
        log.trace("Password is given")
    } else {
        log.error("Password is null or empty")
    }
} else {
    log.error("Password is not given")
}

// Force password change on login
if (input_clone.hasOwnProperty('force_password_change')) {
    force_password_change = input.get('force_password_change')
    if (force_password_change != null && force_password_change != "") {
        log.trace("Force password change on login? " + force_password_change)
    } else {
        force_password_change = true
    }
} else {
    force_password_change = true
}

// User Principal Name
if (input_clone.hasOwnProperty('user_principal_name')) {
    user_principal_name = input.get('user_principal_name')
    if (user_principal_name != null && user_principal_name != "") {
        log.trace("User Principal name is " + user_principal_name)
    } else {
        log.error("User principal name is null or empty")
    }
} else {
    log.error("User principal name is not given")
}

// Azure AD Domain
if (input_clone.hasOwnProperty('active_directory_domain')) {
    active_directory_domain = input.get('active_directory_domain')
    if (active_directory_domain != null && active_directory_domain != "") {
        log.trace("Azure AD domain is " + active_directory_domain)
    } else {
        log.error("Active directory domain is null or empty")
    }
} else {
    log.error("Active directory domain is not given")
}

log.trace("Calling MS Azure connector for action: " + action)
connector_call = call.connector(connector_name)
    .set('action', action)
    .set('client-id', client_id)
    .set('tenant-id', tenant_id)
    .set('key', key)
    .set('subscription-id', subscription_id)
    .set('accountEnabled', account_enabled)
    .set('displayName', display_name)
    .set('mailNickname', mail_alias_name)
    .set('password', password)
    .set('forceChangePasswordNextLogin', force_password_change)
    .set('userPrincipalName', user_principal_name)
    .set('active-directory-domain', active_directory_domain)
    .timeout(120000)

// Optional parameters
// Department
department = ""
if (input_clone.hasOwnProperty('department')) {
    department = input.get('department')
    if (department != null || department != "") {
        department = input.get('department')
        log.trace("Department is " + department)
        connector_call.set('department', department)
    }
}
// Given Name - First Name
given_name = ""
if (input_clone.hasOwnProperty('given_name')) {
    given_name = input.get('given_name')

    given_name = input.get('given_name')
    log.trace("Given name/ first name is " + given_name)
    connector_call.set('givenName', given_name)

}
// Job Title
job_title = ""
if (input_clone.hasOwnProperty('job_title')) {
    job_title = input.get('job_title')

    if (job_title != null || job_title != "") {
        job_title = input.get('job_title')
        log.trace("Job title is " + job_title)
        connector_call.set('jobTitle', job_title)
    }
}
// Mobile
mobile = ""
if (input_clone.hasOwnProperty('mobile')) {
    mobile = input.get('mobile')

    if (mobile != null || mobile != "") {

        mobile = input.get('mobile')
        log.trace("Mobile is " + mobile)
        connector_call.set('mobile', mobile)
    }
}
// Other mails
other_mails = ""
if (input_clone.hasOwnProperty('other_mails')) {
    other_mails = input.get('other_mails')

    if (other_mails != null || other_mails != "") {

        other_mails = input.get('other_mails')
        log.info("Other mails check >> " + other_mails.search(','))
        if (other_mails.search(',') != -1) {
            other_mails = other_mails.split(',')
            log.trace("Other mails is " + other_mails)
            connector_call.set('otherMails', other_mails)
        } else {
            other_mails = [other_mails]
            connector_call.set('otherMails', other_mails)
        }
    }
}
// Password Policies
password_policies = ""
if (input_clone.hasOwnProperty('password_policies')) {
    password_policies = input.get('password_policies')

    if (password_policies != null || password_policies != "") {

        password_policies = input.get('password_policies')
        log.trace("Password policy is " + password_policies)
        connector_call.set('passwordPolicies', password_policies)
    }
}
// Physical Delivery Office Name
physical_delivery_office_name = ""
if (input_clone.hasOwnProperty('physical_delivery_office_name')) {
    physical_delivery_office_name = input.get('physical_delivery_office_name')

    if (physical_delivery_office_name != null || physical_delivery_office_name != "") {

        physical_delivery_office_name = input.get('physical_delivery_office_name')
        log.trace("Physical Delivery Office Name is " + physical_delivery_office_name)
        connector_call.set('physicalDeliveryOfficeName', physical_delivery_office_name)
    }
}
// Preferred Language
preferred_language = ""
if (input_clone.hasOwnProperty('preferred_language')) {
    preferred_language = input.get('preferred_language')

    if (preferred_language != null || preferred_language != "") {

        preferred_language = input.get('preferred_language')
        log.trace("Preferred Language is " + preferred_language)
        connector_call.set('preferredLanguage', preferred_language)
    }
}
// Street Address
street_address = ""
if (input_clone.hasOwnProperty('street_address')) {
    street_address = input.get('street_address')

    if (street_address != null || street_address != "") {

        street_address = input.get('street_address')
        log.trace("Street address is " + street_address)
        connector_call.set('streetAddress', street_address)
    }
}
// Postal Code
postal_code = ""
if (input_clone.hasOwnProperty('postal_code')) {
    postal_code = input.get('postal_code')

    if (postal_code != null || postal_code != "") {

        postal_code = input.get('postal_code')
        log.trace("Postal code is " + postal_code)
        connector_call.set('postalCode', postal_code)
    }
}
// On Premises Security Identifier
on_premise_security_identifier = ""
if (input_clone.hasOwnProperty('on_premise_security_identifier')) {
    on_premise_security_identifier = input.get('on_premise_security_identifier')

    if (on_premise_security_identifier != null || on_premise_security_identifier != "") {

        on_premise_security_identifier = input.get('on_premise_security_identifier')
        log.trace("On Premises Security Identifier is " + on_premise_security_identifier)
        connector_call.set('onPremisesSecurityIdentifier', on_premise_security_identifier)
    }
}
// Object Type
object_type = ""
if (input_clone.hasOwnProperty('object_type')) {
    object_type = input.get('object_type')

    if (object_type != null || object_type != "") {

        object_type = input.get('object_type')
        log.trace("Object type is " + object_type)
        connector_call.set('objectType', object_type)
    }
}
// Surname
surname = ""
if (input_clone.hasOwnProperty('surname')) {
    surname = input.get('surname')

    if (surname != null || surname != "") {

        surname = input.get('surname')
        log.trace("Surname is " + surname)
        connector_call.set('surname', surname)
    }
}
// Email
email = ""
if (input_clone.hasOwnProperty('Email')) {
    email = input.get('Email')

    if (email != null || email != "") {

        email = input.get('Email')
        log.trace("Email is " + email)
        connector_call.set('Email', email)
    }
}

log.info("Connector request generated. Making connector call.")
connector_call_response = connector_call.sync()


exit_code = connector_call_response.exitcode()
message = connector_call_response.message()

log.trace("New Azure AD User creation response: " + connector_call_response)

if (exit_code == 0) {
    log.trace("Exitcode is " + exit_code)
    // message = JSON.parse(message)
    log.trace("Message: " + message)
    output.set('result', JSON.parse(connector_call_response))

} else {
    log.error("Error: " + message)
    output.set('error', message)
    output.exit(-3, message)
}

log.trace("Finsihed executing 'fb-cloud:azure:operation:create_ad_user.js' flintbit")