/**
 * Creation Date: 15/05/2019
 * Summary: To execute a powershell command on cmd on target
 * Description: To execute a powershell command on cmd  on target using WinRM Protocol
*/

log.trace("Started executing 'flint-util:winrm:basic:workflow:powershell_command.js'");

input_clone = JSON.parse(input);

//Timeout and Operation Timeout
timeout = 240000;
operation_timeout = 80;
log.info("Timeout: "+timeout);
log.info("Operation Timeout: "+operation_timeout);

//Connector 
connector_name = "winrm";
connector_call = call.connector(connector_name);
log.info("Connector Name: "+connector_name);

connector_call.set("timeout",timeout).set("operation_timeout",operation_timeout);

if(input_clone.hasOwnProperty("protocol_connection")){
    
    //Validation of Target
    target = input_clone.protocol_connection["hostname"];
    if(target!=null || target!=""){
        connector_call.set("target",target);
        log.info("target:"+target);
    }
    else{
        log.error("Target is null or empty string")
    }

    //Validation of Username
    username = input_clone.protocol_connection["username"];                   //Target Username
    if(username!=null || username!=""){
        connector_call.set("username",username);
        log.info("username:"+username);
    }
    else{
        log.error("Username is null or empty string")
    }

    //Validation of Port
    port = input_clone.protocol_connection["port"];                           //Port to connect
    if(port!=null || port!=""){
        connector_call.set("port",port);
        log.info("port:"+port);
    }
    else{
        log.error("Port null or empty string")
    }

    //Validation of password
    password = input_clone.protocol_connection["password"];                   //Target password
    if(password!=null || password!=""){
        connector_call.set("password",password);
        log.info("Password is given");
    }
    else{
        log.error("Password is null or an empty string")
    }

    //Validation of transport
    transport = input_clone.protocol_connection["authentication_type"];       //Aunthentication and encryption type
    if(transport!=null || transport!=""){
        connector_call.set("transport",transport);
        log.info("Transport type:"+transport);
    }
    else{
        log.error("Transport type is null or empty string")
    }

    //Validation of shell
    shell = input_clone.protocol_connection["shell"];
    if(shell!=null || shell!=""){
        connector_call.set("shell",shell);
        log.info("shell:"+shell);
    }
    else{
        log.error("Shell type is null or empty string")
    }

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
        user_message = "The command '"+command+"' produced the result '"+result+"'";
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