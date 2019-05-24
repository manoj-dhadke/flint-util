/**
 * Creation Date: 14/05/2019
 * Summary: Find date on target
 * Description: Find date on target using WinRM Protocol
*/

log.trace("Started executing 'flint-util:winrm:basic:workflow:date.js'");


input_clone = JSON.parse(input);

operation_timeout = 80;

//Extracting port number from Port input
//port = (port.split(" "))[1];

//command to find the system date and time
command = "date /t && time /t";

//Validation of Connector Name
if(input_clone.hasOwnProperty("connector_name")){
    connector_name = input.get("connector_name");      //Name of the WinRM Connector
    if(connector_name!=null || connector_name!=""){
        connector_call = call.connector(connector_name);
        log.info("Connector Name: "+connector_name);
    }
    else{
        log.error("Connector name is null or empty string");
    }
}
else{
    log.error("Connector key not given");          //Connector name is mandatory
}

//Validation of Target
if(input_clone.hasOwnProperty("target")){
    target = input.get("target"); //Target machine where command will be executed
    if(target!=null || target!=""){
        connector_call.set("target",target);
        log.info("target:"+target);
    }
    else{
        log.error("Target is null or empty string")
    }
}
else{
    log.error("target key not given");                  //Target is mandatory
}

//Validation of Username
if(input_clone.hasOwnProperty("username")){
    username = input.get("username");                   //Target Username
    if(username!=null || username!=""){
        connector_call.set("username",username);
        log.info("username:"+username);
    }
    else{
        log.error("Username is null or empty string")
    }
}
else{
    log.error("Username key not given");           //Username is mandatory
}

//Validation of timeout
if(input_clone.hasOwnProperty("timeout")){
    timeout = input.get("timeout");
    if(timeout!=null || timeout!=""){
        timeout = parseInt(timeout);
    }
    else{
        timeout = 60000;
        log.info("Setting timeout to 60000 miliseconds"); 
    }
    connector_call.set("timeout",timeout);
    log.info("timeout:"+timeout);
}
else{
    timeout = 60000;                               //timeout not mandatory
    log.info("Setting timeout to 60000 miliseconds");   //setting default timeout
}

//Validation of Port
if(input_clone.hasOwnProperty("port")){
    port = input.get("port");                           //Port to connect
    if(port!=null || port!=""){
        connector_call.set("port",port);
        log.info("port:"+port);
    }
    else{
        log.error("Port null or empty string")
    }
}
else{
    log.error("Port key not given");                //Port mandatory
}

//Validation of password
if(input_clone.hasOwnProperty("password")){
    password = input.get("password");                   //Target password
    if(password!=null || password!=""){
        connector_call.set("password",password);
        log.info("Password is given");
    }
    else{
        log.error("Password is null or an empty string")
    }
}
else{
    log.error("Password key not given");            //Password mandatory
}

//Validation of transport
if(input_clone.hasOwnProperty("authentication_type")){
    transport = input.get("authentication_type");       //Aunthentication and encryption type
    if(transport!=null || transport!=""){
        connector_call.set("transport",transport);
        log.info("Transport type:"+transport);
    }
    else{
        log.error("Transport type is null or empty string")
    }
}
else{
    log.error("Transport key not given");          //Transport mandatory
}

//Validation of shell
if(input_clone.hasOwnProperty("shell")){
    shell = input.get("shell");
    if(shell!=null || shell!=""){
        connector_call.set("shell",shell);
        log.info("shell:"+shell);
    }
    else{
        log.error("Shell type is null or empty string")
    }
}
else{
    log.error("shell key not given");                  //Type is mandatory
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