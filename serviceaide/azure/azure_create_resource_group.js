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

log.trace("Started executing 'fb-cloud:azure:operation:create_resource_group.rb' flintbit...")
try {
    // Flintbit Input Parameters
    // Mandatory
    connector_name = input.get('connector_name')
    region = input.get('region')
    group_name = input.get('group-name')
    action = 'create-resource-group'
    // Optional
    request_timeout = input.get('timeout')
    key = input.get('key')
    tenant_id = input.get('tenant-id')
    subscription_id = input.get('subscription-id')
    client_id = input.get('client-id')
    // ServiceAide ticket Id
    ticket_id = input.get("ticket_id")
    flint_job_id = input.jobid()
    log.info("Job-id:" + flint_job_id)
    // Worklog messages to update worklog at ServiceAide ticket
    work_description_ack = "Flint has recieved Ticket Id " + ": " + ticket_id + " " + "and is trying to resolve it. \nFlint Job-Id : " + " " + flint_job_id
    work_description = "Ticket Id : " + ticket_id + " " + "\nAzure resource group has been created successfully with name: "+group_name
    // Call flintbit to add initial worklog
    add_serviceaide_worklog = call.bit("flint-util:serviceaide:servicerequest:service_request_add_worklog.groovy")
                                .set("ticket_id", ticket_id)
                                .set("work_description", work_description_ack)
                                .sync()
    flintbit_response = call.bit("fb-cloud:azure:operation:create_resource_group.rb")
                            .set('connector_name', connector_name)
                            .set('action', action)
                            .set('tenant-id', tenant_id)
                            .set('subscription-id', subscription_id)
                            .set('key', key)
                            .set('client-id', client_id)
                            .set('group-name', group_name)
                            .set('region', region)
                            .set('timeout', 120000)
                            .sync()
    // Azure Connector Response Meta Parameters
    response_exitcode = flintbit_response.exitcode()	// Exit status code
    response_message = flintbit_response.message()	// Execution status messages
    error_message = flintbit_response.get("error")
    if (response_exitcode == 0) {
        update_serviceaide_status = call.bit("flint-util:serviceaide:servicerequest:service_request_update_status.groovy")
            .set("ticket_id", ticket_id)
            .sync()
        log.info("Status response:: " + update_serviceaide_status)

        if (update_serviceaide_status.exitcode() == 0) {
            add_serviceaide_worklog = call.bit("flint-util:serviceaide:servicerequest:service_request_add_worklog.groovy")
                .set("ticket_id", ticket_id)
                .set("work_description", work_description)
                .sync()
        }
        else {
            log.info("Failed to update ticket status")
        }
    }
    else {
        work_description_fail = "Error occured while executing ticket" + " " + ticket_id + ". " + "The error occured due to" + " " + error_message
        update_serviceaide_status = call.bit("flint-util:serviceaide:servicerequest:service_request_update_error_status.groovy")
            .set("ticket_id", ticket_id)
            .sync()
        if (update_serviceaide_status.exitcode() == 0) {
            add_serviceaide_worklog = call.bit("flint-util:serviceaide:servicerequest:service_request_add_error_worklog.groovy")
                .set("ticket_id", ticket_id)
                .set("work_description", work_description_fail)
                .sync()
        } else {
            log.info("Failed to update ticket status")
        }
    }
}
catch (error) {
    log.error("Error : " + error)
}
log.trace("Finished executing 'fb-cloud:azure:operation:create_resource_group.rb' flintbit")
