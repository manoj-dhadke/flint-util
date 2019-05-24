/**
 * Creation Date: 14/05/2019
 * Summary: Execute any command on target
 * Description: Execute any command on target using SSH Protocol
*/

log.trace("Started executing 'flint-util:ssh:operation:workflow:ssh.js'");

input_clone = JSON.parse(input);


//Connector name
if(input_clone.hasOwnProperty("connector_name")){ //to check for key "connector_name"
    connector_name = input.get("connector_name"); 
    log.info("Connector name:"+connector_name);
    //to check for a valid name
    if(connector_name!=null || connector_name!=""){
        connector_call = call.connector(connector_name);

    }
    else{
        log.error("Connector name is null or empty string");
    }
}
else{
    log.error("Connector name key is not given in the input");
}

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

//Type
if(input_clone.hasOwnProperty("type_of_shell")){ //to check for key "type"
    type = input.get("type_of_shell"); 
    log.info("Type:"+type);
    //to check for a valid type
    if(type!=null || type!=""){
        connector_call.set("type",type);
    }
    else{
        log.error("Type is null or empty string");
    }
}
else{
    log.error("Type key is not given in the input");
}


//Password based authentication
if(input_clone.hasOwnProperty("password")){ //to check for key "password"
    password = input.get("password"); 
    log.info("Password is given");
    //to check for a valid password
    if(password!=null || password!=""){
        response = connector_call.set("password",password).sync();
    }
    else{
        log.trace("Password is null or empty string");
    }
}
else{
    log.trace("Password key is not given in the input");
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
    log.trace("Key-path and passpharse keys are not given in the input");
}

//Key-based authentication only with key
if(input_clone.hasOwnProperty("private_key_path")){
    key_file = input.get("private_key_path"); 
    log.info("Key Path:"+key_file);
    //to check for a valid key file 
    if((key_file!=null || key_file!="")){
        response = connector_call.set("key-file",key_file).sync();
    }
    else{
        log.trace("Key-Path is null or empty string");
    }
}
else{
    log.trace("Key-path key is not given in the input");
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
