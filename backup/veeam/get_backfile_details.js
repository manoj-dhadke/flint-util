
/**
** Creation Date: 13th February 2019
** Summary: Get Details of a Backup File on Veeam. 
** Description: This flintbit is developed to get details of a Backup File on Veeam.
**/

log.trace("Started executing get_backfile_details.js flintbit")
    
// Set Inputs
    connector_name = input.get('connector_name')
    protocol = input.get('protocol')
    url_domain = input.get('url_domain')
    port = input.get('port')
    action = 'get-backup-file-details'
    username = input.get('username')
    password = input.get('password')
    domain = input.get('domain')
    file_id = input.get('file_id')

    // Call Veeam Connector
    veeam_connector_response = call.connector(connector_name)
    .set('action', action)
    .set('url-domain', url_domain)
    .set('port', port)
    .set('protocol', protocol)
    .set('username',username)
    .set('password',password)
    .set('domain',domain)
    .set('file-id', file_id)
    .sync()

    // Get connector exitcode
    exit_code = veeam_connector_response.exitcode()
    // Get connector message
    message = veeam_connector_response.message()
    // Print response
    log.trace(veeam_connector_response)

    if(exit_code == 0){
        output.set('result', veeam_connector_response.get('backup-file-details'))
        output.set('message', message)
    }else{
        output.set('exit-code', -1)
        output.exit(-1, veeam_connector_response)
    }

log.trace("Finished executing get_backfile_details.js flintbit")
