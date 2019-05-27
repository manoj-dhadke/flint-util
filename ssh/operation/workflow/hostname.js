/**
 * Creation Date: 24/05/2019
 * Summary: Find Hostname on the target
 * Description: To find Hostname on the target machine using SSH Protocol
*/

log.trace("Started executing 'flint-util:ssh:operation:workflow:hostname.js'");

input_clone = JSON.parse(input);

//Connector name
connector_name = "ssh";
connector_call = call.connector(connector_name);
log.info("Connector Name: "+connector_name);

//Type
type = "exec";
log.info("Type: "+type);

//Command
command = "hostname";
log.info("Command: "+command);

//Timeout
timeout = 240000; //4 minutes
log.info("Timeout: "+timeout);

connector_call.set("timeout",timeout).set("type",type).set("command",command);

if(input_clone.hasOwnProperty("protocol_connection")){ //to check for key "target"
    
    //Target
    target = input_clone.protocol_connection["hostname"]; 
    log.info("Target:"+target);
    //to check for a valid target
    if(target!=null || target!=""){
        connector_call.set("target",target);
    }
    else{
        log.error("Target is null or empty string");
    }

    //Username
    username = input_clone.protocol_connection["username"]; 
    log.info("Username:"+username);
    //to check for a valid username
    if(username!=null || username!=""){
        connector_call.set("username",username);
    }
    else{
        log.error("Username is null or empty string");
    }

    //Port
    port = input_clone.protocol_connection["port"];
    port = parseInt(port); 
    log.info("Port:"+port);
    //to check for a valid port
    if(port!=null || port!=""){
        connector_call.set("port",port);
    }
    else{
        log.error("Port is null or empty string");
    }

    //To know the type of authentication used by user
    authentication = input_clone.protocol_connection;

    //Password based authentication
    if(authentication.hasOwnProperty("password")){
        password = input_clone.protocol_connection["password"]; 
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
        key = input_clone.protocol_connection["pem_key"]; 
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
        user_message = "The hostname on the target is "+result;
        //Setting the result,exit-code and user_message in output
        output.set("result",result).set("exit-code",0).set("user_message",user_message);
        log.trace("finished executing 'flint-util:ssh:operation:workflow:hostname.js' successfully")
    }
    else{
        log.error("Failure in execution, message:"+response_message+" | exitcode:"+response_exitcode);
        output.set("error",response_message).set("exit-code",-1);
        log.trace("finished executing 'flint-util:ssh:operation:workflow:hostname.js' with errors")
    }
}
else{
    log.error("Protocol Connection not provided.");
}