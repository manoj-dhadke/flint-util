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
log.info("Started execution of 'serviceaide:service_request_add_worklog.groovy")
ticket_id = input.get("ticket_id")
//work_description = "Ticket with ticket id : ${ticket_id} is updated to resolved state"
work_description = input.get("work_description")
connector_name = config.global("serviceaide_servicerequest_config.connector_name")
soap_url = config.global("serviceaide_servicerequest_config.soap_url")
soap_username = config.global("serviceaide_servicerequest_config.soap_username")
soap_password = config.global("serviceaide_servicerequest_config.soap_password")
wsdl_body = """
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:wrap="http://wrappers.webservice.appservices.core.inteqnet.com" xmlns:xsd="http://beans.webservice.appservices.core.inteqnet.com/xsd">
   <soapenv:Header/>
   <soapenv:Body>
      <wrap:addWorklog>
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
         <wrap:workglogBean>
            <!--Optional:-->

            <xsd:ticket_identifier>${ticket_id}</xsd:ticket_identifier>
            <!--Optional:-->

            <!--Optional:-->
            <xsd:work_description>${work_description}</xsd:work_description>
            <!--Optional:-->


            <xsd:work_type>Active</xsd:work_type>
            <!--Optional:-->

            <!--Optional:-->
            <xsd:work_view_type>Client Viewable</xsd:work_view_type>
         </wrap:workglogBean>
      </wrap:addWorklog>
   </soapenv:Body>
</soapenv:Envelope>
"""

http_response= call.connector(connector_name)
                   .set("method","POST")
                   .set("url",soap_url)
                   .set("body",wsdl_body)
                   .set("headers",["Content-Type: text/xml;charset=UTF-8","SOAPAction: \"urn:addWorklog\""])
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
log.info("Finished execution of 'serviceaide:service_request_add_worklog.groovy")
