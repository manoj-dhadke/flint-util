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

log.trace("Started executing 'fb-cloud:aws-ec2:operation:start_instance.rb' flintbit...")
try {
    // Flintbit Input Parameters
    connector_name = input.get('connector_name')         // Name of the Amazon EC2 Connector
    action = 'start-instances'                           // Specifies the name of the operation: start-instances
    instance_id = input.get('instance-id')               // Contains one or more instance IDs corresponding to the
    access_key = input.get('access-key')
    security_key = input.get('security-key')
    // Optional
    region = input.get('region')	                      // Amazon EC2 region (default region is 'us-east-1')
    request_timeout = input.get('timeout')	              // Execution time of the Flintbit in milliseconds (default timeout is 60000 milloseconds)
    // ServiceAide ticket Id
    ticket_id = input.get("ticket_id")
    flint_job_id = input.jobid()
    log.info("Job-id:" + flint_job_id)
    // Worklog messages to update worklog at ServiceAide ticket
    work_description_ack = "Flint has recieved Ticket Id " + ": " + ticket_id + " " + "and is trying to resolve it. \nFlint Job-Id : " + " " + flint_job_id
    work_description = "Ticket Id : " + ticket_id + " " + "\nAWS instance with Id "+ instance_id+" has been started successfully."
    // Call flintbit to add initial worklog
    add_serviceaide_worklog = call.bit("flint-util:serviceaide:servicerequest:service_request_add_worklog.groovy")
                                .set("ticket_id", ticket_id)
                                .set("work_description", work_description_ack)
                                .sync()
    log.info("Flintbit input parameters are, action : " + action + "| instance_id :" + instance_id + "| region :" + region)
    flintbit_response = call.bit("fb-cloud:aws-ec2:operation:start_instance.rb")
                            .set(input)
                            .set('timeout', 60000)
                            .sync()
    // Amazon EC2 Connector Response Meta Parameters
    response_exitcode = flintbit_response.exitcode()	// Exit status code
    response_message = flintbit_response.message()	    // Execution status messages
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
        } else {
            log.info("Failed to update ticket status")
        }
    } else {
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
        log.error("Start operation unsuccessful")
    }
}
catch (error) {
    log.error("Error : " + error)
}
log.trace("Finished executing 'fb-cloud:aws-ec2:operation:start_instance.rb' flintbit")
