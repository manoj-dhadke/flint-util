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

/**
** Creation Date: 1st February 2019
** Summary: This is add note/comments on ticket in Freshservice Desk flintbit. Flint workflow compatible.
** Description: This flintbit is developed to add note/comments on ticket in Freshservice Desk. Flint workflow compatible.
**/

log.trace("Started executing flint-util:freshservice:add_note_wf.js")
log.info(input)

freshservice_configs = ""

input_clone = JSON.parse(input)
if(input_clone.hasOwnProperty('freshservice_configurations')){
    log.trace("Freshservice service params are given")
   freshservice_configs = input.get('freshservice_configurations')
   log.trace("Service params are: "+freshservice_configs)
}

// Global config
    email = config.global("freshservice_wf.email")                               //Email address of the requester
    if(email == null || email == ""){
        log.trace("Setting email from service param")
        email = freshservice_configs.get('email')
        log.trace(email)
    }
    password = config.global("freshservice_wf.password")                         //Password of the freshservice account
    if(password == null || password == ""){
        log.trace("Setting password from service param")
        password = freshservice_configs.get('password')
        log.trace("Password taken from service param")
    }

    freshservice_connector_name = config.global("freshservice_wf.connector_name")
    if(freshservice_connector_name == null || freshservice_connector_name == ""){
        log.trace("Setting freshservice connector name from service param")
        freshservice_connector_name = freshservice_configs.get('connector_name')
        log.trace("Connector name from service param: "+freshservice_connector_name)
    }

    private_note= config.global("freshservice_wf.private_note")
    if(private_note == null || private_note == ""){
        log.trace("Setting private note from service param")
        private_note = freshservice_configs.get('private_note')
        log.trace(private_note)
    }

    domain_name= config.global("freshservice_wf.domain_name")
    if(domain_name == null || domain_name == ""){
        log.trace("Setting domain name from service param")
        domain_name = freshservice_configs.get('domain_name')
        log.trace(domain_name)
    }

// Hard coded action
    action ="add-note"

    log.trace("Service params / Gloabal configs set")

// Inputs from Service Form
    ticket_id = input.get('ticket_id')
    ticket_id = ticket_id.toString()
    //ticket_id = ticket_id.replace(/^\D+/g, '')
    
    log.info(ticket_id)              
    ticket_type = input.get("ticket_type")
    body=input.get("body")
    //api_key = input.get("api_key")


    log.trace("Service form inputs set")

    if (freshservice_connector_name == null || freshservice_connector_name == "") {
        log.error("Please provide 'Connector Name'")
    }

    if (domain_name == null || domain_name == "") {
        log.error("Please provide 'Freshservice account Domain Name'")
    }

    if (email == null || email == "") {
        log.error("Please provide 'Freshservice account Email Id'")
    }

    if (password == null || password == "") {
        log.error("Please provide 'Freshservice account Password'")
    }

    if (ticket_id == null || ticket_id == "") {
        log.error("Please provide 'Freshservice Ticket ID to add Note on ticket'")
    }

    if (ticket_type == null || ticket_type == "") {
        log.error("Please provide 'Freshservice Ticket type: Incident'")
    }

    if (private_note == null) {
        log.error("Please provide 'Freshservice Private Note state: Boolean true/false'")
    }

    if (body == null || body == "") {
        log.error("Please provide 'Freshservice Note/Comments body'")
    }

    connector_response = call.connector(freshservice_connector_name)
                             .set("domain-name",domain_name)
                             .set("password",password)
                             .set("email",email)
                             .set("action", action)
                             .set("ticket-type",ticket_type)
                             .set("body",body)
                             .set("ticket-id",ticket_id)
                             .set("private",private_note)
                             .sync()

    log.info("Connector_Response::" +connector_response)
    //extracting response of connector call
    response_exitcode = connector_response.exitcode() // exitcode
    log.info("Connector Exitcode::" +response_exitcode)
    response_message = connector_response.message() // message
    log.info("Connector Message::" +response_message)

    //exception handling
    if (response_exitcode == 0) {
        log.info("Success in executing Freshservice Connector, where exitcode ::" + response_exitcode + "| message ::" + response_message)
        output.set("exit-code", 0).set("message",response_message)
    } else {
        log.error("Failure in executing Freshservice Connector where, exitcode ::" + response_exitcode + "| message ::" + response_message)
        output.set("message", response_message).set("exit-code", -1)   
    }

log.trace("Finished executing flint-util:freshservice:add_note_wf.js")
