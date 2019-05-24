/**
 * Creation Date: 14/05/2019
 * Summary: Find Date on the target
 * Description: To find Date on the target machine using SSH Protocol
*/

log.trace("Started executing 'flint-util:ssh:operation:workflow:date.js'");

//Service Parameters
connector_name = "";      //Name of the SSH Connector

//Service Inputs
timeout="";                     //Timeout in miliseconds
target="";                       //Target machine where command will be executed
username="";                   //Target Username
password="";                   //Target password
passphrase="";               //Passphrase to be used
key_file="";                //Absolute path of private-key
port=0;                           //Port to connect
type="";                           //type of shell


input_clone = JSON.parse(input);                    //used for checking

//Command to find out the system date
command = "ip addr show";
connector_call = "";


//Validation of Connector Name
if(input_clone.hasOwnProperty('connector_name') && (connector_name!=null || connector_name!="")){
    connector_name = input.get("connector_name");
    connector_call = call.connector(connector_name);         //calling the connector
    log.info("connector name:"+connector_name);
}
else{
    log.error("Connector name not given");          //mandatory to give connector name
}

//Validation of Target
if(input_clone.hasOwnProperty('target') && (target!=null || target!="")){
    target = input.get("target");
    connector_call.set("target",target);            //setting parameter
    log.info("target:"+target);
}
else{
    log.error("target not given");                  //mandatory to give target
}

//Validation of Type
if(input_clone.hasOwnProperty('type') && (type!=null || type!="")){
    type = input.get("type");
    connector_call.set("type",type);
    log.info("type:"+type);
}
else{
    log.error("type not given");                  //mandatory to give type
}


//Validation of Username
if(input_clone.hasOwnProperty('username') && (username!=null || username!="")){
    username = input.get("username");
    connector_call.set("username",username);
    log.info("username:"+username);
}
else{
    log.error("Username name not given");           //mandatory to give username
}

//Validation of timeout
if(input_clone.hasOwnProperty('timeout') && (timeout!=null || timeout!="")){
    timeout = input.get("timeout");                   //timeout not mandatory
    timeout = parseInt(timeout);
    log.info("timeout:"+timeout);
}
else{
    timeout = 60000;                                //Setting default timeout
    log.info("Setting timeout to 60000 miliseconds");
}
connector_call.set("timeout",timeout);


//Validation of Port
if(input_clone.hasOwnProperty('port') && (port!=null || port!="")){
    port = input.get("port");
    port = parseInt(port);
    connector_call.set("port",port);
    log.info("port:"+port);
}
else{
    log.error("Port not given");                    //Port mandatory input
}

connector_call.set("command",command);


//connector call
// For password-based authentication
if(input_clone.hasOwnProperty('password') && (password!=null || password!="")){
    log.info("Password given:"+password);
    password = input.get("password");
    response = connector_call.set("password",password).sync();

}

//For key-based authentication with passphrase
else if(input_clone.hasOwnProperty('private_key_path') && (private_key_path!=null || private_key_path!="") && input_clone.hasOwnProperty('passphrase') && (passphrase!=null || passphrase!="")){
    log.info("Key path given:"+private_key_path);
    log.info("passphrase given:"+passphrase);
    key_file = input.get("private_key_path");
    passphrase = input.get("passphrase");
    response = connector_call.set("passphrase",passphrase).set("key-file",key_file).sync();

}

//For key-based authentication without passphrase
else if(input_clone.hasOwnProperty('private_key_path') && (private_key_path!=null || private_key_path!="")){
    log.info("Key path given:"+private_key_path);
    response = connector_call.set("key-file",private_key_path).sync();

}

else{
    log.error("Authentication error.Use either password-based or key-based authetication.");
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
    user_message = "The date on the target is "+result;
    //Setting the result,exit-code and user_message in output
    output.set("result",result).set("exit-code",0).set("user_message",user_message);
    log.trace("finished executing 'flint-util:ssh:operation:workflow:date.js' successfully")
}
else{
    log.error("Failure in execution, message:"+response_message+" | exitcode:"+response_exitcode);
    output.set("error",response_message).set("exit-code",-1);
    log.trace("finished executing 'flint-util:ssh:operation:workflow:date.js' with errors")
}