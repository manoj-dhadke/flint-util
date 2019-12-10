/*************************************************************************
 * 
 * INFIVERVE TECHNOLOGIES PTE LIMITED CONFIDENTIAL
 * __________________
 * 
 * (C) INFIVERVE TECHNOLOGIES PTE LIMITED, SINGAPORE
 * All Rights Reserved.
 * Product / Project: Flint IT Automation Platform
 * NOTICE:  All information contained herein is, and remains
 * the property of INFIVERVE TECHNOLOGIES PTE LIMITED.
 * The intellectual and technical concepts contained
 * herein are proprietary to INFIVERVE TECHNOLOGIES PTE LIMITED.
 * Dissemination of this information or any form of reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from INFIVERVE TECHNOLOGIES PTE LIMITED, SINGAPORE.
 */
log.trace("Started executing 'flint:util:bmc_ars:create_entry.groovy' flintbit...")
try{
    //Flintbit Input Parameters
    // Mandatory
    connector_name = input.get('connector_name')
    servername = input.get('servername')
    username = input.get('username')
    password = input.get('password')
    port = input.get('port')
    action = "create-entry"
    form_name= input.get('form_name')
    entries = input.get('entries')

    if (connector_name == null || connector_name ==""){
        throw new Exception( 'Please provide "BMC ARS connector name (connector_name)" to create entry')
    }

    if (servername == null || servername ==""){
        throw new Exception( 'Please provide "BMC ARS Server Name Name (servername)" to create entry')
    }
    if (username == null || username ==""){
        throw new Exception( 'Please provide "BMC ARS Username (username)" to create entry')
    }
    if (password == null || password ==""){
        throw new Exception( 'Please provide "BMC ARS Password Name (password)" to create entry')
    }

    if (port == null || port ==""){
        throw new Exception( 'Please provide "BMC ARS Port (port)" to create entry')
    }

    if (form_name == null || form_name ==""){
        throw new Exception( 'Please provide "BMC ARS Form Name (form_name)" to create entry')
    }

    if (entries == null || entries ==""){
        throw new Exception( 'Please provide "BMC ARS Enteries (entries)" to create entry')
    }

log.info("Flintbit input parameters are, server-name : ${servername} | username : ${username} | password : ${password} | port : ${port}")

// Connector call
    connector_response = call.connector(connector_name)
                          .set('server-name',servername)
                          .set('username',username)
                          .set('password',password)
                          .set('port',port)
                          .set('action',action)
                          .set('entries',entries)
                          .set("form-name",form_name)
                          .timeout(180000)
                          .sync()

log.info("Connector Response:: ${connector_response}")

connector_response_exitcode = connector_response.exitcode() // Exit status code
connector_response_message = connector_response.message()  // Execution status messages

if (connector_response_exitcode == 0){
    log.info("SUCCESS in executing ${connector_name} where, exitcode : ${connector_response_exitcode} | message : ${connector_response_message}")
    output.set('exit-code', 0).set('message',connector_response_message)
}
else{
    log.error("ERROR in executing ${connector_name} where, exitcode : ${connector_response_exitcode} | message : ${connector_response_message}")
    output.set('exit-code', 1).set('message',connector_response_message)
}

}
catch(Exception e){
    log.error(e.message)
    output.set('exit-code', 1).set('message', e.message)
}
log.trace("Finished executing 'flint:util:bmc_ars:create_entry.groovy' flintbit...")
