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

log.trace("Started executing 'flint-util:ad-winrm:provision_ad_account.js' flintbit...")
// Input parameters
first_name = input.get('first_name')
last_name = input.get('last_name')
login_name = input.get('login_name')
initial = input.get('initial')
employee_id = input.get('employee_id')
password = input.get('password')
full_name = "'" + first_name + " " + last_name + "'"
email_domain = config.global('ad_credentials.email_domain')
user_principal_name = login_name + email_domain
log.info("Principle_name" + user_principal_name)
// Golbal Config
target = config.global("ad_credentials.target")
target_username = config.global("ad_credentials.username")
target_password = config.global("ad_credentials.password")

// Create New AD user powershell command
command = "Import-module activedirectory;New-ADUser -Name" + " " + full_name + " " + " -GivenName" + " " + first_name + " " + "-Surname" + " " + last_name + " " + " -Initials" + " " + initial + " " + " -SamAccountName" + " " + login_name + " " + " -UserPrincipalName" + " " + user_principal_name + " " + "-EmployeeID" + " " +
  employee_id + " " + "-AccountPassword (ConvertTo-SecureString -AsPlainText" + " " + password + " " + "  -Force)"
//Call flintbit synchronously and set arguments
flintbit_response = call.bit("flint-util:ad-winrm:winrm_commonconnect.js")
  .set('username', target_username)
  .set('target', target)
  .set('password', target_password)
  .set('command', command)
  .sync()
//extracting response of connector call
success_message = flintbit_response.message()
result = flintbit_response.get("result")
error_message = flintbit_response.get("error")
exitcode = flintbit_response.get("exit-code")

if (exitcode == 0) {
  log.info("Success in executing WinRM Connector, where exitcode ::" + flintbit_response.exitcode() + " | message ::" + success_message)
  log.info("Command executed ::" + command + " | Command execution results ::" + result)
  // Enable AD user powershell command
  command = "Import-module activedirectory;Enable-ADAccount" + " " + login_name
  flintbit_response_enable = call.bit("flint-util:ad-winrm:winrm_commonconnect.js")
    .set('username', target_username)
    .set('target', target)
    .set('password', target_password)
    .set('command', command)
    .sync()
  exitcode_flintbit_response_enable = flintbit_response_enable.get("exit-code")
  error_message_enable = flintbit_response_enable.get("error")

  if (exitcode_flintbit_response_enable == 0) {
    log.info('Success in executing command of Enable-ADAccount')
  } else {
    log.info('Error in executing command of Enable-ADAccount')
  }
  // Set AD user password Powershell command
  command = "Import-module activedirectory;Set-ADUser" + " " + login_name + " " + "-changepasswordatlogon 1"
  flintbit_response_change_password = call.bit("flint-util:ad-winrm:winrm_commonconnect.js")
    .set('username', target_username)
    .set('target', target)
    .set('password', target_password)
    .set('command', command)
    .sync()
  exitcode_flintbit_response_password = flintbit_response_change_password.get("exit-code")
  error_message_change_password = flintbit_response_change_password.get("error")
  if (exitcode_flintbit_response_password == 0) {
    log.info("Success in executing command of change password at first login")

  }
  else {
    log.error("Error in executing command of change password at first login")
  }
} else {
  log.error("Error in provisionong AD user account")
  output.exit(-1, error_message)
}
log.trace("Finished executing 'flint-util:ad-winrm:provision_ad_account.js' flintbit")
