/**
** Creation Date: 16th January 2019
** Summary: List VM Restore points on Veeam. 
** Description: This flintbit is developed to get List of VM Restore points on Veeam
**/

log.trace("Started executing backup_servers_list.js flintbit")
    
// Set Inputs
    connector_name = input.get('connector_name')
    protocol = input.get('protocol')
    url_domain = input.get('url-domain')
    port = input.get('port')
    action = 'get-backup-servers-list'
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
    // Get connector message
    message = veeam_connector_response.message()
    // Print response
    log.trace(veeam_connector_response)

    if(exit_code == 0){
        output.set('result', veeam_connector_response.get('backup-servers-list'))
        output.set('message', message)
    }else{
        output.set('exit-code', -1)
        output.set('error', veeam_connector_response)
        output.exit(-1, veeam_connector_response)
    }

log.trace("Finished executing backup_servers_list.js flintbit")
