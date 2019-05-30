/**
** Creation Date: 19th April 2019
** Summary: Create New Okta User. 
** Description: This flintbit is developed to create a new user on Okta.
**/

log.info("Started executing 'example:create_user.js' flintbit")

log.trace("Flintbit Inputs: \n"+input)
input_clone = JSON.parse(input)

// Check if request is coming from freshservice
if(input_clone.hasOwnProperty('fw_subdomain') || input_clone.hasOwnProperty('fw_account_id')){
    log.info("Input context is "+input.context())
    body = {
        "input" : input,
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

action = 'create-user'

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

log.trace("Setting Okta Connector Inputs")

first_name = input.get('first_name')
last_name = input.get('last_name')
email = input.get('email')

connector_request = call.connector(connector_name)
                        .set('organization_url',organization_url)
                        .set('api_token', api_token)
                        .set('action', action)
                        .set('first_name', first_name)
                        .set('last_name', last_name)
                        .set('email', email)

// JSON parse input
input_clone = JSON.parse(input)

// Optional parameters check and connector request building
log.trace("Setting optional input params to connector. If given.")
// Password
if(input_clone.hasOwnProperty('password') && input_clone['password'] != null && input_clone['password'] != ''){
    password = input.get('password')
    connector_request.set('password', password)
    log.trace('Password is set: '+password)
}

// Group ID Array
if(input_clone.hasOwnProperty('group_id_set') && input_clone['group_id_set'] != null && input_clone['group_id_set'] != ''){
    group_id_set = input.get('group_id_set')
    connector_request.set('group_id_set', group_id_set)
    log.trace('Set of group IDs to assign the user to (array): '+group_id_set)
}

// Profile properties Json
if(input_clone.hasOwnProperty('profile_properties') && input_clone['profile_properties'] != null && input_clone['profile_properties'] != '' && input_clone['profile_properties'] != {}){
    profile_properties = input.get('profile_properties')
    connector_request.set('profile_properties', profile_properties)
    log.trace('Profile properties (json)'+profile_properties)
}

// User Active?
if(input_clone.hasOwnProperty('is_active') && input_clone['is_active'] != null && input_clone['is_active'] != ''){
    is_active = input.get('is_active')
    if(is_active == "true"){
        is_active = true
    }else{
        is_active = false
    }
    connector_request.set('is_active', is_active)
    log.trace('Make user active?: '+is_active)
}

// Next login boolean
if(input_clone.hasOwnProperty('is_next_login') && input_clone['is_next_login'] != null && input_clone['is_next_login'] != ''){
    is_next_login = input.get('is_next_login')
    if(is_next_login == "true"){
        is_next_login = true
    }else{
        is_next_login = false
    }
    connector_request.set('is_next_login', is_next_login)
    log.trace('Reset password on next login?: '+is_next_login)
}

// Is user Provider? boolean
if(input_clone.hasOwnProperty('is_provider') && input_clone['is_provider'] != null && input_clone['is_provider'] != ''){
    is_provider = input.get('is_provider')
    if(is_provider == "true"){
        is_provider = true
    }else{
        is_provider = false
    }
    connector_request.set('is_provider', is_provider)
    log.trace('User is provider?: '+is_provider)
}

// Security question
if(input_clone.hasOwnProperty('security_question') && input_clone['security_question'] != null && input_clone['security_question'] != ''){
    security_question = input.get('security_question')
    connector_request.set('security_question', security_question)
    log.trace('Security question: '+security_question)
}

// Security Questions Answer
if(input_clone.hasOwnProperty('security_question_answer') && input_clone['security_question_answer'] != null && input_clone['security_question_answer'] != ''){
    security_question_answer = input.get('security_question_answer')
    connector_request.set('security_question_answer', security_question_answer)
    log.trace('Security questions answer is given')
}

// Second Email
if(input_clone.hasOwnProperty('second_email') && input_clone['second_email'] != null && input_clone['second_email'] != ''){
    second_email= input.get('second_email')
    connector_request.set('second_email', second_email)
    log.trace('Second Email is given: '+second_email)
}

// Login
if(input_clone.hasOwnProperty('login') && input_clone['login'] != null && input_clone['login'] != ''){
    login = input.get('login')
    connector_request.set('login', login)
    log.trace('Login is given: '+login)
}

// Phone
if(input_clone.hasOwnProperty('phone') && input_clone['phone'] != null && input_clone['phone'] != ''){
    phone = input.get('phone')
    connector_request.set('phone', phone)
    log.trace('Phone is given: '+phone)
}

log.trace("Calling Okta connector")
connector_response = connector_request.sync()

log.trace(connector_response)
exit_code = connector_response.exitcode()
message = connector_response.message()

if(exit_code == 0){
    log.trace("Successfully created an user Okta")
    log.trace("Message: "+message)
    result = connector_response.get('result')
    output.set('result', result)
}else{
    message = message.split('(')[1].split(')')[0]
    log.trace("Failed to create user: "+message)
    output.set('error', message)
    output.exit(-1, message)
}

log.info("Finished executing 'example:create_user.js' flintbit")