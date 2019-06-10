/**
 * Creation Date: 14/05/2019
 * Summary: Find date on target
 * Description: Find date on target using WinRM Protocol
*/

log.trace("Started executing 'flint-util:winrm:basic:workflow:date.js'");

input_clone = JSON.parse(input);
//Connector 
connector_name = "winrm";
connector_call = call.connector(connector_name);
log.info("Connector Name: "+connector_name);

//Timeout and Operation Timeout
timeout = 240000;
operation_timeout = 80;
log.info("Timeout: "+timeout);
log.info("Operation Timeout: "+operation_timeout);

//command to find the system date and time
command = "date /t && time /t";
log.info("Command: "+command);

connector_call.set("command",command).set("timeout",timeout).set("operation_timeout",operation_timeout);

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
        connector_call.set("transport",transport);
        log.info("Transport type:"+transport);
    }
    else{
        log.error("Transport type is null or empty string")
    }

    //Validation of shell
    shell = encryptedCredentials["shell"];
    if(shell!=null || shell!=""){
        connector_call.set("shell",shell);
        log.info("shell:"+shell);
    }
    else{
        log.error("Shell type is null or empty string")
    }

    //connector call
    response = connector_call.sync();

    //WinRM Connector Response's meta parameters
    response_exitcode = response.exitcode();        //Exit status code
    response_message = response.message();          //Execution status message

    //WinRM Connector Response's Result parameter
    result = response.get("result");                //Response result
    
    ind = result.lastIndexOf("\r\n");               //to remove unwanted "\r\n"
    result = result.substring(0,ind);
    result = result.split(" ");
    result[2] = result[2].substring(3);

    result_string = "";
    for(i=0;i<4;i++){                           //converting the array to string
        result_string = result_string + " "+result[i];
    }
    
    if(response_exitcode==0){                       //Successfull execution
        log.info("Successfull execution of command:"+command);
        log.info("Command result:"+result);
        //user message
        user_message = "The date on target is "+result;
        output.set("result",result).set("exit-code",0).set("user_message",user_message);
        log.trace("finished executing 'flint-util:winrm:basic:workflow:date.js' successfully")
    }
    else{
        log.error("Failure in execution, message:"+response_message+" | exitcode:"+response_exitcode);
        output.set("error",response_message).set("exit-code",-1);
        log.trace("finished executing 'flint-util:winrm:basic:workflow:date.js' with errors")
    }
}
else{
    log.error("Protocol Connection not given");
}