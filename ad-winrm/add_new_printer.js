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

/**
** Creation Date: 2nd Jan 2019
** Summary: This is Active Directory Add Printer flintbit.
** Description: This flintbit is developed to'Add New Printer'in Active Directory using WinRM connector.
**/

log.trace("Started executing flint-util:ad-winrm:add_new_printer.js flintbit...")
// Input from Flint
try{
target = input.get("target")
username = input.get("username")
password = input.get("password")    
printer_name = input.get("printer_name")
port_name = input.get("port_name")
printer_driver_name = input.get("printer_driver_name")
command = "Import-module activedirectory;Add-Printer -Name" + " \"" +printer_name+ "\" " + "-DriverName" + " \"" +printer_driver_name + "\" " + "-PortName" + " \""+ port_name +"\""
log.info("Command: " + command)
if(printer_name == null || printer_name =="")
{
    throw "Please provide the'printer_name'to add printer"
}
if(port_name == null || port_name == "")
{
    throw "Plaease provide the'port_name'to add printer"
}
if(printer_driver_name == null || printer_driver_name == "")
{
    throw "Please provide the 'printer_driver_name' to add printer"
}

// Call flintbit synchronously and set required arguments/parameters
 flintbit_call_response = call.bit("flint-util:ad-winrm:winrm_commonconnect.js")
                              .set(input)
                              .set("command", command)
                              .sync()
//extracting response of connector call
 success_message = flintbit_call_response.message()
 result = flintbit_call_response.get("result")
 error_message = flintbit_call_response.get("error")
//exception handling
 if (flintbit_call_response.exitcode() == 0) 
 {
  log.info("Success in executing WinRM Connector, where exitcode ::" + flintbit_call_response.exitcode() + " | message ::" + success_message)
  log.info("Command executed ::" + command + " | Command execution results ::" + result)
  user_message = "**Printer added locally with name :'" + printer_name + "' added successfully**"
  output.set("result", result).set("user_message", user_message)
 }
 else 
 {
  log.error("Failure in executing WinRM Connector where, exitcode ::" + flintbit_call_response.exitcode() + " | message ::" + error_message)
  user_message = "**Failed to add printer in Active Directory with error message: ** " +error_message
  output.set("error", error_message).set("user_message", user_message)
  log.trace("Finished executing winrm flintbit with error...")
 }
}
catch (error) {
    log.error("Error message: " + error)
    output.set("exit-code", 1)
}
 log.trace("Finished executing flint-util:ad-winrm:add_new_printer.js flintbit...")
