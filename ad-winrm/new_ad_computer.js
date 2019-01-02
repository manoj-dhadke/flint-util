/**
** Creation Date: 14th Sep 2018
** Summary: This is Active Directory Add Computer flintbit.
** Description: This flintbit is developed to'Add New Computer'in Active Directory using WinRM connector.
**/

log.trace("Started executing flint-util:ad-winrm:new_ad_computer.js flintbit...")
// Input from Flint
try{
target = input.get("target")
username = input.get("username")
password = input.get("password")       
domain_controller = input.get("domain_controller")
domain_controller_com = input.get("domain_controller_com")
ou_name_parent = input.get("ou_name_parent")
ou_name_child = input.get("ou_name_child")
computer_name = input.get("computer_name")
SamAccountName = input.get("SamAccountName")
path= "OU=" + ou_name_child +",OU=" + ou_name_parent + ",DC="+ domain_controller + ",DC=" + domain_controller_com
command = "Import-module activedirectory;New-ADComputer -Name "+" "+computer_name +" "+"-SamAccountName"+" "+SamAccountName+" "+"-path"+ " '" + path  +"'"+" -Confirm:$False"
log.info("Command......::" + command)
if(domain_controller == null || domain_controller =="")
{
    throw "Please provide the'domain_controller'to add computer"
}
if(domain_controller_com == null || domain_controller_com == "")
{
    throw "Plaease provide the'domain_controller_com'to add computer"
}
if(ou_name_parent == null || ou_name_parent == "")
{
    throw "Please provide the'ou_name_parent'to add the computer"
}
if(ou_name_child == null || ou_name_child == "")
{
    throw "Please provide the'ou_name_child'"
}

// Call flintbit synchronously and set required arguments/parameters
 flintbit_call_response = call.bit("flint-util:ad-winrm:winram_connect.js")
                              .set("command", command)
                              .set(input)
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
  user_message = "**Computer with name :'" + computer_name + "' added successfully**"
  output.set("result", result).set("user_message", user_message)
 }
 else 
 {
  log.error("Failure in executing WinRM Connector where, exitcode ::" + flintbit_call_response.exitcode() + " | message ::" + error_message)
  log.error("Failed to add computer in Active Directory")
  user_message = "**Failed to add computer in Active Directory**"
  output.set("error", error_message).set("user_message", user_message)
 }
}
catch (error) {
    log.error("Error message: " + error)
    output.set("exit-code", 1)
}
 log.trace("Finished executing flint-util:ad_winrm:new_ad_computer.js flintbit")