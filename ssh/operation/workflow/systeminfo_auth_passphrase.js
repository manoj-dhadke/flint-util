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

log.trace("Started executing 'flint-util:ssh:operation:workflow:systeminfo_auth_passphrase.js'");

input_clone = JSON.parse(input);

//Connector name
connector_name = "ssh";
connector_call = call.connector(connector_name);

//Type
type = "exec";
log.info("Type: "+type);

//Command for CPU, Memory, Disk and process
command = "top -b -n1 | grep \"Cpu(s)\" | awk '{print $2 + $4}' ;  df -k --output=pcent /root ; free | grep Mem | awk '{print $3/$2 * 100.0}' ; uptime";
command2 = "ps -e -o pid,args --sort=-pcpu --no-headers|head -5";

//Timeout
timeout = 240000;
connector_call.set("type",type).set("timeout",timeout);

//Target
if(input_clone.hasOwnProperty("target")){ 
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
        response = connector_call.set("key-file",key_file)
                    .set("passphrase",passphrase)
                    .set("command",command)
                    .sync();
        response2 = connector_call.set("key-file",key_file)
                    .set("passphrase",passphrase)
                    .set("command",command2)
                    .sync();
    }
    else{
        log.trace("Key-Path and passphrase is null or empty string");
    }
}
else{
    log.trace("Key-path and passpharse keys are not given in the input");
}

//SSH Connector Response's meta parameters
response_exitcode = response.exitcode();        //Exit status code
response_message = response.message();          //Execution status message


response_exitcode2 = response2.exitcode();        //Exit status code
response_message2 = response2.message();          //Execution status message


//SSH Connector Response's Result parameter
result = response.get("result");                //Response result
result = result.split("\n");
result.pop();
cpu_usage = result[0];
result[0] = "cpu_usage: "+result[0];
disk_space = result[2];
result[2] = "disk_space: "+result[2];
memory = result[3];
result[3] = "memory: "+result[3];
uptime = result[4];
result[4] = "uptime: "+result[4];
result.splice(1,1);
body = '<br>' + "CPU Usage:"+ cpu_usage +"%<br>"+
        "Disk space:"+disk_space +"<br>"+
        "Memory usage:" + memory +"%<br>"+
        "Server uptime:"+uptime+"<br>";


result2 = response2.get("result");                //Response result
result2 = result2.split("\n");
result2.pop();
for(i=0;i<5;i++){
   result2[i]=result2[i].trim();
   result2[i] = "process_"+(i+1)+": "+result2[i];
} 
result = result.concat(result2);

if(response_exitcode==0 && response_exitcode2==0){                       //Successfull execution
    log.info("Successfull execution of command:"+command);
    log.info("Command result:"+body);
    output.set("result",result).set("exit-code",0).set("user_message",body);
    log.trace("finished executing 'flint-util:ssh:operation:workflow:systeminfo_auth_passphrase.js' successfully")
}
else{
    log.error("Failure in execution, message:"+response_message+" | exitcode:"+response_exitcode);
    output.set("error",response_message).set("exit-code",-1);
    log.trace("finished executing 'flint-util:ssh:operation:workflow:systeminfo_auth_passphrase.js' with errors")
}
