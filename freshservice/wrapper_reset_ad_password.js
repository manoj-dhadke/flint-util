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
** Creation Date: 23th August 2018
** Summary: This is Reset Active Directory User Password flintbit.
** Description: This flintbit is developed to reset AD user password after receiving service request from Freshserver.
**/

log.trace("Started executing flint-util:freshservice:wrapper_reset_ad_password.js flintbit.")
try{
    // Get Flint Job ID
    flint_job_id = input.jobid()

    // WinRM Inputs
    target = input.get('target')
    target_username = input.get('target_username')
    target_password = input.get('target_password')
    winrm_connector_name = input.get('winrm_connector_name')

    // Service ID/ Ticket ID
    ticket_id = input.get('freshdesk_webhook.ticket_id')
    ticket_id = ticket_id.replace(/^\D+/g, '')
    log.info(ticket_id)

    // Ticket service item fields to parsed
    ticket_service_item_fields = input.get('freshdesk_webhook.ticket_service_item_fields')

    // Parse the service item fields by calling flintbit
    parse_flintbit_call_response = call.bit('flint-util:freshservice:extract_sr_items_fields.groovy')
                                       .set('ticket_service_item_fields', ticket_service_item_fields)
                                       .sync()

    // Get employee login name from the response of freshservice extract_sr_items_fields
    login_name = parse_flintbit_call_response.get('data').get('Employee Login Name')

    // Inputs for setting service status
    domain_name = input.get('domain_name')
    email = input.get('email')
    password = input.get('password')
    status = input.get('status')
    freshservice_connector_name = input.get('freshservice_connector_name')
    ticket_type = input.get('ticket_type')

    // Inputs for creating notes
    acknowledgement_body = "Service request acknowledged and AD password reset initiated by Flint job id - ("+flint_job_id+")"
    final_body = "Service request is now resolved by Flint. Use 'Welcome@123' as new password. You may change password after first login."
    private_note = input.get('private_note')

    // User message definition
    user_message =  "<b>Flint Automation:</b> Password has been successfully reset for active directory user: "+login_name+"<br>Use the password 'Welcome@123' to login. You can reset the password at first logon"

    // Add service acknowledgement note
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
    first_note_exitcode = flintbit_call_response.get("exit-code")
    first_note_response_message = flintbit_call_response.get("message")
    log.trace(first_note_response_message)
    log.trace(first_note_exitcode)

    // If exit-code for that add_note flintbit call is 0
    if(first_note_exitcode == 0){
        log.trace(input)
        // Flintbit call to reset_ad_password
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

            // Set service status
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
            no_user_body = "Service request could not be completed by Flint.\n Active Directory user "+ login_name +" does not exist."
            reset_message_trim = reset_message.split(' ').slice(0,6).join(' ');

            if(reset_message_trim == "Cannot find an object with identity:"){
                
                 // Add note when AD user does not exist
                third_flintbit_call_response =  call.bit("flint-util:freshservice:add_note.js")
                                                     .set('domain_name', domain_name)
                                                     .set('email', email)
                                                     .set('password', password)
                                                     .set('private_note',private_note)
                                                     .set('body', no_user_body)
                                                     .set('connector_name',freshservice_connector_name)
                                                     .set('ticket_id',ticket_id)
                                                     .set('ticket_type',ticket_type)
                                                     .sync()

                third_note_response_message = third_flintbit_call_response.get("message")
                log.trace("Third note added: "+third_note_response_message)              
            }
            log.error("Unable to reset password: "+reset_message)
        }
        output.set('exit-code', first_note_exitcode)
    }else{
        log.error("Unable to create acknowledgement note: "+first_note_response_message)
    }
}catch(error){
    log.error(error)
}
log.trace("Finished executing flint-util:freshservice:wrapper_reset_ad_password.js flintbit.")
