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

log.trace("Started executing serviceaide:aws:wrapper_aws_create_instance.js flintbit")
try {
    // Get Flint Job ID
    flint_job_id = input.jobid()
    // Inputs to create AWS instance, set in service config
    region = input.get('region')
    key_name = input.get('key_name')
    subnet_id = input.get('subnet_id')
    access_key = input.get('access-key')
    max_instance = input.get('max_instance')
    min_instance = input.get('min_instance')
    security_key = input.get('security-key')
    aws_connector_name = input.get('connector_name')
    availability_zone = input.get('availability_zone')
    ami_id = input.get("ami_id")
    instance_size = input.get("instance_size")
    operating_system_name = input.get("operating_system_name")
    log.info("opertaing system name::" + operating_system_name)
    // ServiceAide ticket Id
    ticket_id = input.get("ticket_id")
    flint_job_id = input.jobid()
    log.info("Job-id:" + flint_job_id)
    //Worklog messages to update worklog at ServiceAide ticket
    work_description_ack = "Flint has recieved Ticket Id " + ": " + ticket_id + " " + "and is trying to resolve it. \nFlint Job-Id : " + " " + flint_job_id
    // Call flintbit to add initial worklog
    add_serviceaide_worklog = call.bit("flint-util:serviceaide:servicerequest:service_request_add_worklog.groovy")
                                .set("ticket_id", ticket_id)
                                .set("work_description", work_description_ack)
                                .sync()
    aws_config = input.get("aws_config")
    log.info("AWS Config::" + aws_config)
    ami_id = aws_config.get('os_mapping').get(operating_system_name)

    log.trace("AMI ID: " + ami_id)
    // Call flintbit synchronously and set arguments
    flintbit_response = call.bit("fb-cloud:aws-ec2:operation:create_instance.rb")
                            .set('connector_name', aws_connector_name)
                            .set('ami_id', ami_id)
                            .set('instance_type', instance_size)
                            .set('min_instance', min_instance)
                            .set('max_instance', max_instance)
                            .set('access-key', access_key)
                            .set('security-key', security_key)
                            .set('availability_zone', availability_zone)
                            .sync()
    // Getting instance information
    instance_info = flintbit_response.get('instances-info')
    instance_id = instance_info[0].get('instance-id')
    log.info("Instance_Info: " + instance_id)
    work_description = "Ticket Id : " + ticket_id + " " + " AWS instance has been created successfully. \nInstance Id: " + instance_id
    // Getting exit-code for create instance flinbit call
    exitcode = flintbit_response.get("exit-code")
    success_message = flintbit_response.message
    result = flintbit_response.get("result")
    error_message = flintbit_response.get("error")
    if (exitcode == 0) {
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
    }
}
catch (error) {
    log.error("Error : " + error)
}
log.trace("Finished executing serviceaide:aws:wrapper_aws_create_instance.js flintbit.")
