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

log.trace("Started executing serviceaide:ad:reset_password.rb flintbit...")
// Input parameters
login_name = input.get("login-name")
log.info("loginname:" + login_name)
login = login_name.substring(0, login_name.indexOf("@") + "@".length)
log.info("loginname:" + login)
loginname = login.replace("@", " ")
log.info("loginname:" + loginname)
password = input.get("password")
to = input.get("to")
// ServiceAide ticket Id
ticket_id = input.get("ticket_id")
flint_job_id = input.jobid()
log.info("Job-id:" + flint_job_id)
// Reset AD user password powershell command
command = " Import-module activedirectory;Set-ADAccountPassword -Identity " + " " + loginname.toString() + " " + " -Reset -NewPassword (ConvertTo-SecureString -AsPlainText " + " " + password.toString() + " " + " -Force)"
log.info("Command" + " " + command)
// Worklog messages to update worklog at ServiceAide ticket
work_description_ack = "Flint has recieved the ticket with ID " + ticket_id + ". Flint is trying to resolve it. Flint job-id : " + " " + flint_job_id
work_description = "Ticket Id : " + ticket_id + " " + " Password reset performed successfully"


// Call flintbit to add initial worklog
add_serviceaide_worklog = call.bit("flint-util:serviceaide:servicerequest:service_request_add_worklog.groovy")
  .set("ticket_id", ticket_id)
  .set("work_description", work_description_ack)
  .sync()

flintbit_response = call.bit("flint-util:serviceaide:ad:winrm_commonconnect.js")
  .set("command", command)
  .sync()

//extracting response of connector call
success_message = flintbit_response.message()
result = flintbit_response.get("result")
error_message = flintbit_response.get("error")
exitcode = flintbit_response.get("exit-code")
//exception handling
//case to execute if success_message is the response
if (exitcode == 0) {
  log.info("Success in executing WinRM Connector!!!!!!!!!, where exitcode ::" + " " + flintbit_response.get("exit-code") + " " + " | message ::" + " " + success_message)
  //log.info("Command executed ::"+" "+command+" "+" | Command execution results ::"+" "+result)
  log.info("Account reset operation successful")
  //output.set("result", result)
  log.trace("Finished executing winrm flintbit with success...")
  message_from_reset = "Password for User: '" + " " + loginname + " " + "' has been reset successfully"
  command = "Import-module activedirectory;Set-ADUser" + " " + loginname + " " + " -changepasswordatlogon 1"
  flintbit_response1 = call.bit("flint-util:serviceaide:ad:winrm_commonconnect.js")
    .set("command", command)
    .sync()
  exitcode_response = flintbit_response1.get("exit-code")
  error_message = flintbit_response1.get("error")
  if (exitcode_response == 0) {
    body = "AD account password for logon name "+loginname + " has been reset successfully. \nThe new password of the AD account is: "+password
    // Flintbit call to send SMS
    // var twilio_response;
    // var i;
    // for (i = 0; i <= 4; i++) {
    //   log.info("Trying to send SMS:: " + (i + 1))
    //   twilio_response = call.bit("flint-twilio:sms:send.rb")
    //     .set("message", body)
    //     .set("to", to)
    //     .sync()
    //   log.info("twilio_response:: " + twilio_response)
    //   exitcode_twilio_sms = twilio_response.get("exit-code")
    //   if (exitcode_twilio_sms == 0) {
    //     break;
    //   }
    // }
    //log.info("twilio_response:: " + twilio_response)
    // exitcode_twilio = twilio_response.get("exit-code")
    // log.info("twilio output:" + twilio_response)
    // if (exitcode_twilio == 0) {
    //   log.info("Successfully send SMS to the user")
    // } else {
    //   log.error("Failed to send SMS to the user")
    //   work_description_fail = "Failed to send SMS to the user"
    //   // Call flintbit to update ticket status
    //   update_serviceaide_status = call.bit("flint-util:serviceaide:servicerequest:service_request_update_error_status.groovy")
    //     .set("ticket_id", ticket_id)
    //     .sync()
    //   if (update_serviceaide_status.exitcode() == 0) {
    //     add_serviceaide_worklog = call.bit("flint-util:serviceaide:servicerequest:service_request_add_error_worklog.groovy")
    //       .set("ticket_id", ticket_id)
    //       .set("work_description", work_description_fail)
    //       .sync()
    //   } else {
    //     log.info("Failed to update ticket status")
    //   }
    // }
    log.info("Success in executing command of change password at first login")
    message_from_firstlogin = "You can now change the default password at your first login. \nNew password sent successfully on contact number :" + " " + to

  } else {
    log.error("Error in executing command of change password at first login")
    message_from_firstlogin = "Please login with default password"
    work_description_fail = "Error occured while executing ticket" + " " + ticket_id + ". The error occured due to " +error_message
    update_serviceaide_status = call.bit("flint-util:serviceaide:servicerequest:service_request_update_error_status.groovy")
      .set("ticket_id", ticket_id)
      .sync()
    if (update_serviceaide_status.exitcode() == 0) {
      add_serviceaide_worklog = call.bit("flint-util:serviceaide:servicerequest:service_request_add_error_worklog.groovy")
        .set("ticket_id", ticket_id)
        .set("work_description", work_description_fail)
        .sync()
    } else {
      log.info("Failed to update ticket status")
    }
  }

  user_message = "Action details: "+ message_from_reset + " " + message_from_firstlogin
  output.set("result", result).set("user_message", user_message)
  update_serviceaide_status = call.bit("flint-util:serviceaide:servicerequest:service_request_update_status.groovy")
    .set("ticket_id", ticket_id)
    .sync()
    
  log.info("Status response:: " + update_serviceaide_status)
  if (update_serviceaide_status.exitcode() == 0) {
    add_serviceaide_worklog = call.bit("flint-util:serviceaide:servicerequest:service_request_add_worklog.groovy")
      .set("ticket_id", ticket_id)
      .set("work_description", work_description)
      .sync()
  } else {
    log.info("Failed to update ticket status")
  }
} else {
  user_message = "Error in executing reset password"
  output.set("error", error_message).set("exit-code", -1).set("user_message", user_message)
  work_description_fail = "Error occured while executing ticket" + " " + ticket_id + ". " + "The error occured due to" + " " + error_message
  update_serviceaide_status = call.bit("flint-util:serviceaide:servicerequest:service_request_add_error_worklog.groovy")
    .set("ticket_id", ticket_id)
    .sync()
  if (update_serviceaide_status.exitcode() == 0) {
    add_serviceaide_worklog = call.bit("flint-util:serviceaide:servicerequest:service_request_add_error_worklog.groovy")
      .set("ticket_id", ticket_id)
      .set("work_description", work_description_fail)
      .sync()
  } else {
    log.info("Failed to update ticket status")
  }
}
log.trace("Finished executing flint-util:ad-winrm:reset_password.rb flintbit")
