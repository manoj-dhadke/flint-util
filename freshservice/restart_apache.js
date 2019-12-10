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
** Creation Date: 25th August 2018
** Summary: This is Auto-remediate Apache server flintbit.
** Description: This flintbit is developed to remediate apache server after receiving server status from nagios.
**/

log.trace("Started executing 'flint-util:freshservice:restart_apache.js' flintbit...")
try{
    // Apache Server Details
    target =   input.get('target')
    username = input.get('username')
    target_password = input.get('target_password')
    port = input.get('port')

    // Get flint service request ID
    flint_job_id = input.jobid()
    log.trace("Flint Job ID: "+flint_job_id)

    domain_name = input.get('domain_name')
    username = input.get('username')
    password = input.get('password') 
    type = input.get('type')
    connector_name = input.get('connector_name')

    email = input.get('email')
    subject = input.get('subject')
    initial_status = input.get('initial_status')
    final_status = input.get('final_status')
    priority = input.get('priority')
    ticket_type = input.get('ticket_type')

    // Ticket notes status private/public
    acknowledge_private_note= input.get('acknowledge_private_note')
    final_private_note=input.get('final_private_note')    
    user_message = "<b>Flint Automation:</b> Apache server has been restarted"

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
    description = "Alert Source: Nagios \nAffected System: " + hostaddress+ "\nRemediation System: Flint\nAlert Details: Apache server at host " + hostaddress + " is down"

    // Ticket note bodies
    acknowledge_body = "Incident created for Nagios alert and auto-remediation initiated by Flint job-id - ("+flint_job_id+")"
    final_body = "Incident is now auto-resolved by Flint. Apache Service on host "+hostname+" has been restarted."
    log.trace(acknowledge_body)
    log.trace(final_body)

    // Service goes ‘Down’, i.e. if service state is 'CRITICAL' raise a ticket, create ticket, add comment & change ticket status 
    if (servicestate == 'CRITICAL'){ 
        // Call flintbit to raise ticket
        response = call.bit("flint-util:freshservice:create_ticket.js")
                       .set('domain_name', domain_name)
                       .set('connector_name', connector_name)
                       .set('password',password)
                       .set('email', email)
                       .set('subject', subject)
                       .set('description', description)
                       .set('status', initial_status)
                       .set('priority', priority)
                       .set('ticket_type', ticket_type)
                       .timeout(300000)
                       .sync()

        // Get ticket id
        ticket_id = response.get('ticket_id')
        ticket_id = ticket_id.toString()
        // Call flintbit to add comment regarding acknowledgement of incident
        call.bit("flint-util:freshservice:add_note.js")
            .set('domain_name', domain_name)
            .set('private_note',acknowledge_private_note)
            .set('email', email)
            .set('password',password)
            .set('body', acknowledge_body)
            .set('connector_name', connector_name)
            .set('ticket_id', ticket_id)
            .set('ticket_type', ticket_type)
            .sync()

        // Calling SSH connector
        connector_response = call.connector('ssh') 
                                 .set('target',hostaddress)
                                 .set('type', 'exec')
                                 .set('port',port)
                                 .set('username', username)
                                 .set('password', target_password)
                                 .set('command', 'sudo service apache2 start') // Starting web server apache2
                                 .set('timeout', 60000)
                                 .sync()

        //  SSH Connector Response Parameter
        result = connector_response.get('result')
        response_exitcode = connector_response.exitcode()

        if(response_exitcode == 0){
            // Call flintbit to add comment after issue is resolved with exit-code 0   
            call.bit("flint-util:freshservice:add_note.js")
                .set('domain_name', domain_name)
                .set('email', email)
                .set('password', password)
                .set("private_note",final_private_note)
                .set('body',final_body)
                .set('connector_name',connector_name)
                .set('ticket_id',ticket_id)
                .set('ticket_type',ticket_type)
                .sync()

            log.trace("After second note")
            // Call flintbit to change status of ticket
            call.bit("flint-util:freshservice:update_ticket.js")
                .set('domain_name', domain_name)
                .set('email', email)
                .set('password', password)
                .set('status', final_status)
                .set('connector_name', connector_name)
                .set('ticket_id',ticket_id)
                .set('ticket_type',ticket_type)
                .sync()

            log.info("Successfully executed flintbit with exit-code :" + response_exitcode)
        }
        else{
            log.info("Unable to restart Apache server...")
        }
    }
    // Setting user-message
    output.set('user_message', user_message)
}catch(error){
    log.error("Error message : " + error)
}
log.trace("Finished executing 'flint-util:freshservice:restart_apache.js' flintbit")
