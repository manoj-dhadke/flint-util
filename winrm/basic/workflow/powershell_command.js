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

log.trace("Started executing 'flint-util:winrm:basic:workflow:powershell_command.js'");

input_clone = JSON.parse(input);

//Connector 
connector_name = "winrm";
connector_call = call.connector(connector_name);
log.info("Connector Name: "+connector_name);

//Operation Timeout
operation_timeout = 80;
log.info("Operation Timeout: "+operation_timeout);

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
connector_call.set("operation_timeout",operation_timeout);

if(input_clone.hasOwnProperty("protocol_connection")){
    
    protocol_connection = input_clone["protocol_connection"];
    encryptedCredentials = protocol_connection["encryptedCredentials"];

    //Validation of Target
    target = encryptedCredentials["hostname"];
    if(target!=null || target!=""){
        connector_call.set("target",target);
        log.info("target:"+target);
    }
    else{
        log.error("Target is null or empty string")
    }

    //Validation of Username
    username = encryptedCredentials["username"];                   //Target Username
    if(username!=null || username!=""){
        connector_call.set("username",username);
        log.info("username:"+username);
    }
    else{
        log.error("Username is null or empty string")
    }

    //Validation of Port
    port = encryptedCredentials["port"];                           //Port to connect
    if(port!=null || port!=""){
        connector_call.set("port",port);
        log.info("port:"+port);
    }
    else{
        log.error("Port null or empty string")
    }

    //Validation of password
    password = encryptedCredentials["password"];                   //Target password
    if(password!=null || password!=""){
        connector_call.set("password",password);
        log.info("Password is given");
    }
    else{
        log.error("Password is null or an empty string")
    }

    //Validation of transport
    transport = encryptedCredentials["authentication_type"];       //Aunthentication and encryption type
    if(transport!=null || transport!=""){
        connector_call.set("transport",transport.toLowerCase());
        log.info("Transport type:"+transport);
    }
    else{
        log.error("Transport type is null or empty string")
    }

    //Validation of shell
    shell = "ps"
    connector_call.set("shell",shell);
    
    //Validation of command
    if(input_clone.hasOwnProperty("command")){
        command = input.get("command");
        if(command!=null || command!=""){
            command = 'powershell -command "'+command+'"';
            connector_call.set("command",command);
            log.info("Command: "+command);
        }
        else{
            log.error("command is null or empty string")
        }
    }
    else{
        log.error("Command key not given");    
    }

    //connector call
    response = connector_call.sync();

    //WinRM Connector Response's meta parameters
    response_exitcode = response.exitcode();        //Exit status code
    response_message = response.message();          //Execution status message

    //WinRM Connector Response's Result parameter
    result = response.get("result");                //Response result

    if(response_exitcode==0){                       //Successfull execution
        log.info("Successfull execution of command:"+command);
        log.info("Command result:"+result);
        //user message
        user_message = "The Command <b>'"+command+"'</b> produced the result <b>'"+result+"'</b>";
        output.set("result",result).set("exit-code",0).set("user_message",user_message);
        log.trace("finished executing 'flint-util:winrm:basic:workflow:powershell_command.js' successfully")
    }
    else{
        log.error("Failure in execution, message:"+response_message+" | exitcode:"+response_exitcode);
        output.set("error",response_message).set("exit-code",-1);
        log.trace("finished executing 'flint-util:winrm:basic:workflow:powershell_command.js' with errors")
    }
}
else{
    log.error("Protocol Connection not given");
}
