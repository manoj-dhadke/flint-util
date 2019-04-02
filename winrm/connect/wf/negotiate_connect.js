/**
** Creation Date: 26th March 2019
** Summary: WinRM Command Execution. 
** Description: This flintbit is developed to execute any WinRM command.
**/

log.trace("Started executing 'flint-util:winrm:connect:wf:negotiate_connect.js' flintbit.")

log.info("Inputs for flintbit 'flint-util:winrm:connect:wf:negotiate_connect.js' are: \n"+input)

// Service Parameters
winrm_negotiate_service_params = input.get('winrm_negotiate_service_params')
connector_name = winrm_negotiate_service_params.get("connector_name")    // Name of the WinRM connector
// no_ssl_peer_verification = winrm_negotiate_service_params.get("no_ssl_peer_verification")
timeout = winrm_negotiate_service_params.get('timeout')                  // Timeout in milliseconds, taken by
operation_timeout = winrm_negotiate_service_params.get("operation_timeout")

// Service Inputs
target = input.get("target")                    // target where the command will be executed
username = input.get("username")                // Target username
password = input.get("password")                // Target password
shell = input.get("shell")                      // Type of execution - powershell or cmd
transport = input.get("transport")              // Transport type protocol
command = input.get("command")                  // Command to be executed
port = input.get("port")                        // WinRM Port
ssl = input.get('ssl')                // This field is for no ssl peer verification. Protocol indicates SSL peer verification check. true or false.  

log.info("Port input type before parsing: "+typeof port)

// Set default SSL auth preference

if(ssl== null || ssl == ""){
    log.info("SSL is not specified. Setting SSL to true by default")
    // Default No SSL Peer Verification is true 
    ssl = false        
    log.trace("isSSL: "+ssl)
    ssl = !ssl
    log.trace("SSL deafult value is false. No ssl peer verification is: "+ssl)
}

// Converting SSL value to No SSL Peer Verification, which is a connector field
    if(ssl == "false" || ssl == "False"){
        log.trace("SSL is : "+ssl+"\n Converting SSL value to no ssl peer verification: "+!ssl)
        ssl = !ssl
    }else if(ssl == "true" || ssl == "True"){
        log.trace("SSL is: "+ssl+"\n Converting SSL value to to no ssl peer verification: "+!ssl)
        ssl = !ssl
    }
    
// Parsing port into a number
if(port != null || port != ""){
    port = parseInt(port)
    log.trace("WinRM Port: "+port)
    log.info("Port Datatype: "+typeof port)
}

log.trace(target+"\n"+username+"\n"+password+"\n"+shell+"\n"+transport+"\n"+command+"\n"+operation_timeout+"\n"+port)
log.trace(ssl +"\n"+connector_name+"\n"+timeout)

log.info("Inputs to 'flint-util:winrm-ruby:negotiate.rb' are : " + input)

// Set default transport to 'negotiate'
if (transport == null || transport == "") {
    transport = "negotiate"
}

// Connector Call
log.trace('Calling WinRM Connector.')

connector_response = call.connector(connector_name)
    .set("target", target)
    .set("username", username)
    .set("password", password)
    .set("shell", shell)
    .set("transport", transport)
    .set("command", command)
    .set("operation_timeout", operation_timeout)
    .set("no_ssl_peer_verification", protocol)              // Specifies http or https i.e. SSL or no SSL encryption to be used.
    .set("port", port)
    .sync()

    log.trace(connector_response)
// Timeout value check
// if (timeout.toString() == "" || timeout.toString() == null) {
//     connector_response = call_connector.sync()
// } else {
//     connector_response = call_connector.set('timeout', timeout).sync()
// }

// WinRM Connector Response Meta Parameters
response_exitcode = connector_response.exitcode()        // Exit status code
response_message = connector_response.message()          // Execution status messages

log.trace("Exit code : "+response_exitcode)
log.trace("Message : "+response_message)

// WinRM Connector Response Parameters
response_body = connector_response.get('result')                 // Response Body

if (response_exitcode == 0) {
    log.info("Success in executing WinRM Connector with exitcode :: " + response_exitcode + "\n Message ::  " + response_message)
    log.info("Executed Command ::  " + command)
    log.info("Command execution result :: " + response_body)
    output.set('result', response_body)

    log.trace("Finished executing 'flint-util:winrm-ruby:negotiate.rb' flintbit with success.")
} else {
    log.error("Failure in executing WinRM connector with exitcode ::  " + response_exitcode + "\nMessage :: " + response_message)
    output.set('error', response_message)

    log.trace("Finished executing 'flint-util:winrm:connect:wf:negotiate_connect.js' flintbit with error.")
}


