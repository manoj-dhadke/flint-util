/**
 * Creation Date: 14/05/2019
 * Summary: System information on target
 * Description: To view System information on target using SSH Protocol
*/

log.trace("Started executing 'flint-util:ssh:operation:workflow:processor_info.js'");

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


//Command to find out the system information
command = "lscpu";

//Validation of Connector Name
if(connector_name!=null || connector_name!=""){
    log.info("connector name:"+connector_name);     //Connector name is mandatory
}
else{
    log.error("Connector name not given");
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
    timeout = 60000;                                //timeout not mandatory
    log.info("Setting timeout to 60000 miliseconds");   //setting default timeout
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
else{                                               //Not mandatory: authentication type
    log.trace("Password not given");                //depends on user    
}

//Validation of private key path
if(key_file!=null || key_file!=""){
    log.info("private key path:"+key_file);
}
else{                                               //Not mandatory: authentication type
    log.trace("private key path not given");        //depends on user
}

//Validation of passphrase
if(passphrase!=null || passphrase!=""){
    log.info("passphrase:"+passphrase);
}
else{                                                //Not mandatory: authentication type
    log.trace("Passphrase not given");              //depends on user
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

//Split the result according to "\n" to obtain individual key:value pairs in an array
result = result.split("\n");  //result array
result.pop();   //deleting the last empty entry from the result array

jstr = '{';                             //making a string to convert into JSON
for(i = 0 ; i < result.length ; i++){
    result_val = result[i];    
    arr = result_val.split(":"); //splitting each entry into key and value. arr is an array with 2 elements 
    key = arr[0].trim();
    value = arr[1].trim(); 
    jstr = jstr + '"' + key + '":"' + value + '"';
    if(i!=(result.length-1)) jstr = jstr + ',';
}
jstr = jstr + '}';

result = JSON.parse(jstr); //converting the string into JSON



if(response_exitcode==0){                       //Successfull execution
    log.info("Successfull execution of command:"+command);
    log.info("Command result:"+result);
   //User Message by extracting values from JSON 
    user_message =' The processor information on target is'+
                   '    (i)Model name:'+ result["Model name"]+ 
                    '   (ii)Architecture:'+ result["Architecture"]+ 
                    '   (iii)CPU(s):'+ result["CPU(s)"]+ 
                    '   (iv)Thread(s) per core:'+ result["Thread(s) per core"]+ 
                    '   (v)CPU MHz:'+ result["CPU MHz"];
    


    output.set("result",result).set("exit-code",0).set("user_message",user_message);
    log.trace("finished executing 'flint-util:ssh:operation:workflow:processor_info.js' successfully")
}
else{
    log.error("Failure in execution, message:"+response_message+" | exitcode:"+response_exitcode);
    output.set("error",response_message).set("exit-code",-1);
    log.trace("finished executing 'flint-util:ssh:operation:workflow:processor_info.js' with errors")
}