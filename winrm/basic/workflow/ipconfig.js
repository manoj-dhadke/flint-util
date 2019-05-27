/**
 * Creation Date: 15/05/2019
 * Summary: Find configuration of network interface on target
 * Description: Find configuration of network interface on target using WinRM Protocol
*/

log.trace("Started executing 'flint-util:winrm:basic:workflow:ipconfig.js'");

//command to find the configuration on target
command = "ipconfig";
log.info("Command: "+command);

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

connector_call.set("command",command).set("timeout",timeout).set("operation_timeout",operation_timeout);

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

    //connector call
    response = connector_call.set("command",command)
                .set("operation_timeout",operation_timeout)
                .sync();

    //WinRM Connector Response's meta parameters
    response_exitcode = response.exitcode();        //Exit status code
    response_message = response.message();          //Execution status message

    //WinRM Connector Response's Result parameter
    result = response.get("result");                //Response result

    index1 = result.indexOf("IPv4 Address");
    index2 = result.indexOf("Subnet Mask");
    ipadrs = result.substring(index1,index2);
    index = ipadrs.indexOf("\r\n");
    ipadrs = ipadrs.substring(0,index);

    if(response_exitcode==0){                       //Successfull execution
        log.info("Successfull execution of command:"+command);
        log.info("Command result:"+ipadrs);
        //user message
        user_message = "The configuration on target is "+ipadrs;
        output.set("result",ipadrs).set("exit-code",0).set("user_message",user_message);
        log.trace("finished executing 'flint-util:winrm:basic:workflow:ipconfig.js' successfully")
    }
    else{
        log.error("Failure in execution, message:"+response_message+" | exitcode:"+response_exitcode);
        output.set("error",response_message).set("exit-code",-1);
        log.trace("finished executing 'flint-util:winrm:basic:workflow:ipconfig.js' with errors")
    }
}
else{
    log.error("Protocol Connection not given");
}