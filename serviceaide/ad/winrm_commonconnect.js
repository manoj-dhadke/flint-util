log.trace("Started executing serviceaide:ad:winrm_commonconnect.js")
 // Input from Flint's global config
target = config.global("activedirectory_server_config.target")
username = config.global("activedirectory_server_config.username")
password = config.global("activedirectory_server_config.password")
transport = config.global("activedirectory_server_config.transport")
port = config.global("activedirectory_server_config.port")
connector_name = config.global("activedirectory_server_config.connector_name")
shell = config.global("activedirectory_server_config.shell")
no_ssl_peer_verification = config.global("activedirectory_server_config.no_ssl_peer_verification")
command = input.get("command")
log.info("Command::" + command)
ticket_id = input.get("ticket_id") // ServiceAide ticket Id
operation_timeout = 80
log.info("target: " + target)
// Flint connector call
connector_response = call.connector(connector_name)
                         .set("target", target)
                         .set("username", username)
                         .set("password", password)
                         .set("shell", shell)
                         .set("port", port)
                         .set("transport", transport)
                         .set("command", command)
                         .set("operation_timeout", operation_timeout)
                         .set("no_ssl_peer_verification",no_ssl_peer_verification)
                         .timeout(300000)
                         .sync()


//extracting response of connector call
response_exitcode = connector_response.exitcode() // exitcode
response_message = connector_response.message() // message
response_body = connector_response.get("result")
//exception handling
//case to execute if success_message is the response

if (response_exitcode == 0) {
 log.info("Success in executing WinRM Connector, where exitcode ::" + response_exitcode + "| message ::" + response_message)
 log.info("Command executed ::" + command + " | Command execution results ::" + response_body)
 output.set("result", response_body).set("exit-code", 0)
 log.trace("Finished executing flintbit with success...")
} else {
 log.error("Failure in executing WinRM Connector where, exitcode ::" + response_exitcode + "| message ::" + response_message)
 output.set("error", response_message).set("exit-code", -1)
 log.trace("Finished executing winrm flintbit with error...")
}
log.trace("Finished executing serviceaide:ad:winrm_commonconnect.js")