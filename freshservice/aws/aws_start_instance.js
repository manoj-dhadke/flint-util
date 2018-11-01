/**
** Creation Date: 31 October 2018
** Summary: This is Start AWS instance service flintbit.
** Description: This flintbit is developed to start an AWS instance after receiving request from Freshserver.
**/
log.trace("Started executing flint-util:freshservice:aws:aws_start_instance.js flintbit.")
log.info("Input parameters........::  " + input)
try {
    // Get Flint Job ID
    flint_job_id = input.jobid()
    log.info("Job Id " + flint_job_id)
    aws_connector_name = input.get('aws_connector_name')
    access_key = input.get('access-key')
    security_key = input.get('security-key')
    region = input.get('region')
    instance_id = input.get("instance-id")
    // Service ID/ Ticket ID
    ticket_id = input.get('ticket_id')
    log.info("Ticket ID " + ticket_id)
    log.info("Instance id " + instance_id)
    domain_name = input.get('domain_name')
    email = input.get('email')
    password = input.get('password')
    status = input.get('status')
    freshservice_connector_name = input.get('freshservice_connector_name')
    ticket_type = input.get('ticket_type')
    private_note = input.get('private_note')
    // Inputs for creating notes
    acknowledgement_body = "Flint acknowledged request for 'Start AWS instance'  and automation has been initiated for Job ID (" + flint_job_id + ")"
    // Add service acknowledgement note
    flintbit_call_response = call.bit("flint-util:freshservice:add_note.js")
        .set('domain_name', domain_name)
        .set('email', email)
        .set('password', password)
        .set('private_note', private_note)
        .set('body', acknowledgement_body)
        .set('connector_name', freshservice_connector_name)
        .set('ticket_id', ticket_id)
        .set('ticket_type', ticket_type)
        .sync()
    log.trace("First Add note call is done")
    first_note_exitcode = flintbit_call_response.get("exit-code")
    first_note_response_message = flintbit_call_response.get("message")
    log.trace(first_note_response_message)
    log.trace(first_note_exitcode)
    if (first_note_exitcode == 0) {
        log.trace(input)
        start_aws_flintbit_call_response = call.bit("fb-cloud:aws-ec2:operation:start_instance.rb")
            .set("connector_name", aws_connector_name)
            .set("access-key", access_key)
            .set("security-key", security_key)
            .set("region", region)
            .set("instance-id", instance_id)
            .set('timeout', 60000)
            .sync()
        // Getting exit-code for start instance flinbit call
        start_instance_exit_code = start_aws_flintbit_call_response.get("exit-code")
        start_instance_response_message = start_aws_flintbit_call_response.get("message")
        // Final note body
        final_body = "Service request is completed by Flint. Marked service request as resolved.\n Instance ID: " + instance_id
        user_message = "<b>Flint Automation:</b>  Started AWS instance successfully. <br><b>Instance ID:</b> " + instance_id
        if (start_instance_exit_code == 0) {
            // Set service status
            update_ticket_call_response = call.bit('flint-util:freshservice:update_ticket.js')
                .set('domain_name', domain_name)
                .set('email', email)
                .set('password', password)
                .set('status', status)
                .set('connector_name', freshservice_connector_name)
                .set('ticket_id', ticket_id)
                .set('ticket_type', ticket_type)
                .sync()
            // Get Service status response message
            update_ticket_response_message = update_ticket_call_response.get("message")
            log.trace(update_ticket_response_message)
            // Add note after instance is started
            second_flintbit_call_response = call.bit("flint-util:freshservice:add_note.js")
                .set('domain_name', domain_name)
                .set('email', email)
                .set('password', password)
                .set('private_note', private_note)
                .set('body', final_body)
                .set('connector_name', freshservice_connector_name)
                .set('ticket_id', ticket_id)
                .set('ticket_type', ticket_type)
                .sync()
            second_note_response_message = second_flintbit_call_response.get("message")
            log.trace(second_note_response_message)
            // Setting user message (will be visible on CMP)
            output.set('exit-code', 0).set('user_message', user_message)
        } else {
            log.error("Unable to start AWS instance : " + start_instance_response_message)
        }
    } else {
        log.error("Unable to start note : " + first_note_response_message)
    }
} catch (error) {
    log.error("Error : " + error)
}
log.trace("Finished executing flint-util:freshservice:aws:aws_start_instance.js flintbit.")