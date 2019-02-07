/**
** Creation Date: 20th May 2018
** Summary: This is Active Directory User Account Enable flintbit.
** Description: This flintbit is developed to enable Active Directory User Account using WinRM connector.
**/

log.trace("Started executing flint-util:ad-winrm:enable_ad_account.js flintbit.")
  // Input from Flint
  login_name = input.get('login_name')
  command = "Import-module activedirectory;Enable-adAccount" + " " + login_name
  target = input.get('target')
  username = input.get('username')
  password = input.get('password')

  if (login_name == null || login_name == "") {
    throw "Please provide Login-Name of AD user Account"
  }
  
  if (target == null || target == "") {
    target = config.global("ad_credentials.target")
    if (target == null || target == ""){
    throw "Please provide 'target/IP' to connect with machine"

    }
    
  }

  if (username == null || username == "") {
    username = config.global("ad_credentials.username")
    if (username == null || username == ""){
    throw "Please provide 'username' to connect with machine"
    }
    
  }

  if (password == null || password == "") {
    password = config.global("ad_credentials.password")
    if (password == null || password == "")
    {
    throw "Please provide 'password' to connect with machine"
    }
    
  }

  // Call flintbit synchronously and set required arguments/parameters
  flintbit_call_response = call.bit('flint-util:ad-winrm:winrm_commonconnect.js')
                               .set(input)
                               .set("command",command)
                               .timeout(300000)
                               .sync()

 //extracting response of flintbit call                              
  success_message = flintbit_call_response.message
  result = flintbit_call_response.get("result")
  error_message = flintbit_call_response.get("error")
  exitcode = flintbit_call_response.get("exit-code")

  if (exitcode == 0) {
    log.info("Success in executing WinRM Connector, where exitcode ::" + flintbit_call_response.exitcode() + "| message ::" + success_message)
    log.info("Command executed ::" + command + "| Command execution results ::" + result)
    user_message = "**Account with username :" + login_name + "is enabled successfully**"
    log.info("Account Enable operation successful::user_message::" + user_message)
    output.set('result', result).set('user_message', user_message).set('exit-code', 0)
  }
  else {
    log.error("Failure in executing WinRM Connector where, exitcode ::" + flintbit_call_response.exitcode() + " | message ::" + error_message)
    log.error("Account Enable operation unsuccessful")
    log.error("Failure in executing WinRM Connector where, exitcode ::" + flintbit_call_response.exitcode() + " | message ::" + error_message + " | for user ::" + user_message)
    output.set("error", error_message).set("user_message", user_message).set('exit-code', -1)
    output.exit(-1, error_message)
  }
log.trace("Finished executing 'example:ad:enable_user.js' flintbit")