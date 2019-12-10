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
** Creation Date: 22nd Aug 2018
** Summary: This is add note/comments on ticket in Freshservice Desk flintbit
** Description: This flintbit is developed to add note/comments on ticket in Freshservice Desk.
**/

log.trace("Started executing flint-util:freshservice:add_note.js")
try {
    email = input.get("email")                               //Email address of the requester
    password = input.get("password")                         //Password of the freshservice account
    ticket_id=input.get("ticket_id")                      
    freshservice_connector_name = input.get("connector_name")
    //api_key = input.get("api_key")
    action ="add-note"
    domain_name=input.get("domain_name")
    ticket_type =input.get("ticket_type")
    body=input.get("body")
    private_note=input.get("private_note")

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

    if (ticket_id == null || ticket_id == "") {
        throw "Please provide 'Freshservice Ticket ID to add Note on ticket'"
    }

    if (ticket_type == null || ticket_type == "") {
        throw "Please provide 'Freshservice Ticket type: Incident'"
    }

    if (private_note == null) {
        throw "Please provide 'Freshservice Private Note state: Boolean true/false'"
    }

    if (body == null || body == "") {
        throw "Please provide 'Freshservice Note/Comments body'"
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

}
catch (error) {
    log.error("Error message: " + error)
    output.set('exit-code', 1)

}
log.trace("Finished executing flint-util:freshservice:add_note.js")
