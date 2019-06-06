/**
 * Creation Date: 14/05/2019
 * Summary: Execute any command on target
 * Description: Execute any command on target using SSH Protocol
*/

log.trace("Started executing 'flint-util:ssh:operation:workflow:ssh.js'");

input_clone = JSON.parse(input);

//Connector name
connector_name = "ssh";
connector_call = call.connector(connector_name);
log.info("Connector Name: "+connector_name);

//Type
type = "exec";
log.info("Type: "+type);

//Timeout
timeout = 240000; //4 minutes
log.info("Timeout: "+timeout);

connector_call.set("timeout",timeout).set("type",type);

//Command
if(input_clone.hasOwnProperty("command")){ //to check for key "connector_name"
    command = input.get("command"); 
    //to check for a valid name
    if(command!=null || command!=""){
        connector_call.set("command",command);
        log.info("Command: "+command);

    }
    else{
        log.error("Command name is null or empty string");
    }
}
else{
    log.error("Command key is not given in the input");
}

if(input_clone.hasOwnProperty("protocol_connection")){ //to check for key "target"
    
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
    result = result.slice(0,-1);                    //to remove "\n" from the end of the result

    if(response_exitcode==0){                       //Successfull execution
        log.info("Successfull execution of command:"+command);
        log.info("Command result:"+result);
        //User message
        user_message = "The command '"+command+"' executed with result '"+result+"'";
        output.set("result",result).set("exit-code",0).set("user_message",user_message);
        log.trace("finished executing 'flint-util:ssh:operation:workflow:ssh.js' successfully")
    }
    else{
        log.error("Failure in execution, message:"+response_message+" | exitcode:"+response_exitcode);
        output.set("error",response_message).set("exit-code",-1);
        log.trace("finished executing 'flint-util:ssh:operation:workflow:ssh.js' with errors")
    }
}
else{
    log.error("Protocol Connection not provided.");
}