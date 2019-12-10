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
** Creation Date: 14th January 2019
** Summary: List Jobs on Veeam. 
** Description: This flintbit is developed to get List of Veeam Jobs
**/

log.trace("Started executing jobs_list.js flintbit")
    
// Set Inputs
    connector_name = input.get('connector_name')
    protocol = input.get('protocol')
    url_domain = input.get('url-domain')
    port = input.get('port')
    action = 'get-jobs-list'
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
        output.set('result', veeam_connector_response.get('jobs-list'))
        output.set('message', message)
    }else{
        output.set('exit-code', -1)
        output.set('error', veeam_connector_response)
        output.exit(-1, veeam_connector_response)
    }

log.trace("Finished executing jobs_list.js flintbit")
