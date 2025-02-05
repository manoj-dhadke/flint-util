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
** Creation Date: 22nd Aug 2018
** Summary: This is create ticket in Freshservice Desk flintbit
** Description: This flintbit is developed to create ticket in Freshservice Desk.
**/

log.trace("Started executing flint-util:freshservice:create_ticket.js")
try {
    email = input.get("email")                               //Email address of the requester
    password = input.get("password")                         //Password of the freshservice account
    status = input.get("status")                             //Status of the ticket
    priority = input.get("priority")                         //Priority of the ticket
    description = input.get("description")                   //Plain text content of the ticket
    subject = input.get("subject")                           //Ticket subject
    freshservice_connector_name = input.get("connector_name")
    //api_key = input.get("api_key")
    action ="create-ticket"
    domain_name=input.get("domain_name")
    ticket_type =input.get("ticket_type")
    
    
    if (freshservice_connector_name == null || freshservice_connector_name == "") {
        throw "Please provide 'Connector Name'"
    }

    if (domain_name == null || domain_name == "") {
        throw "Please provide 'Freshservice account Domain Name'"
    }

    if (email == null || email == "") {
        throw "Please provide 'Freshservice account Email Id'"
    }

    if (password == null || password == "") {
        throw "Please provide 'Freshservice account Password'"
    }

    if (ticket_type == null || ticket_type == "") {
        throw "Please provide 'Freshservice Ticket type: 'Incident'"
    }

    if (subject == null || subject == "") {
        throw "Please provide 'Freshservice Ticket Subject"
    }

    if (description == null || description == "") {
        throw "Please provide 'Freshservice Ticket Description"
    }
    

    connector_response = call.connector(freshservice_connector_name)
                             .set("domain-name",domain_name)
                             .set("password",password)
                             .set("email",email)
                             .set("action", action)
                             .set("subject",subject)
                             .set("description",description)
                             .set("ticket-type", ticket_type)
                             .set("priority", priority)
                             .set("status", status)
                             .sync()

    log.info("Connector_Response::" +connector_response)
    ticket_id= connector_response.get("item.helpdesk_ticket.display_id")
    log.info("Ticket ID::" +ticket_id)
    //extracting response of connector call
    response_exitcode = connector_response.exitcode() // exitcode
    log.info("Connector Exitcode::" +response_exitcode)
    response_message = connector_response.message() // message
    log.info("Connector Message::" +response_message)


    //exception handling
    if (response_exitcode == 0) {
        log.info("Success in executing Freshservice Connector, where exitcode ::" + response_exitcode + "| message ::" + response_message)
        output.set("exit-code", 0).set("message",response_message).set("response",connector_response.toString()).set("ticket_id",ticket_id)
        
    } else {
        log.error("Failure in executing Freshservice Connector where, exitcode ::" + response_exitcode + "| message ::" + response_message)
        output.set("message", response_message).set("exit-code", -1)   
    }

}
catch (error) {
    log.error("Error message: " + error)
    output.set('exit-code', 1)

}
log.trace("Finished executing flint-util:freshservice:create_ticket.js")
