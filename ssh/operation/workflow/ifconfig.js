/**
 * Creation Date: 14/05/2019
 * Summary: View configuration of network interface on target
 * Description: To view config of the network interface on target using SSH Protocol
*/

log.trace("Started executing 'flint-util:ssh:operation:workflow:ifconfig.js'");

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



//Command to find out the Configuration of Network Interface
command = "ip addr show";

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
    log.error("target not given");                  //target is mandatory
}


//Validation of Type
if(type!=null || type!=""){
    log.info("type:"+type);
}
else{
    log.error("type not given");                  //type is mandatory
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
    timeout = 60000;                                //Not mandatory
    log.info("Setting timeout to 60000 miliseconds");       //Setting default timeout
}

//Validation of Port
if(port!=null || port!=""){
    port = parseInt(port);
    log.info("port:"+port);
}
else{
    log.error("Port not given");                //Port is mandatory
}

//Validation of password
if(password!=null || password!=""){
    log.info("Password is given");
}
else{                                         //Password not mandatory as authentication-type
    log.trace("Password not given");          //depends on user
}

//Validation of private key path
if(key_file!=null || key_file!=""){         
    log.info("private key path:"+key_file);
}
else{                                          //Not mandatory as authentication type
    log.trace("private key path not given");    //depends on user
}

//Validation of passphrase
if(passphrase!=null || passphrase!=""){
    log.info("passphrase:"+passphrase);
}
else{                                           //Not mandatory as authentication type
    log.trace("Passphrase not given");          //depends on user
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
result_arr = result.split("inet ");
ipadrs = [];        //array of IP addresses

for(i=1;i<result_arr.length;i++){
    val = result_arr[i];
    ind = val.indexOf(" ");
    ip = val.substring(0,ind);
    ipadrs.push(ip);
}


if(response_exitcode==0){                       //Successfull execution
    log.info("Successfull execution of command:"+command);
    log.info("Command result:"+ipadrs);
    //User message
    user_message = "The IP address of target is(are) "+ipadrs;
    output.set("result",ipadrs).set("exit-code",0).set("user_message",user_message);
    log.trace("finished executing 'flint-util:ssh:operation:workflow:ifconfig.js' successfully")
}
else{
    log.error("Failure in execution, message:"+response_message+" | exitcode:"+response_exitcode);
    output.set("error",response_message).set("exit-code",-1);
    log.trace("finished executing 'flint-util:ssh:operation:workflow:ifconfig.js' with errors")
}