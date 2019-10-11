/**
** Creation Date: 11th Oct 2019
** Summary: This is to update close notes,state of ServiceNow SR
** Description: This flintbit is used to update close notes,state of ServiceNow SR
**/
log.info("Started executing 'flint-util:snow:sr:update_state.js' ")

//Input JSON to be parsed and extracting required values from SNOW SR form

log.info("Inputs from ServiceNow SR form:: " +input)
sys_id = input.get("sys_id")  //RITM Sys-id queried from table (sc_req_item)
servicenow_connector_name = 'servicenow'
state = input.get("state")   //ex: 'Closed Complete', 'Work in Progress' 
close_notes = input.get("close_notes")
comments = input.get("comments")
action = 'update-record'
tablename = 'sc_req_item'
sysparm_display_value = false
data = input.get('data')
url = input.get("itsm_connection.encryptedCredentials.target")
username = input.get("itsm_connection.encryptedCredentials.username")
password = input.get("itsm_connection.encryptedCredentials.password")
log.info("URL:: " +url+ "Username:: " +username)

if (url == null || url == "") {
    throw "Please provide ServiceNow instance URL to connect to the instance"
  }

if (username == null || username == "") {
    throw "Please provide ServiceNow instance Username to connect to the instance"
  }

if (password == null || password == "") {
    throw "Please provide ServiceNow instance Password  to connect to the instance"
  }
  if (sys_id == null || sys_id == "") {
    throw "Please provide valid Sys-Id to update closenotes and state of SR"
  }

  if (comments == null || comments == "") {
    throw "Please provide valid comments to update the ServiceNow SR"
  }
  
  if (state == null || state == "") {
    throw "Please provide valid work notes to update the SR"
  }

  if (close_notes == null || close_notes == "") {
    throw "Please provide valid close notes to update the SR"
  }

  data = {};
  data["state"] = state                 // Update state
  data["close_notes"] = close_notes     // Add close notes
  data["comments"] = comments           // Add comments 

response = call.connector(servicenow_connector_name)
               .set("hostname",url)
               .set("username",username)
               .set("password",password)
               .set('action', action)
               .set('table-name', tablename)
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
log.trace("Finsished executing 'flint-util:snow:sr:update_state.js' flintbit...")