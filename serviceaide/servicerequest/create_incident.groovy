log.info("Started execution of 'serviceaide:create_incident.groovy")
ticket_id = input.get("ticket_id")
//work_description = "Ticket with ticket id : ${ticket_id} is updated to resolved state"
incident_description = input.get("incident_description")
incident_description_long = input.get("incident_description_long")
requester_name= "admin@flintautomation.com"
connector_name = config.global("serviceaide_servicerequest_config.connector_name")
incident_soap_url = config.global("serviceaide_servicerequest_config.incident_soap_url")
soap_username = config.global("serviceaide_servicerequest_config.soap_username")
soap_password = config.global("serviceaide_servicerequest_config.soap_password")
wsdl_body = """
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:wrap="http://wrappers.webservice.appservices.core.inteqnet.com" xmlns:xsd="http://beans.webservice.appservices.core.inteqnet.com/xsd">
   <soapenv:Header/>
   <soapenv:Body>
     <wrap:reportIncident>
         <wrap:credentials>
            <xsd:userName>${soap_username}</xsd:userName>
            <xsd:userPassword>${soap_password}</xsd:userPassword>
         </wrap:credentials>
         <wrap:extendedSettings>
            <xsd:responseFormat>JSON</xsd:responseFormat>
         </wrap:extendedSettings>
         <wrap:incBean>
            <xsd:description_long>${incident_description_long}</xsd:description_long>
            <xsd:requester_name>${requester_name}</xsd:requester_name>
            <xsd:ticket_description>${incident_description}</xsd:ticket_description>
            <xsd:ticket_impact>Medium</xsd:ticket_impact>
            <xsd:ticket_priority>Medium</xsd:ticket_priority>
            <xsd:ticket_source>Web</xsd:ticket_source>
        </wrap:incBean>
      </wrap:reportIncident>
   </soapenv:Body>
</soapenv:Envelope>
"""

http_response= call.connector(connector_name)
                   .set("method","POST")
                   .set("url",incident_soap_url)
                   .set("body",wsdl_body)
                   .set("headers",["Content-Type: text/xml;charset=UTF-8" ,"SOAPAction: \"urn:reportIncident\""])
                   .timeout(60000)
                   .sync()
log.info("Http Response : "+ http_response)
exit_code = http_response.exitcode()
message = http_response.message()

if (exit_code == 0){
    log.info("Success in executing ${connector_name} connector where exit_code::${exit_code} and message :: ${message}")
    output.set("exit-code", 0)
}
else{
    log.error("Error in executing ${connector_name} connector  where, exit_code : ${exit_code} and message:: ${message}")
    output.set("exit-code", -1)
}
log.info("Finished execution of 'serviceaide:create_incident.groovy")