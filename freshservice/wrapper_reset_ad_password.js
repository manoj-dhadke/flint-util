// Inputs:
// 1. Login username from freshservice desk
// 2. common connect vars (target,username,password, from service config)

try{
    // WINRM INPUTS
    target = input.get('target')
    target_username = input.get('target_username')
    target_password = input.get('target_password')
    winrm_connector_name = input.get('winrm_connector_name')

    // FRESHSERVICE INPUTS: 
    // Service ID/ Ticket ID
    ticket_id = input.get('freshdesk_webhook.ticket_id')

    // TOD Input
    // ticket_id = input.get('ticket_id')

    ticket_id = ticket_id.replace(/^\D+/g, '')
    log.info(ticket_id)

    // Ticket service item fields to parsed FRESHSERVICE
    ticket_service_item_fields = input.get('freshdesk_webhook.ticket_service_item_fields')

    // TOD input
    //  ticket_service_item_fields = input.get('ticket_service_item_fields')

    // Parse the service item fields by calling flintbit
    parse_flintbit_call_response = call.bit('flint-util:freshservice:extract_sr_items_fields.groovy')
        .set('ticket_service_item_fields', ticket_service_item_fields)
        .sync()

    
    // LOGIN NAME
    // Get employee login name from the response of freshservice extract_sr_items_fields
    login_name = parse_flintbit_call_response.get('data').get('Employee Login Name')

    // TOD input
    // login_name = input.get('login_name')

    // Inputs for setting service status FRESHSERVICE
    domain_name = input.get('domain_name')
    email = input.get('email')
    password = input.get('password')
    status = input.get('status')
    freshservice_connector_name = input.get('freshservice_connector_name')
    ticket_type = input.get('ticket_type')


    // Inputs for creating notes
    acknowledgement_body = "Flint Automation: Resetting AD password for user: "+login_name

    final_body = "Flint Automation: Password has been successfully reset for active directory user: "+login_name+"\n Use the password 'Infiverve@123' to login. You can reset the password at first logon"
    private_note = input.get('private_note')

    // User message definition
    user_message =  "<b>Flint Automation:</b> Password has been successfully reset for active directory user: "+login_name+"<br>Use the password 'Infiverve@123' to login. You can reset the password at first logon"

    // Log freshservice inputs
    log.info("Ticket ID " + ticket_id)
    log.info("AD user login name " + login_name)



    // ===================================== INPUTS DONE. FLINTBIT CALLS START HERE ===========================================================//

    // Add service acknowledgement note: 8 inputs
    flintbit_call_response = call.bit("flint-util:freshservice:add_note.js")
    .set('domain_name', domain_name)
    .set('email', email)
    .set('password', password)
    .set('private_note',private_note)
    .set('body', acknowledgement_body)
    .set('connector_name',freshservice_connector_name)
    .set('ticket_id',ticket_id)
    .set('ticket_type',ticket_type)
    .sync()

    log.trace("First Add note call is done")
    // Getting exit code of FIRST add note flintbit from its response            
    first_note_exitcode = flintbit_call_response.get("exit-code")

    //Getting flintbit response message
    first_note_response_message = flintbit_call_response.get("message")
    log.trace(first_note_response_message)
    log.trace(first_note_exitcode)


    // If exit-code for that add_note flintbit call is 0...
    if(first_note_exitcode == 0){
        log.trace(input)

        // Flintbit call to reset_ad_password: 4 inputs
        reset_flintbit_call_response = call.bit('flint-util:ad-winrm:reset_ad_password.js')
                                       .set('target', target)
                                       .set('target_username', target_username)
                                       .set('target_password', target_password)
                                       .set('login_name', login_name)
                                       .sync()

        reset_exit_code = reset_flintbit_call_response.get("exit-code")
        reset_message = reset_flintbit_call_response.get("message")

        if(reset_exit_code == 0){
            log.trace("Exit-code: "+reset_exit_code)
            log.trace("Reset AD Password flintbit executed successfully. \n Message: "+reset_message)

             // Set SERVICE STATUS..
             update_ticket_call_response = call.bit('flint-util:freshservice:update_ticket.js')
             .set('domain_name', domain_name)
             .set('email',email)
             .set('password', password)
             .set('status', status)
             .set('connector_name', freshservice_connector_name)
             .set('ticket_id', ticket_id)
             .set('ticket_type', ticket_type)
             .sync()

            // Get Service status response message
            update_ticket_response_message = update_ticket_call_response.get("message")
            log.trace(update_ticket_response_message)


            // Add note after AD password is reset
           second_flintbit_call_response =  call.bit("flint-util:freshservice:add_note.js")
           .set('domain_name', domain_name)
           .set('email', email)
           .set('password', password)
           .set('private_note',private_note)
           .set('body',final_body)
           .set('connector_name',freshservice_connector_name)
           .set('ticket_id',ticket_id)
           .set('ticket_type',ticket_type)
           .sync()

           second_note_response_message =  second_flintbit_call_response.get("message")
           log.trace(second_note_response_message)

           // Setting user message - will be displayed on the Flint CMP in Service Requests
           output.set('user_message', user_message)

        }else{
            log.error("Unable to reset password: "+reset_message)
        }
        output.set('exit-code', first_note_exitcode)
    }else{
        log.error("Unable to create acknowledgement note: "+first_note_response_message)
    }

    // Setting user message
}catch(error){
    log.error(error)
}