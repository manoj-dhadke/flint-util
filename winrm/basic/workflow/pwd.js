/**
 * Creation Date: 15/05/2019
 * Summary: Find Current directory on target
 * Description: Find current directory on target using WinRM Protocol
*/

log.trace("Started executing 'flint-util:winrm:basic:workflow:pwd.js'");

//Service Parameters
connector_name = input.get("connector_name");      //Name of the WinRM Connector

//Service Inputs
target = input.get("target");                       //Target machine where command will be executed
username = input.get("username");                   //Target Username
password = input.get("password");                   //Target password
port = input.get("port");                           //Port to connect
transport = input("transport");                     //Aunthentication and encryption type
shell = input.get("shell");                          //shell type 
timeout = input.get("timeout");
operation_timeout = 80;

//command to find the current directory
command = "cd";

//Validation of Connector Name
if(connector_name!=null || connector_name!=""){
    log.info("connector name:"+connector_name);
}
else{
    log.error("Connector name not given");          //Connector name is mandatory
}

//Validation of Target
if(target!=null || target!=""){
    log.info("target:"+target);
}
else{
    log.error("target not given");                  //Target is mandatory
}

//Validation of Username
if(username!=null || username!=""){
    log.info("username:"+username);
}
else{
    log.error("Username name not given");           //Username is mandatory
}

//Validation of timeout
if(timeout!=null || timeout!=""){
    timeout = parseInt(timeout);
    log.info("timeout:"+timeout);
}
else{
    timeout = 60000;                               //timeout not mandatory
    log.info("Setting timeout to 60000 miliseconds");   //setting default timeout
}

//Validation of Port
if(port!=null || port!=""){
    port = parseInt(port);
    log.info("port:"+port);
}
else{
    log.error("Port not given");                //Port mandatory
}

//Validation of password
if(password!=null || password!=""){
    log.info("Password is given");
}
else{
    log.error("Password not given");            //Password mandatory
}

//Validation of transport
if(transport!=null || transport!=""){
    log.info("Transport type:"+transport);
}
else{
    log.error("Transport type not given");          //Transport mandatory
}

//Validation of shell
if(shell!=null || shell!=""){
    log.info("shell:"+shell);
}
else{
    log.error("shell not given");                  //Type is mandatory
}


//connector call
response = call.connector(connector_name)
                .set("target",target)
                .set("username",username)
                .set("password",password)
                .set("transport",transport)
                .set("command",command)
                .set("port",port)
                .set("shell",shell)
                .set("operation_timeout",operation_timeout)
                .set("timeout",timeout)
                .sync();

//WinRM Connector Response's meta parameters
response_exitcode = response.exitcode();        //Exit status code
response_message = response.message();          //Execution status message

//WinRM Connector Response's Result parameter
result = response.get("result");                //Response result

if(response_exitcode==0){                       //Successfull execution
    log.info("Successfull execution of command:"+command);
    log.info("Command result:"+result);
    //user message
    user_message = "The current directory on target is "+result;
    output.set("result",result).set("exit-code",0).set("user_message",user_message);
    log.trace("finished executing 'flint-util:winrm:basic:workflow:pwd.js' successfully")
}
else{
    log.error("Failure in execution, message:"+response_message+" | exitcode:"+response_exitcode);
    output.set("error",response_message).set("exit-code",-1);
    log.trace("finished executing 'flint-util:winrm:basic:workflow:pwd.js' with errors")
}