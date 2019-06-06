/**
 * Creation Date: 24/05/2019
 * Summary: to view Systeminfo on target
 * Description: To view CPU, memory, disk and process info on target using SSH Protocol
*/

log.trace("Started executing 'flint-util:ssh:operation:workflow:systeminfo.js'");

input_clone = JSON.parse(input);

//Connector name
connector_name = "ssh";
connector_call = call.connector(connector_name);
log.info("Connector Name: "+connector_name);

//Type
type = "exec";
log.info("Type: "+type);

//Command for CPU, Memory, Disk and process
command = "top -b -n1 | grep \"Cpu(s)\" | awk '{print $2 + $4}' ;  df -k --output=pcent /root ; free | grep Mem | awk '{print $3/$2 * 100.0}' ; uptime";
command2 = "ps -e -o pid,args --sort=-pcpu --no-headers|head -5";
log.info("Command 1: "+command);
log.info("Command 2: "+command2);

//Timeout
timeout = 240000;
log.info("Timeout: "+timeout);

connector_call.set("type",type).set("timeout",timeout);

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
            response = connector_call.set("password",password)
                    .set("command",command)
                    .sync();
            response2 = connector_call.set("password",password)
                    .set("command",command2)
                    .sync();
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
        response = connector_call.set("command",command).set("pem-data",key).sync();
        response2 = connector_call.set("command",command2).set("pem-data",key).sync();
        }
    else{
        log.trace("Key is null or empty string");
        }
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
        log.trace("finished executing 'flint-util:ssh:operation:workflow:systeminfo' successfully")
    }
    else{
        log.error("Failure in execution, message:"+response_message+" | exitcode:"+response_exitcode);
        output.set("error",response_message).set("exit-code",-1);
        log.trace("finished executing 'flint-util:ssh:operation:workflow:systeminfo' with errors")
    }
}
else{
    log.error("Protocol Connection not provided.");
}