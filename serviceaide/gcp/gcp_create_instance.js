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

log.trace("Started execution 'fb-cloud:google-cloud:operation:google_create_instance.js' flintbit...") // execution Started
try {
    // Flintbit input parametes
    // Mandatory
    connector_name = input.get('connector_name')         // google-cloud connector name
    action = "create-instance"                          // name of the operation: create-instance
    project_id = input.get('project-id')                // project-id of the google cloud-platform
    zone_name = input.get('zone-name')                  // zone-name of the project id
    instance_name = input.get('instance-name')          //instance name to start instance
    disk_type = input.get('disk-type')                  // type of the disk to create instance
    machine_type = input.get('machine-type')            //type of the machine for creating virtual machine
    image_project_id = input.get('image-project-id')     //project id of the image where image is present
    service_account_credenetials = input.get('service-account-credentials')
    operating_system_type = input.get('operating_system_type')
    //optional
    request_timeout = input.get('timeout')	            // Execution time of the Flintbit in milliseconds (default timeout is 60000 milloseconds)
    // ServiceAide ticket Id
    ticket_id = input.get("ticket_id")
    flint_job_id = input.jobid()
    log.info("Job-id:" + flint_job_id)
    log.info("ticket_id...." + ticket_id)
    // Worklog messages to update worklog at ServiceAide ticket
    work_description_ack = "Flint has recieved Ticket Id " + ": " + ticket_id + " and is trying to resolve it. \nFlint job-id : " + " " + flint_job_id
    work_description = "Ticket Id : " + ticket_id + " " + "GCP instance with name "+instance_name+" has been created successfully."
    // Call flintbit to add initial worklog
    add_serviceaide_worklog = call.bit("flint-util:serviceaide:servicerequest:service_request_add_worklog.groovy")
                                .set("ticket_id", ticket_id)
                                .set("work_description", work_description_ack)
                                .sync()
    // Call flintbit synchronously and set arguments
    flintbit_response = call.bit("fb-cloud:google-cloud:operation:create_instance.groovy")
                            .set('connector_name', connector_name)
                            .set('action', action)
                            .set('project-id', project_id)
                            .set('zone-name', zone_name)
                            .set('service-account-credentials', service_account_credenetials)
                            .set('instance-name', instance_name)
                            .set('disk-type', disk_type)
                            .set('image-name', operating_system_type)
                            .set('machine-type', machine_type)
                            .set('image-project-id', image_project_id)
                            .set('timeout', 60000)
                            .sync()
    // google-cloud Response Meta Parameters
    response_exitcode = flintbit_response.exitcode() // Exit status code
    response_message = flintbit_response.message() // Execution status message
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
log.trace("Finished execution 'fb-cloud:google-cloud:operation:google_create_instance.js' flintbit...")
