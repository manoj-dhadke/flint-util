/*************************************************************************
 * 
 * INFIVERVE TECHNOLOGIES PTE LIMITED CONFIDENTIAL
 * __________________
 * 
 * (C) INFIVERVE TECHNOLOGIES PTE LIMITED, SINGAPORE
 * All Rights Reserved.
 * Product / Project: Flint IT Automation Platform
 * NOTICE:  All information contained herein is, and remains
 * the property of INFIVERVE TECHNOLOGIES PTE LIMITED.
 * The intellectual and technical concepts contained
 * herein are proprietary to INFIVERVE TECHNOLOGIES PTE LIMITED.
 * Dissemination of this information or any form of reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from INFIVERVE TECHNOLOGIES PTE LIMITED, SINGAPORE.
 */

/**
** Creation Date: 2 November 2018
** Summary: This is GCP Delete Instance service flintbit.
** Description: This flintbit is developed to delete GCP instance after receiving request from Freshserver.
**/

log.trace("Started executing flint-util:freshservice:gcp:gcp_delete_instance.js flintbit.")
log.info("Input parameters........::  " + input)
try {
    // Get Flint Job ID
    flint_job_id = input.jobid()
    log.info("Job Id " + flint_job_id)
    gcp_connector_name = input.get('gcp_connector_name')        
    project_id = input.get('project-id')                                        // project-id of the google cloud-platform 
    zone_name = input.get('zone-name')                                          // zone-name of the project id
    service_account_credenetials = input.get('service-account-credentials')     //service account credentials as json for the given project-id
    instance_name = input.get('instance-name') 
    // Service ID/ Ticket ID
    ticket_id = input.get('ticket_id')
    log.info("Ticket ID " + ticket_id)
    domain_name = input.get('domain_name')
    email = input.get('email')
    password = input.get('password')
    status = input.get('status')
    freshservice_connector_name = input.get('freshservice_connector_name')
    ticket_type = input.get('ticket_type')
    private_note = input.get('private_note')
    // Inputs for creating notes
    acknowledgement_body = "Flint acknowledged request for 'Deleting GCP instance'  and automation has been initiated for Job ID (" + flint_job_id + ")"
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
        delete_gcp_flintbit_call_response = call.bit("fb-cloud:google-cloud:operation:delete_instance.groovy")
                                                .set('connector_name', gcp_connector_name)
                                                .set('project-id', project_id)
                                                .set('zone-name', zone_name)
                                                .set('service-account-credentials', service_account_credenetials)
                                                .set('instance-name', instance_name)
                                                .set('timeout', 60000)
                                                .sync()
        // Getting exit-code for delete resource group instance flinbit call
        delete_instance_exit_code = delete_gcp_flintbit_call_response.get("exit-code")
        delete_instance_response_message = delete_gcp_flintbit_call_response.get("message")
        // Final note body
        final_body = "Service request is completed by Flint. Marked service request as resolved.\n Instance Name: " + instance_name
        user_message = "<b>Flint Automation:</b>  Deleted GCP instance successfully. <br><b>Instance Name:</b> " + instance_name
        if (delete_instance_exit_code == 0) {
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
            // Add note after resource group is deleted
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
            log.error("Unable to delete instance : " + delete_instance_response_message)
        }
    } else {
        log.error("Unable to delete note : " + first_note_response_message)
    }
} catch (error) {
    log.error("Error : " + error)
}
log.trace("Finished executing flint-util:freshservice:gcp:gcp_delete_instance.js flintbit.")
