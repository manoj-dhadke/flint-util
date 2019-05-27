/**
 * Creation Date: 24/05/2019
 * Summary: Find Hostname on the target
 * Description: To find Hostname on the target machine using SSH Protocol
*/

log.trace("Started executing 'flint-util:ssh:operation:workflow:hostname_auth_passphrase.js'");
input_clone = JSON.parse(input);                    //used for checking

//Connector name
connector_name = "ssh";
connector_call = call.connector(connector_name);
log.info("Connector Name: "+connector_name);

//Command
command = "hostname";
log.info("Command: "+command);

//Type
type = "exec";
log.info("Type: "+type);

//Timeout
timeout = 240000;
log.info("Timeout: "+timeout);

connector_call.set("command",command).set("timeout",timeout).set("type",type);

//Target
if(input_clone.hasOwnProperty("target")){ //to check for key "target"
    target = input.get("target"); 
    log.info("Target:"+target);
    //to check for a valid target
    if(target!=null || target!=""){
        connector_call.set("target",target);
    }
    else{
        log.error("Target is null or empty string");
    }
}
else{
    log.error("Target key is not given in the input");
}

//Username
if(input_clone.hasOwnProperty("username")){ //to check for key "username"
    username = input.get("username"); 
    log.info("Username:"+username);
    //to check for a valid username
    if(username!=null || username!=""){
        connector_call.set("username",username);
    }
    else{
        log.error("Username is null or empty string");
    }
}
else{
    log.error("Username key is not given in the input");
}

//Port
if(input_clone.hasOwnProperty("port")){ //to check for key "port"
    port = input.get("port");
    port = parseInt(port); 
    log.info("Port:"+port);
    //to check for a valid port
    if(port!=null || port!=""){
        connector_call.set("port",port);
    }
    else{
        log.error("Port is null or empty string");
    }
}
else{
    log.error("Port key is not given in the input");
}


//Key-based authentication with key and passphrase
if(input_clone.hasOwnProperty("private_key_path") && input_clone.hasOwnProperty("passphrase")){
    key_file = input.get("private_key_path"); 
    passphrase = input.get("passphrase");
    log.info("Key Path:"+key_file);
    log.info("Passphrase:"+passphrase);
    //to check for a valid key file and passphrase
    if((key_file!=null || key_file!="") && (passphrase!=null || passphrase!="")){
        response = connector_call.set("key-file",key_file).set("passphrase",passphrase).sync();
    }
    else{
        log.trace("Key-Path and passphrase is null or empty string");
    }
}
else{
    log.trace("Key-path and passpharse are not given in the input");
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
    user_message = "The hostname on the target is "+result;
    //Setting the result,exit-code and user_message in output
    output.set("result",result).set("exit-code",0).set("user_message",user_message);
    log.trace("finished executing 'flint-util:ssh:operation:workflow:hostname_auth_passphrase.js' successfully")
}
else{
    log.error("Failure in execution, message:"+response_message+" | exitcode:"+response_exitcode);
    output.set("error",response_message).set("exit-code",-1);
    log.trace("finished executing 'flint-util:ssh:operation:workflow:hostname_auth_passphrase.js' with errors")
}