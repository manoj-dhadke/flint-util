log.trace("Started executing flint-util:ad-winrm:disable_ad_account.js flintbit...")
    login_name = input.get("login_name")
    target = config.global("ad_credentials.target")
    // target = input.get("target")
    username = config.global("ad_credentials.username")
    // username = input.get("username")
    password = config.global("ad_credentials.password")
    // password = input.get("password")
    log.info("loginname:" + login_name)
    login = login_name.substring(0, login_name.indexOf("@") + "@".length)
    log.info("loginname:" + login)
    loginname = login.replace("@", " ")
    log.info("loginname:" + loginname)
    command = "Import-module activedirectory;Disable-adAccount"+" "+ loginname
    // Call flintbit synchronously and set arguments
    flintbit_response = call.bit("flint-util:ad-winrm:winrm_commonconnect.js")
                            .set('username', username)
                            .set('target', target)
                            .set('password', password)
                            .set("command",command)
                            .sync()
success_message = flintbit_response.message()
result= flintbit_response.get("result")
error_message= flintbit_response.get("error")
if (flintbit_response.get('exit-code') == 0)
{
log.info("Success in executing WinRM Connector, where exitcode ::"+ flintbit_response.exitcode()+" | message ::"+ success_message)
    log.info("Command executed ::"+command+" | Command execution results ::"+ result)
    user_message = "**Account with username :'"+login_name+"' is disable successfully**"
    log.info("Account Disable operation successful    ::user_message::"+ user_message)
    output.set("result", result).set("user_message",user_message).set('exit-code',0)
    log.trace("Finished executing winrm flintbit with success...")
  }
else
{
    log.error("Failure in executing WinRM Connector where, exitcode ::"+ flintbit_response.exitcode()+" | message ::"+ error_message)
    log.error("Account Disable operation unsuccessful")
    user_message = ("**Error:** in disabling the AD user account"+ login_name)
    log.error("Failure in executing WinRM Connector where, exitcode ::"+ flintbit_response.exitcode()+" | message ::"+ error_message +" | for user ::"+ user_message)
    output.set("error", error_message).set("user_message",user_message).set('exit-code', -1)
    log.trace("Finished executing winrm flintbit with error...")
    output.exit(-1, error_message)
}
log.trace("Finished executing flint-util:ad-winrm:disable_ad_account.js flintbit")