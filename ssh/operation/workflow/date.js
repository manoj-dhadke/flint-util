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

log.trace("Started executing 'flint-util:ssh:operation:workflow:date.js'");

input_clone = JSON.parse(input);

//Connector name
connector_name = "ssh";
connector_call = call.connector(connector_name);
log.info("Connector Name: "+connector_name);

//Type
type = "exec";
log.info("Type: "+type);

//Command
command = "date";
log.info("Command: "+command);

if(input_clone.hasOwnProperty("request_timeout")){
    request_timeout = input.get("request_timeout");
    if(request_timeout!=null || request_timeout!=""){
        connector_call.set("timeout",request_timeout); 
        log.info("Request Timeout: "+request_timeout);
    }
    else{
        connector_call.set("timeout",240000); 
        log.info("request_timeout not given. Setting 240000 miliseconds as timeout");
    }
}
else{
    connector_call.set("timeout",240000); 
    log.info("request_timeout not given. Setting 240000 miliseconds as timeout");
}

connector_call.set("type",type).set("command",command);

if(input_clone.hasOwnProperty("protocol_connection")){

    protocol_connection = input_clone["protocol_connection"];
    encryptedCredentials = protocol_connection["encryptedCredentials"];
    
    //Target
    target = encryptedCredentials["hostname"]; 
    log.info("Target:"+target);
    //to check for a valid target
    if(target!=null || target!=""){
        connector_call.set("target",target);
    }
    else{
        log.error("Target is null or empty string");
    }

    //Username
    username = encryptedCredentials["username"]; 
    log.info("Username:"+username);
    //to check for a valid username
    if(username!=null || username!=""){
        connector_call.set("username",username);
    }
    else{
        log.error("Username is null or empty string");
    }

    //Port
    port = encryptedCredentials["port"];
    port = parseInt(port); 
    log.info("Port:"+port);
    //to check for a valid port
    if(port!=null || port!=""){
        connector_call.set("port",port);
    }
    else{
        log.error("Port is null or empty string");
    }

    //Password based authentication
    if(encryptedCredentials.hasOwnProperty("password")){
        password = encryptedCredentials["password"]; 
        log.info("Password is given");
        //to check for a valid password
        if(password!=null || password!=""){
            response = connector_call.set("password",password).sync();
        }
        else{
            log.trace("Password is null or empty string");
        }
    }
    
    //Key-based authentication
    else{
        key = encryptedCredentials["pem_key"]; 
        log.info("Key is given");
        //to check for a valid key
        if((key!=null || key!="")){
            response = connector_call.set("pem-data",key).sync();
        }
        else{
            log.trace("Key is null or empty string");
        }
    }
    //SSH Connector Response's meta parameters
    response_exitcode = response.exitcode();        //Exit status code
    response_message = response.message();          //Execution status message

    //SSH Connector Response's Result parameter
    result = response.get("result");                //Response result
    result = result.replace("\n","");              //to remove the "\n" at the end of the result

    if(response_exitcode==0){                       //Successfull execution
        log.info("Successfull execution of command:"+command);
        log.info("Command result:"+result);
        //User Message
        user_message = "The <b>Date</b> on the target is <b>"+result+"</b>";
        //Setting the result,exit-code and user_message in output
        output.set("result",result).set("exit-code",0).set("user_message",user_message);
        log.trace("finished executing 'flint-util:ssh:operation:workflow:date.js' successfully")
    }
    else{
        log.error("Failure in execution, message:"+response_message+" | exitcode:"+response_exitcode);
        output.set("error",response_message).set("exit-code",-1);
        log.trace("finished executing 'flint-util:ssh:operation:workflow:date.js' with errors")
    }
}
else{
    log.error("Protocol Connection not provided.");
}
