/*
 *
 * INFIVERVE TECHNOLOGIES PTE LIMITED CONFIDENTIAL
 * _______________________________________________
 *
 *  (C) INFIVERVE TECHNOLOGIES PTE LIMITED, SINGAPORE
 *  All Rights Reserved.
 *  Product / Project: Flint IT Automation Platform
 *  NOTICE:  All information contained herein is, and remains
 *  the property of INFIVERVE TECHNOLOGIES PTE LIMITED.
 *  The intellectual and technical concepts contained
 *  herein are proprietary to INFIVERVE TECHNOLOGIES PTE LIMITED.
 *  Dissemination of this information or any form of reproduction of this material
 *  is strictly forbidden unless prior written permission is obtained
 *  from INFIVERVE TECHNOLOGIES PTE LIMITED, SINGAPORE.
*/

log.trace("Started executing 'flint-util:ssh:operation:workflow:processorInfo.js'");
input_clone = JSON.parse(input);

//Connector name
connector_name = "ssh";
connector_call = call.connector(connector_name);
log.info("Connector Name: "+connector_name);

//Command
command = "lscpu";
log.info("Command: "+command);

//Type
type = "exec";
log.info("Type: "+type);

if(input_clone.hasOwnProperty("request_timeout")){
    request_timeout = input.get("request_timeout");
    if(request_timeout!=null || request_timeout!=""){
        connector_call.set("timeout",request_timeout); 
        log.info("Request Timeout: "+request_timeout);
    }
    else{
        connector_call.set("timeout",240000); 
        log.info("request_timeout not given. Setting 240000 miliseconds as timeout");
    }
}
else{
    connector_call.set("timeout",240000); 
    log.info("request_timeout not given. Setting 240000 miliseconds as timeout");
}

connector_call.set("command",command).set("type",type);

if(input_clone.hasOwnProperty("protocol_connection")){
    
    protocol_connection = input_clone["protocol_connection"];
    encryptedCredentials = protocol_connection["encryptedCredentials"];

    //Target
    target = encryptedCredentials["hostname"]; 
    log.info("Target:"+target);
    //to check for a valid target
    if(target!=null || target!=""){
        connector_call.set("target",target);
    }
    else{
        log.error("Target is null or empty string");
    }

    //Username
    username = encryptedCredentials["username"]; 
    log.info("Username:"+username);
    //to check for a valid username
    if(username!=null || username!=""){
        connector_call.set("username",username);
    }
    else{
        log.error("Username is null or empty string");
    }

    //Port
    port = encryptedCredentials["port"];
    port = parseInt(port); 
    log.info("Port:"+port);
    //to check for a valid port
    if(port!=null || port!=""){
        connector_call.set("port",port);
    }
    else{
        log.error("Port is null or empty string");
    }

    //Password based authentication
    if(encryptedCredentials.hasOwnProperty("password")){
        password = encryptedCredentials["password"]; 
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
        key = encryptedCredentials["pem_key"]; 
        log.info("Private Key is given");
        //to check for a valid key 
        if(key!=null || key!=""){
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
        user_message =' The <b>Processor Information</b> on target is:<br><ul>'+
                   '    <li>Model name:'+ result["Model name"]+'</li>'+ 
                    '    <li>Architecture:'+ result["Architecture"]+'</li>'+ 
                    '    <li>CPU(s):'+ result["CPU(s)"]+'</li>'+ 
                    '    <li>Thread(s) per core:'+ result["Thread(s) per core"]+'</li>'+ 
                    '    <li>CPU MHz:'+ result["CPU MHz"]+'</li></ul>';
        log.info("Command result:"+user_message);


        output.set("result",result).set("exit-code",0).set("user_message",user_message);
        log.trace("finished executing 'flint-util:ssh:operation:workflow:processorInfo.js' successfully")
    }
    else{
        log.error("Failure in execution, message:"+response_message+" | exitcode:"+response_exitcode);
        output.set("error",response_message).set("exit-code",-1);
        log.trace("finished executing 'flint-util:ssh:operation:workflow:processorInfo.js' with errors")
    }
}
else{
    log.error("Protocol Connection not provided.");
}
