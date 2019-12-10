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

log.trace("Started executing flint-util:ad_winrm:create_ad_object.js flintbit...")
//Input Parameters
domain_controller = input.get("domain_controller")
domain_controller_com = input.get("domain_controller_com")
type = input.get("type")
ou_name = input.get("ou_name")
ad_object_name = input.get("ad_object_name")
object_data = input.get("object_data")
path= "OU=" + ou_name + ",DC="+ domain_controller + ",DC=" + domain_controller_com
command = "Import-module activedirectory;New-ADObject -Name" + " '" + ad_object_name + "' " + " -Type" + " '" + type + "' " + " -Path" + " '" + path + "'"
log.info("Command:" + command)

 // Call flintbit synchronously and set arguments
 flintbit_response = call.bit("flint-util:ad-winrm:winram_connect.js")
                         .set("command", command)
                         .sync()

 success_message = flintbit_response.message
 result = flintbit_response.get("result")
 error_message = flintbit_response.get("error")

 //exception handling
 //case to execute if success_message is the response
 if (flintbit_response.exitcode() == 0) {
  log.info("Success in executing WinRM Connector, where exitcode ::" + flintbit_response.exitcode() + " | message ::" + success_message)
  log.info("Command executed ::" + command + " | Command execution results ::" + result)
  user_message = "**AD object with object name :'" + ad_object_name + "' created successfully**"
  log.info("AD object creation operation successful")
  output.set("result", result).set("user_message", user_message)
  log.trace("Finished executing winrm flintbit with success...")
 } else {
  log.error("Failure in executing WinRM Connector where, exitcode ::" + flintbit_response.exitcode() + " | message ::" + error_message)
  log.error("AD Object creation operation unsuccessful")
  user_message = "**AD Object creation operation unsuccessful**"
  log.error("Failure in executing WinRM Connector where, exitcode ::" + flintbit_response.exitcode() + " | message ::" + error_message + " | for user ::" + user_message)
  output.set("error", error_message).set("user_message", user_message)
  log.trace("Finished executing winrm flintbit with error...")
 }

 log.trace("Finished executing flint-util:ad_winrm:create_ad_object.js flintbit")
