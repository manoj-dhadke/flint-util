/**
** Creation Date: 26th October 2018
** Summary: This is Auto-remediate Apache server flintbit.
** Description: This flintbit is developed to remediate apache server after receiving server status from nagios.
**/
log.trace("Started executing 'flint-util:serviceaide:nagios:restart_apache.js' flintbit...")
try {
    // Apache Server Details
    target = input.get('target')
    username = input.get('username')
    target_password = input.get('target_password')
    port = input.get('port')
    user_message = "Flint Automation: Apache server has been restarted"
    // Get flint service request ID
    flint_job_id = input.jobid()
    log.trace("Flint Job ID: " + flint_job_id)
    // Getting the values from JSON
    servicename = input.get('servicename')
    hostname = input.get('hostname')
    servicestate = input.get('servicestate')
    hoststatetype = input.get('hoststatetype')
    hostattempt = input.get('hostattempt')
    servicedesc = input.get('servicedesc')
    hoststateid = input.get('servicestateid')
    serviceeventid = input.get('serviceeventid')
    serviceproblemid = input.get('serviceproblemid')
    servicelatency = input.get('servicelatency')
    serviceexecutiontime = input.get('serviceexecutiontime')
    serviceduration = input.get('serviceduration')
    hostaddress = input.get('hostaddress')
    incident_description = "Apcahe server is Down or Critical"
    incident_description_long = "Alert Source: Nagios, Affected System: " + hostaddress + "Remediation System: Flint, Alert Details: Apache server at host " + hostaddress + " is down"
    // Service goes ‘Down’, i.e. if service state is 'CRITICAL' raise a ticket, create ticket, add comment & change ticket status 
    log.info("1111111111111111111111111111111111")
    if (servicestate == 'CRITICAL') {
        // Call flintbit to raise ticket
        response = call.bit("flint-util:serviceaide:servicerequest:create_incident.groovy")
                       .set("incident_description", incident_description)
                       .set("incident_description_long", incident_description_long)
                       .timeout(300000)
                       .sync()
        // Get ticket id
        log.info("2222222222222222222222222222222222 "+response)
        ticket_id = response.get('ticket_id')
        log.info("Ticket Id ....  "+ticket_id)
        // Call flintbit to add comment regarding acknowledgement of incident
        work_description_ack = "Flint acknowledged request for remediation and automation has been initiated for Job ID (" + flint_job_id + ")"
        add_serviceaide_worklog = call.bit("flint-util:serviceaide:servicerequest:incident_add_worklog.groovy")
                                      .set("ticket_id", ticket_id)
                                      .set("work_description", work_description_ack)
                                      .sync()
        // Calling SSH connector
        connector_response = call.connector('ssh')
                                .set('target', hostaddress)
                                .set('type', 'exec')
                                .set('port', port)
                                .set('username', username)
                                .set('password', target_password)
                                .set('command', 'sudo service apache2 start') // Starting web server apache2
                                .set('timeout', 60000)
                                .sync()
        log.info("33333333333333333333333333333333")

        //  SSH Connector Response Parameter
        result = connector_response.get('result')
        response_exitcode = connector_response.exitcode()
        error_message = connector_response.get("error")
        if (response_exitcode == 0) {
            // Call flintbit to add comment after issue is resolved with exit-code 0   
            update_serviceaide_status = call.bit("flint-util:serviceaide:servicerequest:incident_update_status.groovy")
                                            .set("ticket_id", ticket_id)
                                            .sync()
            log.info("Status response:: " + update_serviceaide_status)
            if (update_serviceaide_status.exitcode() == 0) {
                final_work_description = "Incident resolved by Flint auto-remediation. Marked incident as resolved."
                add_serviceaide_worklog = call.bit("flint-util:serviceaide:servicerequest:incident_add_worklog.groovy")
                                              .set("ticket_id", ticket_id)
                                              .set("work_description", final_work_description)
                                              .sync()
            } else {
                log.info("Failed to update ticket status")
            }
        }else {
            work_description_fail = "Error occured while executing ticket" + " " + ticket_id + ". " + "The error occured due to" + " " + error_message
            update_serviceaide_status = call.bit("flint-util:serviceaide:servicerequest:incident_update_error_status.groovy")
                                            .set("ticket_id", ticket_id)
                                            .sync()
            if (update_serviceaide_status.exitcode() == 0) {
                add_serviceaide_worklog = call.bit("flint-util:serviceaide:servicerequest:incident_add_error_worklog.groovy")
                                              .set("ticket_id", ticket_id)
                                              .set("work_description", work_description_fail)
                                              .sync()
            } else {
                log.info("Failed to update ticket status")
            }
            log.info("Unable to restart Apache server...")
        }
    }
    // Setting user-message
    output.set('user_message', user_message)
} catch (error) {
    log.error("Error message : " + error)
}
log.trace("Finished executing 'flint-util:serviceaide:nagios:restart_apache.js' flintbit")