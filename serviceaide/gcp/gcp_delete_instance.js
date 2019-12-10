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

log.trace("Started execution 'fb-cloud:google-cloud:operation:delete_instance.groovy' flintbit...") // execution Started
try {
    // Flintbit input parametes
    // Mandatory
    connector_name = input.get('connector_name')                                // google-cloud connector name
    action = "delete-instance"                                                  // name of the operation: delete-instance
    project_id = input.get('project-id')                                        // project-id of the google cloud-platform 
    zone_name = input.get('zone-name')                                          // zone-name of the project id
    service_account_credenetials = input.get('service-account-credentials')     //service account credentials as json for the given project-id
    instance_name = input.get('instance-name')                                  //instance name to delete instance
    //optional
    request_timeout = input.get('timeout')	                                    // Execution time of the Flintbit in milliseconds (default timeout is 60000 milloseconds)
    // ServiceAide ticket Id
    ticket_id = input.get("ticket_id")
    flint_job_id = input.jobid()
    log.info("Job-id:" + flint_job_id)
    // Worklog messages to update worklog at ServiceAide ticket
    work_description_ack = "Flint has recieved Ticket Id " + ": " + ticket_id + " " + "Flint is trying to resolve it. \nFlint job-id : " + " " + flint_job_id
    work_description = "Ticket Id : " + ticket_id +" \nGCP instance deleted successfully"
    // Call flintbit to add initial worklog
    add_serviceaide_worklog = call.bit("flint-util:serviceaide:servicerequest:service_request_add_worklog.groovy")
                                .set("ticket_id", ticket_id)
                                .set("work_description", work_description_ack)
                                .sync()
    // Call flintbit synchronously and set arguments
    flintbit_response = call.bit("fb-cloud:google-cloud:operation:delete_instance.groovy")
                            .set('connector_name', connector_name)
                            .set('action', action)
                            .set('project-id', project_id)
                            .set('zone-name', zone_name)
                            .set('service-account-credentials', service_account_credenetials)
                            .set('instance-name', instance_name)
                            .set('timeout', 60000)
                            .sync()
    // google-cloud Response Meta Parameters	
    response_exitcode = flintbit_response.exitcode()                // Exit status code
    response_message = flintbit_response.message()                  // Execution status message
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
        }else {
            log.info("Failed to update ticket status")
        }
    }else {

        work_description_fail = "Error occured while executing ticket" + " " + ticket_id + ". " + "\nThe error occured due to" + " " + error_message
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
log.trace("Finished execution 'fb-cloud:google-cloud:operation:delete_instance.groovy' flintbit...")
