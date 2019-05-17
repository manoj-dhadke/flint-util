/**
 * Creation Date: 14/05/2019
 * Summary: Find date on target
 * Description: Find date on target using WinRM Protocol
*/

log.trace("Started executing 'flint-util:winrm:basic:workflow:date.js'");

//Service Parameters
connector_name = input.get("connector_name");      //Name of the WinRM Connector

//Service Inputs
target = input.get("target");                       //Target machine where command will be executed
username = input.get("username");                   //Target Username
password = input.get("password");                   //Target password
port = input.get("port");                           //Port to connect
transport = input.get("authentication_type");                     //Aunthentication and encryption type
shell = input.get("shell");                          //shell type 
timeout = input.get("timeout");
operation_timeout = 80;

//Extracting port number from Port input
port = (port.split(" "))[1];

//command to find the system date and time
command = "date /t && time /t";

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
    //log.info("timeout:"+timeout);
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
ind = result.lastIndexOf("\r\n");               //to remove unwanted "\r\n"
result = result.substring(0,ind);
result = result.split(" ");
result[2] = result[2].substring(3);

result_str = "";
for(i=0;i<4;i++){                           //converting the array to string
    result_str = result_str + " "+result[i];
}

if(response_exitcode==0){                       //Successfull execution
    log.info("Successfull execution of command:"+command);
    log.info("Command result:"+result_str);
    //user message
    user_message = "The date on target is "+result_str;
    output.set("result",result_str).set("exit-code",0).set("user_message",user_message);
    log.trace("finished executing 'flint-util:winrm:basic:workflow:date.js' successfully")
}
else{
    log.error("Failure in execution, message:"+response_message+" | exitcode:"+response_exitcode);
    output.set("error",response_message).set("exit-code",-1);
    log.trace("finished executing 'flint-util:winrm:basic:workflow:date.js' with errors")
}