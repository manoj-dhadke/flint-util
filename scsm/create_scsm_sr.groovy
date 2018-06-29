log.trace("Started executing 'flint-util:scsm:create_scsm_sr.groovy' flintbit...")
log.info("Input to SCSM flintbit:${input}")
try{
    connector_name= input.get("connector_name")                        //Name of the Connector
    target_scsm= input.get("target")              			                   //Target address
    username_scsm = input.get("username")                                       //Username
    password_scsm = input.get("password")                                          //Password
    shell = "ps"                 			                                 //Shell Type
    transport = input.get("transport")               			             //Transport
    operation_timeout = 1000                                           //Operation Timeout
    no_ssl_peer_verification = input.get("no_ssl_peer_verification")    //SSL Peer Verification
    port = input.get("port")                                            //Port Number
    request_timeout=1000000                                              //Timeout
    priority= input.get("priority")
    urgency=input.get("urgency")
    resourcegroup =input.get("resourcegroup")
    vmsize =input.get("vmsize")
    offer =input.get("offer")
    srdescription ="Provision Azure Stack Virtual Machine with given configurations: \n Resourcegroup: " + resourcegroup + " \n VM Size: " + vmsize + " \n Operating System: " + offer
    log.info("Description: ${srdescription}")
    //create_sr_command=input.get("create_sr_command")
//log.info("Flintbit input parameters are,connector name:: ${connector_name} |target:: ${target} |username:: ${username}|shell:: ${shell}|transport:: ${transport}|operation_timeout:: ${operation_timeout}|no_ssl_peer_verification :: ${no_ssl_peer_verification} |port :: ${port}")
create_sr_command= "cd C:\\smlets; .\\createSR.ps1 '${srdescription}'"
create_sr_response =  call.connector(connector_name)
                         .set("target",target_scsm)
                         .set("username",username_scsm)
                         .set("password",password_scsm)
                         .set("transport",transport)
                         .set("command",create_sr_command)
                         .set("port",port)
                         .set("shell",shell)
                         .set("operation_timeout",operation_timeout)
                         .set("timeout",request_timeout)
                         .timeout(request_timeout)
                         .sync()

sr_exitcode=create_sr_response.exitcode()           //Exit status code
sr_message=create_sr_response.message()             //Execution status message

if (sr_exitcode == 0){
log.info("SUCCESS in executing ${connector_name} where, exitcode :: ${sr_exitcode} |message ::  ${sr_message}")
result=create_sr_response.get('result')
log.info("Result::${result}")
//result=util.json(result)
//exception=result.get('Exception')
log.info("SUCCESS in executing ${connector_name} where, exitcode :: ${create_sr_response.exitcode} |message ::  ${create_sr_response.message}")
user_message= "Successfully created Service Request in SCSM"
output.set('exit-code', 0).set('message', create_sr_response.message).set("user_message",user_message).set("sr_id",result)
}
else {
user_message= "Failed in creating Service Request in SCSM"
log.error("ERROR in executing ${connector_name} where, exitcode :: ${sr_exitcode} |message ::  ${sr_message}")
output.set('exit-code', 1).set('message', sr_message).set("user_message",user_message)
}
}
catch(Exception e){
    log.error(e.message)
    output.set('exit-code', 1).set('error', e.message)
}
log.trace("Finished executing 'flint-util:scsm:create_scsm_sr.groovy' flintbit...")
