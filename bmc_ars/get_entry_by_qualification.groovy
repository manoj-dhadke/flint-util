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
log.trace("Started executing 'flint:util:bmc_ars:get_entry_by_qualification.groovy' flintbit...")
try{
    //Flintbit Input Parameters
    // Mandatory
    connector_name = input.get('connector_name')
    servername = input.get('servername')
    username = input.get('username')
    password = input.get('password')
    port = input.get('port')
    action = "query-entry"
    form_name= input.get('form_name')
    qualification_string= input.get('qualification_string')

    if (connector_name == null || connector_name ==""){
        throw new Exception( 'Please provide "BMC ARS connector name (connector_name)" to query entry by qualification')
    }

    if (servername == null || servername ==""){
        throw new Exception( 'Please provide "BMC ARS Server Name Name (servername)" to query entry by qualification')
    }
    if (username == null || username ==""){
        throw new Exception( 'Please provide "BMC ARS Username (username)" to query entry by qualification')
    }
    if (password == null || password ==""){
        throw new Exception( 'Please provide "BMC ARS Password Name (password)" to query entry by qualification')
    }

    if (port == null || port ==""){
        throw new Exception( 'Please provide "BMC ARS Port (port)" to query entry by qualification')
    }

    if (form_name == null || form_name ==""){
        throw new Exception( 'Please provide "BMC ARS Form Name (form_name)" to query entry by qualification')
    }

    if (qualification_string == null || qualification_string ==""){
        throw new Exception( 'Please provide "BMC ARS Qualification String (qualification_string)" to query entry by qualification')
    }

log.info("Flintbit input parameters are, server-name : ${servername} | username : ${username} | password : ${password} | port : ${port}")

// Connector call
    connector_response = call.connector(connector_name)
                          .set('server-name',servername)
                          .set('username',username)
                          .set('password',password)
                          .set('port',port)
                          .set('action',action)
                          .set('qualification-string', qualification_string)
                          .set("form-name",form_name)
                          .timeout(180000)
                          .sync()

//log.info("Connector Response:: ${connector_response}")
result = connector_response.get('result')
log.info("Result:: ${result}")
connector_response_exitcode = connector_response.exitcode() // Exit status code
connector_response_message = connector_response.message()  // Execution status messages

if (connector_response_exitcode == 0){
    log.info("SUCCESS in executing ${connector_name} where, exitcode : ${connector_response_exitcode} | message : ${connector_response_message}")
    output.set('exit-code', 0).set('message',connector_response_message).set('result',result)
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
log.trace("Finished executing 'flint:util:bmc_ars:get_entry_by_qualification.groovy' flintbit...")
