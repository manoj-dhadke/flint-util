/**
** Creation Date: 9th April 2019
** Summary: Create OneLogin User. 
** Description: This flintbit is developed to create a OneLogin user.
**/

log.info("Started executing 'example:create_user.js' flintbit")

log.info("Inputs: \n" + input)

input_clone = JSON.parse(input)

result = ""

// Service parameters
onelogin_config = input.get('onelogin_configurations')
client_id = onelogin_config.get('client_id')
client_secret = onelogin_config.get('client_secret')
connector_name = onelogin_config.get('connector_name')

// Generic flintbit action
action = 'create-user'

// Create User Params
region = input.get('region')
first_name = input.get('first_name')
last_name = input.get('last_name')
email = input.get('email')
username = input.get('username')

log.trace("Calling OneLogin connector")

response = call.connector(connector_name)
    .set('client_id', client_id)
    .set('client_secret', client_secret)
    .set('region', region)
    .set('action', action)
    .set('firstname', first_name)
    .set('lastname', last_name)
    .set('email', email)
    .set('username', username)

// Setting optional parameter to OneLogin connector
if (input_clone.hasOwnProperty('company')) {
    company = input.get('company')
    if (company != null || company != "") {
        response.set('company', company)
        log.trace("Company is " + company)
    }
}
if (input_clone.hasOwnProperty('department')) {
    department = input.get('department')
    if (department != null || department != "") {
        response.set('department', department)
        log.trace("Department is " + department)
    }
}

if (input_clone.hasOwnProperty('directory_id')) {
    directory_id = input.get('directory_id')   // Integer 
    // directory_id = parseInt(directory_id) 

    if (directory_id != null || directory_id != "") {
        response.set('directory_id', directory_id)
        log.trace("Directory Id is " + directory_id)
    }
}

if (input_clone.hasOwnProperty('distinguished_name')) {
    distinguished_name = input.get('distinguished_name')

    if (distinguished_name != null || distinguished_name != "") {
        response.set('distinguished_name', distinguished_name)
        log.trace("Distinguished Name is " + distinguished_name)
    }
}

if (input_clone.hasOwnProperty('external_id')) {
    external_id = input.get('external_id')

    if (external_id != null || external_id != "") {
        response.set('external_id', external_id)
        log.trace("External ID is " + external_id)
    }
}

if (input_clone.hasOwnProperty('group_id')) {
    group_id = input.get('group_id')           // Integer
    // group_id = parseInt(group_id)

    if (group_id != null || group_id != "") {
        response.set('group_id', group_id)
        log.trace("Group ID is " + group_id)
    }
}

if (input_clone.hasOwnProperty('invalid_login_attempts')) {
    invalid_login_attempts = input.get('invalid_login_attempts') // Integer
    // invalid_login_attempts = parseInt(invalid_login_attempts)

    if (invalid_login_attempts != null || invalid_login_attempts != "") {
        response.set('invalid_login_attempts', invalid_login_attempts)
        log.trace("Inalid login attempts are set to " + invalid_login_attempts)
    }
}

if (input_clone.hasOwnProperty('locale_code')) {
    locale_code = input.get('locale_code')

    if (locale_code != null || locale_code != "") {
        response.set('locale_code', locale_code)
        log.trace("Locale code is " + locale_code)
    }
}

if (input_clone.hasOwnProperty('member_of')) {
    member_of = input.get('member_of')

    if (member_of != null || member_of != "") {
        response.set('member_of', member_of)
        log.trace("Member of " + member_of)
    }
}

if (input_clone.hasOwnProperty('openid_name')) {
    openid_name = input.get('openid_name')

    if (openid_name != null || openid_name != "") {
        response.set('openid_name', openid_name)
        log.trace("OpenID Name is " + openid_name)
    }
}

if (input_clone.hasOwnProperty('phone')) {
    phone = input.get('phone')

    if (phone != null || phone != "") {
        response.set('phone', phone)
        log.trace("Phone is " + phone)
    }
}

if (input_clone.hasOwnProperty('sam_account_name')) {
    samaccountname = input.get('sam_account_name')

    if (samaccountname != null || samaccountname != "") {
        response.set('samaccountname', samaccountname)
        log.trace("Sam Account Name is " + samaccountname)
    }
}

if (input_clone.hasOwnProperty('title')) {
    title = input.get('title')

    if (title != null || title != "") {
        response.set('title', title)
        log.trace("Title is " + title)
    }
}

// Calling OneLogin Connector
connector_response = response.sync()

log.trace(connector_response)
exit_code = connector_response.exitcode()
message = connector_response.message()

if (exit_code == 0) {
    result = connector_response.get('created-user')
    log.trace("Created user details are : " + result)
    output.set('result', result)
} else {
    log.trace("Failed to create user: " + message)
    output.set('error', message)
}

log.info("Finished executing 'example:create_user.js' flintbit")