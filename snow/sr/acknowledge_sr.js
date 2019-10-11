/**
** Creation Date: 11th Oct 2019
** Summary: This is to update work notes,comments,state of ServiceNow SR
** Description: This flintbit is used to update work notes,comments,state of ServiceNow SR
**/
log.info("Started executing 'flint-util:snow:sr:acknowledge_sr.js' ")

//Input JSON to be parsed and extracting required values from SNOW SR form

log.info("Inputs from ServiceNow SR form:: " +input)
sys_id = input.get("sys_id") //RITM Sys-id queried from table (sc_req_item)
servicenow_connector_name = 'servicenow'
work_notes = input.get("work_notes")
comments = input.get("comments")
action = 'update-record'
tableName = 'sc_req_item'
sys_id = input.get('sys_id')
sysparm_display_value = false
data = input.get('data')
url = input.get("url")
username = input.get("username")
password = input.get("password")

if (url == null || url == "") {
    throw "Please provide ServiceNow instance URL to connect to the instance"
  }

if (username == null || username == "") {
    throw "Please provide ServiceNow instance Username to connect to the instance"
  }

if (password == null || password == "") {
    throw "Please provide ServiceNow instance Password  to connect to the instance"
  }

  if (comments == null || comments == "") {
    throw "Please provide valid comments to update the ServiceNow SR"
  }
  
  if (work_notes == null || work_notes == "") {
    throw "Please provide valid work notes to update the SR"
  }


data = {};
data["work_notes"] = work_notes  // Add work notes 
data["comments"] = comments     // Add comments    

response = call.connector(servicenow_connector_name)
               .set("hostname",url)
               .set("username",username)
               .set("password",password)
               .set('action', action)
               .set('table-name', tableName)
               .set('data', data)
               .set('sysparm_display_value', sysparm_display_value)
               .set('sys-id', sys_id)
               .sync()


// ServiceNow Connector Response Meta Parameters
response_exitcode = response.exitcode()           // Exit status code
response_message = response.message()             // Execution status message


// ServiceNow Connector Response Parameters
response_body = response.get('body') // Response body
log.info("Response: " +response_body)

if (response_exitcode == 0) {
    log.info("Success in executing serviceNow Connector, where exitcode :: " + response_exitcode + "| message :: " + response_message)
    output.set('result', response_body).set('response_exitcode', 0)
    log.trace("Finished executing 'serviceNow' flintbit with success...")

}

else {
    log.error("Failure in executing serviceNow Connector where, exitcode ::" + response_exitcode + "| message :: " + response_message)
    output.set('error', response_message).set('response_exitcode', -1)
    log.trace("Finished executing 'serviceNow' flintbit with error...")

}
log.trace("Finsished executing 'flint-util:snow:sr:update.js' flintbit...")