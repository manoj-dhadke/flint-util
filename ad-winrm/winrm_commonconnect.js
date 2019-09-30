/**
** Creation Date: 20th May 2018
** Summary: This is winrm_commonconnect.js flintbit to execute commands on Windows server remotely.
** Description: The winrm_commonconnect flintbit is developed as a common flintbit which uses WinRM connector to connect and execute commands on Windows server.
**/

log.trace("Started executing flint-util:ad-winrm:winrm_commonconnect.js flintbit.")
// Input from Flint
    log.info("Input: " +input)
    target = input.get("target")
    username = input.get("username")
    password = input.get("password")
    transport = config.global("winrm.transport")
    port = config.global("winrm.port")
    connector_name = config.global("winrm.connector_name")
    shell = config.global("winrm.shell")
    no_ssl_peer_verification = config.global("winrm.no_ssl_peer_verification")
    command = input.get("command")
    operation_timeout = 80

    if (target == null || target == "") {
        throw "Please provide 'target/IP' to connect with machine"
    }
    if (username == null || username == "") {
        throw "Please provide 'username' to connect with machine"
    }
    if (password == null || password == "") {
        throw "Please provide 'password' to connect with machine"
    }

    if (command == null || command == "") {
        throw "Command not provided"
    }

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
                             .set("no_ssl_peer_verification", no_ssl_peer_verification)
                             .timeout(300000)
                             .sync()


    //extracting response of connector call
    response_exitcode = connector_response.exitcode() // exitcode
    response_message = connector_response.message() // message
    response_body = connector_response.get("result")
    //exception handling
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


log.trace("Finished executing flint-util:ad-winrm:winrm_commonconnect.js flintbit.")