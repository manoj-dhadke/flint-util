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

log.trace("Started executing flint-util:windows:windows_service_status.js flintbit...") 
// Flintbit Input Parameters fetched from global Configuration
try{
service_name = input.get("service_name")
command = "Get-Service" + " " + "\""+ service_name +"\"" +  "|ConvertTo-Json"  //Command to be executed
log.info ("Command:: " +command)
if(service_name == null || service_name =="")
{
    throw "Please provide the'service_name'to get the Windows service status"
}
log.trace('Calling WinRM Connector...')

// Connector Call
call_connector = call.bit("flint-util:ad-winrm:winrm_commonconnect.js")
                     .set(input)
                     .set("command", command)          
                     .sync()

log.info("result: " +call_connector)

// WinRM Connector Response Meta Parameters
response_exitcode = call_connector.exitcode()  //Exit status code
response_message = call_connector.message()   // Execution status messages

// WinRM Connector Response Parameters
response_body = call_connector.get("result")  //Response Body

// WinRM Connector Response Parameters
response_body = call_connector.get('result')  //Response Body
response_body = util.json(response_body)
log.info("Response Body:: " +response_body)
//servicesdependedonarray = response_body.get("ServicesDependedOn")
status = response_body.get("Status")
log.info("Service Status: " + status)

 //check on different status of service

if (status == 4) {
 log.info("The service status for service name: " + service_name + " is running")
 user_message= "The service status for service name: " + service_name + " is running"
 output.set("user_message", user_message)

} else if (status == 1) {
 log.info("The service status for service name: " + service_name + " is not running")
 user_message= "The service status for service name: " + service_name + " is not running"
 output.set("user_message", user_message)
} else {
 log.info("Unable to find the service status of service: " + service_name)
 user_message= "Unable to find the service status of service: " + service_name
 output.set("user_message", user_message)
}

if (response_exitcode == 0) {
 log.info("Success in executing WinRM Connector, where exitcode ::" + " " + response_exitcode + "| message ::" + " " + response_message)
 log.trace("Finished executing winrm flintbit with success...")
  //flintbit call to update service aide worklogs
 }
else {
 log.error("Failure in executing WinRM Connector where, exitcode :: " + response_exitcode + " " + "| message ::" + " " + response_message)
 output.set("error", response_message)
}
}
catch (error) {
    log.error("Error message: " + error)
    output.set("exit-code", 1)
}
log.trace("Finished executing flint-util:windows:windows_service_status.js flintbit...")
