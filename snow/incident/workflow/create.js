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

//Starting execution of flintbit

log.trace("Started executing 'flint-snow:incident:workflow:create.js' flintbit...")
connector_name = "servicenow"// Name of the ServiceNow Connector
action = 'create-record'
tableName = 'incident'
description = input.get('description')
short_description = input.get('short_description')
impact = input.get('impact')
urgency = input.get('urgency')
caller_id = input.get('caller_id')
optional_fields=input.get("optional_fields")
if (optional_fields != null && optional_fields != "") {
    optional_fields=JSON.parse(optional_fields)
  }
mandatory_data = {};
mandatory_data['description'] = description;
mandatory_data['short_description'] = short_description;
mandatory_data['impact'] = impact;
mandatory_data['urgency'] = urgency;
mandatory_data['caller_id'] = caller_id;
for(fields in optional_fields){
  mandatory_data[fields]=optional_fields[fields]
}
mandatory_data=util.json(mandatory_data)
log.info("Data:: " +mandatory_data)
url = input.get("itsm_connection.encryptedCredentials.target")
username = input.get("itsm_connection.encryptedCredentials.username")
password = input.get("itsm_connection.encryptedCredentials.password")

if (url == null || url == "") {
    throw "Please provide ServiceNow instance URL to connect to the instance"
  }

if (username == null || username == "") {
    throw "Please provide ServiceNow instance Username to connect to the instance"
  }

if (password == null || password == "") {
    throw "Please provide ServiceNow instance Password  to connect to the instance"
  }

response = call.connector(connector_name)
               .set("hostname",url)
               .set("username",username)
               .set("password",password)
               .set('action', action)
               .set('table-name', tableName)
               .set('data', mandatory_data)
               .sync()

//ServiceNow Connector Response Meta Parameters
response_exitcode = response.exitcode()           //Exit status code
response_message = response.message()             //Execution status message

//ServiceNow Connector Response Parameters
response_body = response.get("body")
result = util.json(response_body)
incident_number= result.get("result.number")
log.info("Incident Number: " +incident_number)

if (response_exitcode == 0) {
    log.info("Success in executing serviceNow Connector, where exitcode :: " + response_exitcode + "| message :: " + response_message)
    //User Message
    user_message = ("Incident is created successfully in ServiceNow with Incident number: " +incident_number)
    output.set('result', response_body).set('response_exitcode', 0).set("user_message",user_message)
    log.trace("Finished executing 'serviceNow' flintbit with success...")

}

else {
    log.error("Failure in executing serviceNow Connector where, exitcode ::" + response_exitcode + "| message :: " + response_message)
    output.set('error', response_message).set('response_exitcode', -1)
    log.trace("Finished executing 'serviceNow' flintbit with error...")

}
