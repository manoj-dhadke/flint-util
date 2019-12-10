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

log.trace("Started executing 'flint-util:serviceaide:nagios:restart_apache.js' flintbit...")
try {
    // Apache Server Details
    nagios_apache_config = input.get("nagios_apache_config")
    target = nagios_apache_config.get('target')
    username = nagios_apache_config.get('username')
    target_password = nagios_apache_config.get('target_password')
    port = nagios_apache_config.get('port')
    user_message = "Flint Automation: Apache server has been restarted"
    log.info("Input parameters..... target " + target + " | username " + username + " | target_password" + target_password + " | port " + port)
    // Get flint service request ID
    flint_job_id = input.jobid()
    log.trace("Flint Job ID: " + flint_job_id)
    log.info("")
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
    incident_description = "Apache server is Down or Critical"
    incident_description_long = "Alert Source: Nagios, Affected System: " + hostaddress + ", Remediation System: Flint, Alert Details: Apache server at host " + hostaddress +" "+ " is down."
    // Service goes ‘Down’, i.e. if service state is 'CRITICAL' raise a ticket, create ticket, add comment & change ticket status 
    if (servicestate == 'CRITICAL') {
        // Call flintbit to raise ticket
        response = call.bit("flint-util:serviceaide:servicerequest:create_incident.groovy")
                       .set("incident_description", incident_description)
                       .set("incident_description_long", incident_description_long)
                       .timeout(300000)
                       .sync()
        // Get ticket id
        ticket_id = response.get('ticket_id')
        log.info("Ticket Id ....  " + ticket_id)
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
                final_work_description = "Incident has been resolved by Flint auto-remediation. Apache server was remediated. Marked incident as resolved."
                add_serviceaide_worklog = call.bit("flint-util:serviceaide:servicerequest:incident_add_worklog.groovy")
                    .set("ticket_id", ticket_id)
                    .set("work_description", final_work_description)
                    .sync()
            } else {
                log.info("Failed to update ticket status")
            }
        } else {
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
