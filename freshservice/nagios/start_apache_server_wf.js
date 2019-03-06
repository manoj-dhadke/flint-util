 /**
** Creation Date: 6th March 2019
** Summary: Start Apache server.
** Description: This flintbit is developed to start apache server.
**/

log.trace("Started executing 'flint-util:freshservice:start_apache_server_wf.js' flintbit...")

target = ""
port = ""
username = ""
target_password = ""

// Service parameters
start_apache_sp = input.get('start_apache_sp')
 
// Service inputs
target = input.get('target')
if(target == null || target == ""){
    log.trace("Setting target from global configuration")
    target = config.global("nagios_apache_config.target")
}

username = input.get('username')
if(username == null || username == ""){
    log.trace("Setting username from global configuration")
    username = config.global("nagios_apache_config.username")
}

port = input.get('port')
if(port == null || port == ""){
    log.trace("Setting port from global configuration")
    port = config.global("nagios_apache_config.port")
}

target_password = input.get('password')
if(target_password == null || target_password == ""){
    log.trace("Setting password from global configuration")
    target_password = config.global("nagios_apache_config.target_password")
}

log.info("Calling SSH connector")

 // Calling SSH connector
 connector_response = call.connector('ssh') 
 .set('target',target)
 .set('type', 'exec')
 .set('port',port)
 .set('username', username)
 .set('password', target_password)
 .set('command', 'sudo service apache2 start') // Starting web server apache2
 .set('timeout', 60000)
 .sync()

//  SSH Connector Response Parameter
result = connector_response.get('result')
response_exitcode = connector_response.exitcode()

if(response_exitcode == 0){
    log.trace("Apache Server: "+target+" stopped successfully")
}else{
    log.trace("Failed to stop apache server with exit code: "+response_exitcode)
    
}
log.trace("Started executing 'flint-util:freshservice:start_apache_server_wf.js' flintbit...")