log.trace("Started executing flint-demo-box:ad:enable_account.rb flintbit...")

    login_name = input.get("login-name")
    command = "Enable-adAccount"+" "+ login_name
    //# Call flintbit synchronously and set arguments
    flintbit_response = call.bit("flint-util:ad-winrm:winram_connect.js")
                             .set("command", command)
                             .sync()

success_message = flintbit_response.message
result= flintbit_response.get("result")
error_message= flintbit_response.get("error")

if (flintbit_response.exitcode() == 0)
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
    //#@new_error = @error_message[/[^\d]+/]
    //#@error_msg = @new_error.gsub(/^At line\:/, '')
    //#@error_msgs = @error_msg.gsub(/\'/,'')
    //#@user_message = """**Error:#{@error_msgs}**"""
  //  a = error_message.split(/At line/).first
  //  user_message = "**Error:**"+a.rstrip
    log.error("Failure in executing WinRM Connector where, exitcode ::"+ flintbit_response.get("exit-code")+" | message ::"+ error_message +" | for user ::"+ user_message)
    output.set("error", error_message).set("user_message",user_message)
    log.trace("Finished executing winrm flintbit with error...")
}

log.trace("Finished executing flint-demo-box:ad:enable_account.rb flintbit")
