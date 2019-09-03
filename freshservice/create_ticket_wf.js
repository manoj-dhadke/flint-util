/**
** Creation Date: 22nd Aug 2018
** Summary: This is create ticket in Freshservice Desk flintbit
** Description: This flintbit is developed to create ticket in Freshservice Desk.
**/
log.trace("Started executing flint-util:freshservice:create_ticket_wf.js")

log.trace(input)

// Global configurations
email = config.global("freshservice_wf.email")                               //Email address of the requester
password = config.global("freshservice_wf.password")                         //Password of the freshservice account
freshservice_connector_name = config.global("freshservice_wf.connector_name")
domain_name = config.global("freshservice_wf.domain_name")

// Portal Service Inputs
fs_service_params = input.get("fs_service_param")
// Status: Open=2; Pending=3; Resolved=4; Closed=5
status = fs_service_params.get("status")
// Priority: Low=1; Medium=2; High=3; Urgent=4
priority = fs_service_params.get("priority")                         //Priority of the ticket

// Service Inputs
description = input.get("description")                   //Plain text content of the ticket
subject = input.get("subject")                           //Ticket subject
//api_key = input.get("api_key")
ticket_type = input.get("ticket_type")

action = "create-ticket"



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
    .set("domain-name", domain_name)
    .set("password", password)
    .set("email", email)
    .set("action", action)
    .set("subject", subject)
    .set("description", description)
    .set("ticket-type", ticket_type)
    .set("priority", priority)
    .set("status", status)
    .sync()

log.info("Connector_Response::" + connector_response)
ticket_id = connector_response.get("item.helpdesk_ticket.display_id")
log.info("Ticket ID::" + ticket_id)
//extracting response of connector call
response_exitcode = connector_response.exitcode() // exitcode
log.info("Connector Exitcode::" + response_exitcode)
response_message = connector_response.message() // message
log.info("Connector Message::" + response_message)


//exception handling
if (response_exitcode == 0) {
    log.info("Success in executing Freshservice Connector, where exitcode ::" + response_exitcode + "| message ::" + response_message)
    output.set("exit-code", 0).set("message", response_message).set("response", connector_response.toString()).set("ticket_id", ticket_id)

} else {
    log.error("Failure in executing Freshservice Connector where, exitcode ::" + response_exitcode + "| message ::" + response_message)
    output.set("message", response_message).set("exit-code", -1)
}

log.trace("Finished executing flint-util:freshservice:create_ticket_wf.js")