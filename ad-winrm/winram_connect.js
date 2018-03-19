log.trace("Started executing flint-demo-box:ad:winrm_commonconnect.rb")
target = config.global("winrm.target")
log.info ("target::" +target)
username = config.global("winrm.username")
password = config.global("winrm.password")
transport = config.global("winrm.transport")
port = config.global("winrm.port")
connector_name = "winrm"
operation_timeout= 80
shell = "ps"
command = input.get("command")
log.info ("Command::" +command)

connector_response = call.connector(connector_name)
                               .set("target", target)
                               .set("username", username)
                               .set("password", password)
                               .set("shell", shell)
                               .set("port", port)
                               .set("transport", transport)
                               .set("command",command)
                               .set("operation_timeout",operation_timeout)
                               .sync()



response_exitcode = connector_response.exitcode()
response_message = connector_response.message()

response_body = connector_response.get("result")

if (response_exitcode == 0)
{
    log.info("Success in executing WinRM Connector, where exitcode ::" + response_exitcode + "| message ::" +response_message)
    log.info("Command executed ::" +command + " | Command execution results ::"+ response_body)
    output.set("result", response_body).set("exit-code", 0)
    log.trace("Finished executing flintbit with success...")
  }
else
{
    log.error("Failure in executing WinRM Connector where, exitcode ::" + response_exitcode + "| message ::"+ response_message)
    output.set("error", response_message).set("exit-code", -1)
    log.trace("Finished executing winrm flintbit with error...")
}
