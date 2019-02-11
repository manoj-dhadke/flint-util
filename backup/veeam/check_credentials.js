
/**
** Creation Date: 14th January 2019
** Summary: Check Veeam Credentials. 
** Description: This flintbit is developed to get Backup Files List from Veeam.
**/

log.trace("Started executing check_credentials.js flintbit")
    
// Set Inputs
    connector_name = input.get('connector_name')
    protocol = input.get('protocol')
    url_domain = input.get('url_domain')
    port = input.get('port')
    action = 'check-credentials'
    username = input.get('username')
    password = input.get('password')
    domain = input.get('domain')

    // Call Veeam Connector
    veeam_connector_response = call.connector(connector_name)
    .set('action', action)
    .set('url-domain', url_domain)
    .set('port', port)
    .set('protocol', protocol)
    .set('username',username)
    .set('password',password)
    .set('domain',domain)
    .sync()

    // Get connector exitcode
    exit_code = veeam_connector_response.exitcode()
    log.trace("Connector Exitcode: "+exit_code)
    // Get connector message
    message = veeam_connector_response.message()
    // Print response
    log.trace(message)

    if(exit_code == 0){
        
        output.set('result', veeam_connector_response.get())
        log.trace("Output result has been set")
        output.set('message', message)
        log.trace("Message set")

    }else{
        output.set('exit-code', -1)
        output.set('error', veeam_connector_response.get('message'))
        // output.exit(-1, veeam_connector_response)
    }

log.trace("Finished executing check_credentials.js flintbit")
