/*
 *
 * INFIVERVE TECHNOLOGIES PTE LIMITED CONFIDENTIAL
 * _______________________________________________
 *
 *  (C) INFIVERVE TECHNOLOGIES PTE LIMITED, SINGAPORE
 *  All Rights Reserved.
 *  Product / Project: Flint IT Automation Platform
 *  NOTICE:  All information contained herein is, and remains
 *  the property of INFIVERVE TECHNOLOGIES PTE LIMITED.
 *  The intellectual and technical concepts contained
 *  herein are proprietary to INFIVERVE TECHNOLOGIES PTE LIMITED.
 *  Dissemination of this information or any form of reproduction of this material
 *  is strictly forbidden unless prior written permission is obtained
 *  from INFIVERVE TECHNOLOGIES PTE LIMITED, SINGAPORE.
*/

 /**
** Creation Date: 6th March 2019
** Summary: Start Apache server.
** Description: This flintbit is developed to start apache server.
**/

log.trace("Started executing 'flint-util:freshservice:start_apache_server_wf.js' flintbit...")

// Global configuration inputs
target = config.global("nagios_apache_config.target")
log.info(target)
username = config.global("nagios_apache_config.username")
log.info(username)
port = config.global("nagios_apache_config.port")
log.info(port)
target_password = config.global("nagios_apache_config.target_password")

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
    log.trace("Apache Server: "+target+" started successfully")
    output.set('exit-code', 0)
}else{
    log.trace("Failed to stop apache server with exit code: "+response_exitcode)
    output.set('error', connector_response)
}
log.trace("Started executing 'flint-util:freshservice:start_apache_server_wf.js' flintbit...")
