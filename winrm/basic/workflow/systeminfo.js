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

log.trace("Started executing 'flint-util:winrm:basic:workflow:systeminfo.js'");

//Connector 
connector_name = "winrm";
connector_call = call.connector(connector_name);
log.info("Connector Name: "+connector_name);

//command to find the system information
command = "systeminfo";
log.info("Command: "+command);

input_clone = JSON.parse(input);
//Operation Timeout
operation_timeout = 80;
log.info("Operation Timeout: "+operation_timeout);

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

connector_call.set("command",command).set("operation_timeout",operation_timeout);

if(input_clone.hasOwnProperty("protocol_connection")){

    protocol_connection = input_clone["protocol_connection"];
    encryptedCredentials = protocol_connection["encryptedCredentials"];

    //Validation of Target
    target = encryptedCredentials["hostname"];
    if(target!=null || target!=""){
        connector_call.set("target",target);
        log.info("target:"+target);
    }
    else{
        log.error("Target is null or empty string")
    }

    //Validation of Username
    username = encryptedCredentials["username"];                   //Target Username
    if(username!=null || username!=""){
        connector_call.set("username",username);
        log.info("username:"+username);
    }
    else{
        log.error("Username is null or empty string")
    }

    //Validation of Port
    port = encryptedCredentials["port"];                           //Port to connect
    if(port!=null || port!=""){
        connector_call.set("port",port);
        log.info("port:"+port);
    }
    else{
        log.error("Port null or empty string")
    }

    //Validation of password
    password = encryptedCredentials["password"];                   //Target password
    if(password!=null || password!=""){
        connector_call.set("password",password);
        log.info("Password is given");
    }
    else{
        log.error("Password is null or an empty string")
    }

    //Validation of transport
    transport = encryptedCredentials["authentication_type"];       //Aunthentication and encryption type
    if(transport!=null || transport!=""){
        connector_call.set("transport",transport.toLowerCase());
        log.info("Transport type:"+transport);
    }
    else{
        log.error("Transport type is null or empty string")
    }

    //Validation of shell
    shell = encryptedCredentials["shell"];
    if(shell!=null || shell!=""){
        connector_call.set("shell",shell);
        log.info("shell:"+shell);
    }
    else{
        log.error("Shell type is null or empty string")
    }

    //connector call
    response = connector_call.set("command",command)
                .set("operation_timeout",operation_timeout)
                .sync();

    //WinRM Connector Response's meta parameters
    response_exitcode = response.exitcode();        //Exit status code
    response_message = response.message();          //Execution status message


    user_message="";

    //WinRM Connector Response's Result parameter
    result = response.get("result");                //Response result
    index_host = result.indexOf("Host Name");         //Extracting information
    index_os = result.indexOf("OS Version");
    index_prscr = result.indexOf("Processor(s)");
    index_prscr_end = result.indexOf("Processor(s) Installed.");
    index_tot_phy_mem = result.indexOf("Total Physical Memory");
    index_page = result.indexOf("Page File Location(s)");

    user_message = user_message + result.substring(index_host,index_os)+""+
                result.substring(index_prscr,index_prscr_end)+""+
                result.substring(index_tot_phy_mem,index_page)+"";
    result_arr = user_message.split("\n");
    result_arr.pop();

    final_msg = "The <b>System Details</b> on host are:<ul>";
    to_split = result_arr[2];
    index_tot_phy_mem = to_split.indexOf("Total Physical Memory");
    result_arr[2] = to_split.substring(0,index_tot_phy_mem);
    result_arr.push(to_split.substring(index_tot_phy_mem,to_split.length));

    for(i = 0 ; i<result_arr.length;i++){
        index = result_arr[i].indexOf("\r");
        if(index!=-1) result_arr[i] = result_arr[i].substring(0,index);
    }

    regexp = /:\s+/;
    for( i=0;i<result_arr.length;i++){
        arr = result_arr[i].split(regexp);
        if(arr.length==2) final_msg = final_msg+"    <li><b>"+arr[0]+"</b>:"+arr[1]+"</li>";
        if(arr.length==3) final_msg = final_msg+"    <li><b>"+arr[0]+" "+arr[1]+"</b>:"+arr[2]+"</li>";
    }
    final_msg = final_msg + "</ul>";

    if(response_exitcode==0){                       //Successfull execution
        log.info("Successfull execution of command:"+command);
        log.info("Command result:"+final_msg);
        output.set("result",result_arr).set("exit-code",0).set("user_message",final_msg);
        log.trace("finished executing 'flint-util:winrm:basic:workflow:systeminfo.js' successfully")
    }
    else{
        log.error("Failure in execution, message:"+response_message+" | exitcode:"+response_exitcode);
        output.set("error",response_message).set("exit-code",-1);
        log.trace("finished executing 'flint-util:winrm:basic:workflow:systeminfo.js' with errors")
    }
}
else{
    log.error("Protocol Connection not given");
}
