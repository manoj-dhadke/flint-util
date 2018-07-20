log.trace("Started executing 'flint:util:bmc_ars:get_entry_by_id.groovy' flintbit...")
try{
    //Flintbit Input Parameters
    // Mandatory
    connector_name = input.get('connector_name')
    servername = input.get('servername')
    username = input.get('username')
    password = input.get('password')
    port = input.get('port')
    action = "get-entry"
    form_name= input.get('form_name')
    entry_id= input.get('entry_id')

    if (connector_name == null || connector_name ==""){
        throw new Exception( 'Please provide "BMC ARS connector name (connector_name)" to query entry by Id')
    }

    if (servername == null || servername ==""){
        throw new Exception( 'Please provide "BMC ARS Server Name Name (servername)" to query entry by Id')
    }
    if (username == null || username ==""){
        throw new Exception( 'Please provide "BMC ARS Username (username)" to query entry by Id')
    }
    if (password == null || password ==""){
        throw new Exception( 'Please provide "BMC ARS Password Name (password)" to query entry by Id')
    }

    if (port == null || port ==""){
        throw new Exception( 'Please provide "BMC ARS Port (port)" to query entry by Id')
    }

    if (form_name == null || form_name ==""){
        throw new Exception( 'Please provide "BMC ARS Form Name (form_name)" to query entry by Id')
    }

    if (entry_id == null || entry_id ==""){
        throw new Exception( 'Please provide "BMC ARS Entry Id (entries)" to query entry by Id')
    }

log.info("Flintbit input parameters are, server-name : ${servername} | username : ${username} | password : ${password} | port : ${port}")

// Connector call
    connector_response = call.connector(connector_name)
                          .set('server-name',servername)
                          .set('username',username)
                          .set('password',password)
                          .set('port',port)
                          .set('action',action)
                          .set('entry-id',entry_id)
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
log.trace("Finished executing 'flint:util:bmc_ars:get_entry_by_id.groovy' flintbit...")
