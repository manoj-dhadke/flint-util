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
** Creation Date: 31 October 2018
** Summary: This is Delete Azure Resource Group service flintbit.
** Description: This flintbit is developed to delete Azure resource group after receiving request from Freshserver.
**/

log.trace("Started executing flint-util:freshservice:azure:azure_delete_resource_group.js flintbit.")
log.info("Input parameters........::  " + input)
try {
    // Get Flint Job ID
    flint_job_id = input.jobid()
    log.info("Job Id " + flint_job_id)
    azure_connector_name = input.get('azure_connector_name')
    resource_group_name = input.get('resource-group-name')
    key = input.get('key')
    tenant_id = input.get('tenant-id')
    subscription_id = input.get('subscription-id')
    client_id = input.get('client-id')
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
    acknowledgement_body = "Flint acknowledged request for 'Deleting resource group'  and automation has been initiated for Job ID (" + flint_job_id + ")"
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
        delete_azure_flintbit_call_response = call.bit("fb-cloud:azure:operation:delete_resource_group.rb")
                                                  .set('connector_name', azure_connector_name)
                                                  .set('tenant-id', tenant_id)
                                                  .set('subscription-id', subscription_id)
                                                  .set('key', key)
                                                  .set('client-id', client_id)
                                                  .set('resource-group-name', resource_group_name)
                                                  .sync()
        // Getting exit-code for delete resource group instance flinbit call
        delete_group_exit_code = delete_azure_flintbit_call_response.get("exit-code")
        delete_group_response_message = delete_azure_flintbit_call_response.get("message")
        // Final note body
        final_body = "Service request is completed by Flint. Marked service request as resolved.\n Group Name: " + resource_group_name
        user_message = "<b>Flint Automation:</b>  Deleted Azure resource group successfully. <br><b>Group Name:</b> " + resource_group_name
        if (delete_group_exit_code == 0) {
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
            log.error("Unable to delete resource group : " + delete_group_response_message)
        }
    } else {
        log.error("Unable to delete note : " + first_note_response_message)
    }
} catch (error) {
    log.error("Error : " + error)
}
log.trace("Finished executing flint-util:freshservice:azure:azure_delete_resource_group.js flintbit.")
