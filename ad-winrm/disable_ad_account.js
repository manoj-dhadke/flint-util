log.trace("Started executing flint-util:ad:enable_account.rb flintbit...")

    login_name = input.get("login-name")
    command = "Disable-adAccount"+" "+ login_name
    // Call flintbit synchronously and set arguments
    flintbit_response = call.bit("example:AD:winram_connect.js")
                             .set("command", command)
                             .sync()

success_message = flintbit_response.message
result= flintbit_response.get("result")
error_message= flintbit_response.get("error")

if (flintbit_response.get("exit-code") == 0)
{
log.info("Success in executing WinRM Connector, where exitcode ::"+ flintbit_response.get("exit-code")+" | message ::"+ success_message)
    log.info("Command executed ::"+command+" | Command execution results ::"+ result)
    user_message = "**Account with username :'"+login_name+"' is enabled successfully**"
    log.info("Account Enabled operation successful    ::user_message::"+ user_message)
    output.set("result", result).set("user_message",user_message)
    log.trace("Finished executing winrm flintbit with success...")
  }
else
{
    log.error("Failure in executing WinRM Connector where, exitcode ::"+ flintbit_response.get("exit-code")+" | message ::"+ error_message)
    log.error("Account Enabled operation unsuccessful")
    user_message = ("**Error:** in enabling the AD account"+ login_name)
    log.error("Failure in executing WinRM Connector where, exitcode ::"+ flintbit_response.get("exit-code")+" | message ::"+ error_message +" | for user ::"+ user_message)
    output.set("error", error_message).set("user_message",user_message)
    log.trace("Finished executing winrm flintbit with error...")
}

log.trace("Finished executing flint-util:ad:enable_account.rb flintbit")
