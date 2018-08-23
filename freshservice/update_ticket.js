/**
** Creation Date: 22nd Aug 2018
** Summary: This is update ticket in Freshservice Desk flintbit
** Description: This flintbit is developed to update ticket in Freshservice Desk.
**/
log.trace("Started executing flint-util:freshservice:update_ticket.js")
try {
    email = input.get("email")                               //Email address of the requester
    password = input.get("password")                         //Password of the freshservice account
    status = input.get("status")                             //Status of the ticket
    ticket_id=input.get("ticket_id")                      
    freshservice_connector_name = input.get("connector_name")
    //api_key = input.get("api_key")
    action ="update-ticket"
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

    if (ticket_id == null || ticket_id == "") {
        throw "Please provide 'Freshservice Ticket ID to update status on ticket'"
    }

    if (ticket_type == null || ticket_type == "") {
        throw "Please provide 'Freshservice Ticket type: 'Incident'"
    }

    if (status == null || status == "") {
        throw "Please provide 'Freshservice Ticket Status"
    }

    connector_response = call.connector(freshservice_connector_name)
                             .set("domain-name",domain_name)
                             .set("password",password)
                             .set("email",email)
                             .set("action", action)
                             .set("ticket-type",ticket_type)
                             .set("ticket-id",ticket_id)
                             .set("status", status)
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
        output.set("exit-code", 0).set("success",response_message)
    } else {
        log.error("Failure in executing Freshservice Connector where, exitcode ::" + response_exitcode + "| message ::" + response_message)
        output.set("error", response_message).set("exit-code", -1)       
    }

}
catch (error) {
    log.error("Error message: " + error)
    output.set('exit-code', 1)

}
log.trace("Finished executing flint-util:freshservice:update_ticket.js")