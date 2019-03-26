log.trace("Started executing 'flint-util:validation:ssh_command_wf.js' flintbit")


// Service Parameters
ssh_service_params = input.get('ssh_service_params')
connector_name = ssh_service_params.get('connector_name')     //# Name of the SSH Connector
timeout = ssh_service_params.get('timeout')                  // # Timeout in milliseconds, taken by

// Service Form Inputs
target = input.get('target')                     // Target machine where the command will be executed
type = input.get('type')                         // Type of execution - shell or exec
username = input.get('username')                 // Target username
password = input.get('password')                 // Target password
passphrase= input.get("passphrase")              // Passphrase to be used
key_file = input.get('key-file')                 // SSH Key-file placed in "/flint-dist/gridconfig/keystore"
command = input.get('command')                   // Command/Commands to be executed
// type = input.get('type')                         // The Connector to serve the request
port = input.get('port')

if (connector_name != null || connector_name != "") {
    log.trace("Connector Name : " + connector_name)
} else {
    log.error("Connector name is not given")
}
// target = 'ip address of target'
if (target != null || target != "") {
    log.trace("Target : " + target)
} else {
    log.error("Target is not given")
}

// type = 'exec'
if (type != null || type != "") {
    log.trace("Type : " + type)
} else {
    log.error("Type is not given")
}

// username = 'username of target'
if (username != null || username != "") {
    log.trace("Username : " + username)
}

// password = 'password of target machine'
if (password != null || password != "") {
    log.trace("Password is given")
}

passphrase = ''
if (passphrase != null || passphrase != "") {
    log.trace("Passphrase is given")
}

 
if (key_file != null || key_file != "") {
    log.trace("Key File : " + key_file)
}
key_file = 'public key'

// command = 'command' 
if (command != null || command != "") {
    log.trace("Command : " + command)
}else{
    log.info("Command is not given")
}

// timeout = 100_000
if (timeout != null || timeout != "") {
    log.trace("Timeout : " + timeout)
}else{
    timeout = 120000
}

if(port != null || port != ""){
    log.trace("Port : "+port)
}

// Print out all inputs
log.info("Flintbit Inputs: \n" + input)

log.trace('Calling SSH Connector')
if (timeout.toString() == "") {
    response = call.connector(connector_name)
        .set('target', target)
        .set('type', type)
        .set('username', username)
        .set('password', password)
        //.set('passphrase', passphrase)
        //.set('key-file', key_file)
        .set('command', command)
        .set('type', type)
        .set('port',port)
        .sync()
}
//# .timeout(10000) # Execution time of the Flintbit in milliseconds
else {
    response = call.connector(connector_name)
        .set('target', target)
        .set('type', type)
        .set('username', username)
        .set('password', password)
        //.set('passphrase', passphrase)
        //.set('key-file', key_file)
        .set('command', command)
        .set('timeout', timeout)
        .set('type', type)
        .set('port',port)
        .sync()
    //# .timeout(10000) # Execution time of the Flintbit in milliseconds
}

//# SSH Connector Response Meta Parameters
response_exitcode = response.exitcode()              //# Exit status code
response_message = response.message()               //# Execution status messages

//# SSH Connector Response Parameters
response_body = response.get('result') //# Response Body

log.info("SSH Connector Response: " + response)

if (response_exitcode == 0) {
    log.info("Successfully executed SSH command: "+command)
    log.info("Command Result: "+response_body)
    output.set('result', response_body)
    log.trace("Finished executing 'flint-util:validation:ssh_command_wf.js' flintbit with success")
}
else {
    log.error("Failure in executing SSH command")
    log.error("Erorr Message: "+response_message)
    log.error("Exit code: "+response_exitcode)
    output.set('error', response_message)
    log.trace("Finished executing 'flint-util:validation:ssh_command_wf.js' flintbit with errors.")
}

