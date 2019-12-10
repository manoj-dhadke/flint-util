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
log.info("Started execution of 'serviceaide:service_request_update_status")
ticket_id = input.get("ticket_id")
connector_name = config.global("serviceaide_servicerequest_config.connector_name")
incident_soap_url = config.global("serviceaide_servicerequest_config.incident_soap_url")
soap_username = config.global("serviceaide_servicerequest_config.soap_username")
soap_password = config.global("serviceaide_servicerequest_config.soap_password")
wsdl_body = """
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:wrap="http://wrappers.webservice.appservices.core.inteqnet.com" xmlns:xsd="http://beans.webservice.appservices.core.inteqnet.com/xsd">
   <soapenv:Header/>
   <soapenv:Body>
      <wrap:updateIncident>
         <!--Optional:-->
          <wrap:credentials>
            <xsd:userName>${soap_username}</xsd:userName>
            <!--Optional:-->
            <xsd:userPassword>${soap_password}</xsd:userPassword>
         </wrap:credentials>
         <!--Optional:-->
         <wrap:extendedSettings>
            <!--Optional:-->
            <xsd:responseFormat>JSON</xsd:responseFormat>
         </wrap:extendedSettings>
         <!--Optional:-->
         <wrap:incBean>
             <xsd:row_id>-999</xsd:row_id>
            <xsd:ticket_identifier>${ticket_id}</xsd:ticket_identifier>
            <!--Optional:-->
            <xsd:ticket_status>Resolved</xsd:ticket_status>
            <!--Optional:-->
         </wrap:incBean>
      </wrap:updateIncident>
   </soapenv:Body>
</soapenv:Envelope>
"""

http_response= call.connector(connector_name)
                   .set("method","POST")
                   .set("url",incident_soap_url)
                   .set("body",wsdl_body)
                   .set("headers",["Content-Type: text/xml;charset=UTF-8","SOAPAction: \"urn:updateIncident\""])
                   .timeout(60000)
                   .sync()
log.info("Http Response : " + http_response)
response_body= http_response.get("body")
log.info("response_body: " + response_body)
if (response_body.contains('Selected ticket record is currently being modified by another user'))
{
log.info("The current ticket is being modified by another user")
for(int i = 0;i<61;i++) {
log.info("Into Sleep mode. Ticket status still not updated, Ticket record is currently being modified by another use....")
if (response_body.contains('Selected ticket record is currently being modified by another user')){
util.sleep(60000)
http_response= call.connector(connector_name)
                   .set("method","POST")
                   .set("url",incident_soap_url)
                   .set("body",wsdl_body)
                   .set("headers",["Content-Type: text/xml;charset=UTF-8","SOAPAction: \"urn:updateIncident\""])
                   .timeout(60000)
                   .sync()
log.info("Http Response : " + http_response)
response_body= http_response.get("body")
log.info("response_body: " + response_body)

}
else{
log.info("Breaking the for loop... Going ahead to update the ticket status...")
http_response= call.connector(connector_name)
                   .set("method","POST")
                   .set("url",incident_soap_url)
                   .set("body",wsdl_body)
                   .set("headers",["Content-Type: text/xml;charset=UTF-8","SOAPAction: \"urn:updateIncident\""])
                   .timeout(60000)
                   .sync()
log.info("Http Response : " + http_response)
response_body= http_response.get("body")
log.info("response_body: " + response_body)
break;

}
}
}
else{
log.info("Successfully updated the ticket status")
}

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
log.info("Finished execution of 'serviceaide:service_request_update_status")
