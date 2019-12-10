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

log.trace("Started executing 'flint-util:zendesk:operations:nagios:restart_apache.js' flintbit...")
try {
    // Apache Server Details
    log.info("Input:: " +input)
    nagios_apache_config = input.get("nagios_apache_config")
    target = nagios_apache_config.get('target')
    username = nagios_apache_config.get('username')
    target_password = nagios_apache_config.get('target_password')
    port = nagios_apache_config.get('port')
    zendesk_connector_name = nagios_apache_config.get("zendesk_connector_name")
    user_message = "<b>Flint Automation:</b> Apache server has been restarted"
    log.info("Input parameters..... target " + target + " | username " + username + " | target_password " + target_password + " | port " + port)

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
    comment = "Flint acknowledged request for remediation and automation has been initiated for Job ID (" + flint_job_id + ")"
    subject = "Alert Source: Nagios, Affected System: " + hostaddress + ", Remediation System: Flint, Alert Details: Apache server at host " + hostaddress + " " + " is down."
    ticket_type = "incident"
    ticket_priority = "urgent"
    description = "Apache server is Down or critical on Host: " + hostaddress
    
    // Service goes ‘Down’, i.e. if service state is 'CRITICAL' raise a ticket, create ticket, add comment & change ticket status 
    if (servicestate == 'CRITICAL') {

        // Creating a ticket in Zendesk

        create_ticket_response = call.bit("flint-util:zendesk:operations:create_ticket.rb")
                                     .set("connector_name", zendesk_connector_name)
                                     .set("type", ticket_type)
                                     .set("subject", subject)
                                     .set("comment", comment)
                                     .set("priority", ticket_priority)
                                     .set("description", description)
                                     .sync()
        
        result= create_ticket_response.get('result')
        result =util.json(result)
        log.info("Create ticket result:: " +result)
        ticket_id = result.get("ticket.id")
        requester_id = result.get("ticket.requester_id")
        log.info("Zendesk ticket id: " + ticket_id)
        log.info("Zendesk requester id: " + requester_id)
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
        if(response_exitcode == 0){
          final_ticket_comment = "Incident has been resolved by Flint auto-remediation. Apache server was remediated. Marked incident as solved."
          ticket_status = "solved"
          response_update_ticket = call.bit("flint-util:zendesk:operations:update_ticket.rb")
                                       .set('connector_name', zendesk_connector_name)
                                       .set("type", ticket_type.toLowerCase())
                                       .set("priority", ticket_priority.toLowerCase())
                                       .set("comment", final_ticket_comment)
                                       .set("ticket-id", ticket_id.toString())
                                       .set("status", ticket_status.toLowerCase())
                                       .set("requester_id", requester_id.toString())
                                       .sync()
        }
        else{
            log.info("Unable to restart Apache server...")
        }
       // Setting user-message
       output.set('user_message', user_message)
    }
} catch (error) {
    output.set('user_message', error)
    output.set('exit-code', -1)
}
log.trace("Finished executing 'flint-util:zendesk:operations:nagios:restart_apache.js' flintbit...")
