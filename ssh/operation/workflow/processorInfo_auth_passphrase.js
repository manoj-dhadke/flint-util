/*************************************************************************
 * 
 * INFIVERVE TECHNOLOGIES PTE LIMITED CONFIDENTIAL
 * __________________
 * 
 * (C) INFIVERVE TECHNOLOGIES PTE LIMITED, SINGAPORE
 * All Rights Reserved.
 * Product / Project: Flint IT Automation Platform
 * NOTICE:  All information contained herein is, and remains
 * the property of INFIVERVE TECHNOLOGIES PTE LIMITED.
 * The intellectual and technical concepts contained
 * herein are proprietary to INFIVERVE TECHNOLOGIES PTE LIMITED.
 * Dissemination of this information or any form of reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from INFIVERVE TECHNOLOGIES PTE LIMITED, SINGAPORE.
 */

log.trace("Started executing 'flint-util:ssh:operation:workflow:processorInfo_auth_passphrase.js'");
input_clone = JSON.parse(input);

//Connector name
connector_name = "ssh";
connector_call = call.connector(connector_name);
log.info("Connector Name: "+connector_name);

//Command
command = "lscpu";
log.info("Command: "+command);

//Timeout
timeout = 240000;
log.info("Timeout: "+timeout);

//Type
type = "exec";
log.info("Type of shell: "+type);

connector_call.set("command",command).set("type",type).set("timeout",timeout);

//Target
if(input_clone.hasOwnProperty("target")){ //to check for key "target"
    target = input.get("target"); 
    log.info("Target:"+target);
    //to check for a valid target
    if(target!=null || target!=""){
        connector_call.set("target",target);
    }
    else{
        log.error("Target is null or empty string");
    }
}
else{
    log.error("Target key is not given in the input");
}

//Username
if(input_clone.hasOwnProperty("username")){ //to check for key "username"
    username = input.get("username"); 
    log.info("Username:"+username);
    //to check for a valid username
    if(username!=null || username!=""){
        connector_call.set("username",username);
    }
    else{
        log.error("Username is null or empty string");
    }
}
else{
    log.error("Username key is not given in the input");
}

//Port
if(input_clone.hasOwnProperty("port")){ //to check for key "port"
    port = input.get("port");
    port = parseInt(port); 
    log.info("Port:"+port);
    //to check for a valid port
    if(port!=null || port!=""){
        connector_call.set("port",port);
    }
    else{
        log.error("Port is null or empty string");
    }
}
else{
    log.error("Port key is not given in the input");
}


//Key-based authentication with key and passphrase
if(input_clone.hasOwnProperty("private_key_path") && input_clone.hasOwnProperty("passphrase")){
    key_file = input.get("private_key_path"); 
    passphrase = input.get("passphrase");
    log.info("Key Path:"+key_file);
    log.info("Passphrase:"+passphrase);
    //to check for a valid key file and passphrase
    if((key_file!=null || key_file!="") && (passphrase!=null || passphrase!="")){
        //Connector Call
        response = connector_call.set("key-file",key_file).set("passphrase",passphrase).sync();
    }
    else{
        log.trace("Key-Path and passphrase is null or empty string");
    }
}
else{
    log.trace("Key-path and passpharse are not given in the input");
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
   //User Message by extracting values from JSON 
    user_message =' The processor information on target is'+
                   '    (i)Model name:'+ result["Model name"]+ 
                    '   (ii)Architecture:'+ result["Architecture"]+ 
                    '   (iii)CPU(s):'+ result["CPU(s)"]+ 
                    '   (iv)Thread(s) per core:'+ result["Thread(s) per core"]+ 
                    '   (v)CPU MHz:'+ result["CPU MHz"];
    log.info("Command result:"+user_message);


    output.set("result",result).set("exit-code",0).set("user_message",user_message);
    log.trace("finished executing 'flint-util:ssh:operation:workflow:processorInfo_auth_passphrase.js.js' successfully")
}
else{
    log.error("Failure in execution, message:"+response_message+" | exitcode:"+response_exitcode);
    output.set("error",response_message).set("exit-code",-1);
    log.trace("finished executing 'flint-util:ssh:operation:workflow:processorInfo_auth_passphrase.js.js' with errors")
}
