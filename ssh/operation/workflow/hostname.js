/**
 * Creation Date: 14/05/2019
 * Summary: Find Hostname on the target
 * Description: To find Hostname on the target machine using SSH Protocol
*/

log.trace("Started executing 'flint-util:ssh:operation:workflow:hostname.js'");

//Service Parameters
connector_name = input.get("connector_name");      //Name of the SSH Connector

//Service Inputs
timeout = input.get("timeout");                     //Timeout in miliseconds
target = input.get("target");                       //Target machine where command will be executed
username = input.get("username");                   //Target Username
password = input.get("password");                   //Target password
passphrase = input.get("passphrase");               //Passphrase to be used
key_file = input.get("private_key_path");                //Absolute path of private-key
port = input.get("port");                           //Port to connect
type = input.get("type_of_shell");                           //type of shell


//Command to find out the Hostname on target
command = "hostname";

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

//Validation of Type
if(type!=null || type!=""){
    log.info("type:"+type);
}
else{
    log.error("type not given");                  //Type is mandatory
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
}
else{
    timeout = 60000;                                //Setting default timeout
    log.info("Setting timeout to 60000 miliseconds");
}

//Validation of Port
if(port!=null || port!=""){
    port = parseInt(port);
    log.info("port:"+port);
}
else{
    log.error("Port not given");                    //Port is mandatory
}

//Validation of password
if(password!=null || password!=""){
    log.info("Password is given");
}
else{                                               //Not mandatory as authentication type
    log.trace("Password not given");                //depends on user
}

//Validation of private key path
if(key_file!=null || key_file!=""){
    log.info("private key path:"+key_file);
}
else{                                               //Not mandatory as authentication type
    log.error("private key path not given");        //depends on user
}

//Validation of passphrase
if(passphrase!=null || passphrase!=""){
    log.info("passphrase:"+passphrase);
}
else{                                               //Not mandatory as authentication type 
    log.error("Passphrase not given");              //depends on user
}


//connector call
// For password-based authentication
if(password!=null || password!=""){
    response = call.connector(connector_name)
                .set("target",target)
                .set("username",username)
                .set("password",password)
                .set("command",command)
                .set("timeout",timeout)
                .set("type",type)
                .set("port",port)
                .sync();
}

//For key-based authentication without passphrase
else if((key_file!=null || key_file!="") && (passphrase==null || passphrase=="")){
    response = call.connector(connector_name)
                .set("target",target)
                .set("username",username)
                .set("key-file",key_file)
                .set("command",command)
                .set("timeout",timeout)
                .set("type",type)
                .set("port",port)
                .sync();
}

//For key-based authentication with passphrase
else if((key_file!=null || key_file!="") && (passphrase!=null || passphrase!="")){
    response = call.connector(connector_name)
                .set("target",target)
                .set("username",username)
                .set("passphrase",passphrase)
                .set("key-file",key_file)
                .set("command",command)
                .set("timeout",timeout)
                .set("type",type)
                .set("port",port)
                .sync();
}
else{
    log.error("Authentication error.Use either password-based or key-based authetication.");
}

//SSH Connector Response's meta parameters
response_exitcode = response.exitcode();        //Exit status code
response_message = response.message();          //Execution status message

//SSH Connector Response's Result parameter
result = response.get("result");                //Response result
result = result.slice(0,-1);           //to remove "\n" appended at the end


if(response_exitcode==0){                       //Successfull execution
    log.info("Successfull execution of command:"+command);
    log.info("Command result:"+result);
    //User Message
    user_message = "The hostname on the target is "+result;
    //Setting result,exit-code and user_message in output
    output.set("result",result).set("exit-code",0).set("user_message",user_message);
    log.trace("finished executing 'flint-util:ssh:operation:workflow:hostname.js' successfully")
}
else{
    log.error("Failure in execution, message:"+response_message+" | exitcode:"+response_exitcode);
    output.set("error",response_message).set("exit-code",-1);
    log.trace("finished executing 'flint-util:ssh:operation:workflow:hostname.js' with errors")
}
