/**
 * Creation Date: 22/05/2019
 * Summary: PUT method of HTTP
 * Description: To PUT data from a URL using HTTP Connector
 */

//Starting execution of flintbit
log.trace("Started executing 'flint-util:http:operation:workflow:put.js'");

//method
method = "put";

input_clone = JSON.parse(input); //For checking purposes

//Connector name - mandatory
connector_name = "http";
connector_call = call.connector(connector_name);
log.info("Connector Name: "+connector_name);
/*
if(input_clone.hasOwnProperty("connector_name")){
    connector_name = input.get("connector_name");
    if(connector_name!=null || connector_name!=""){
        connector_call = call.connector(connector_name);
        log.info("Connector Name: "+connector_name);
    }
    else{
        log.error("Connector Name is null or empty string.");
    }
}
else{
    log.error("'connector_name' key not given in input JSON");
}
*/
//URL - mandatory
if(input_clone.hasOwnProperty("url")){
    url = input.get("url");
    if(url!=null || url!=""){
        connector_call.set("url",url);
        log.info("URL: "+url);
    }
    else{
        log.error("URL is null or empty string.");
    }
}
else{
    log.error("'url' key not given in input JSON");
}

//Body - mandatory
if(input_clone.hasOwnProperty("body")){
    body = input.get("body");
    if(body!=null || body!=""){
        connector_call.set("body",body);
        log.info("Body: "+body);
    }
    else{
        log.error("Body is null or empty string.");
    }
}
else{
    log.error("'body' key not given in input JSON");
}

//Headers - not mandatory
if(input_clone.hasOwnProperty("headers")){
    headers = input.get("headers");
    if(headers!=null || headers!=""){
        connector_call.set("headers",headers);
        log.info("Headers: "+headers);
    }
}

//Is Proxy - not mandatory
if(input_clone.hasOwnProperty("is_proxy")){
    is_proxy = input.get("is_proxy");
    if(is_proxy!=null || is_proxy!=""){
        connector_call.set("is-proxy",is_proxy);
        log.info("Is-Proxy: "+is_proxy);
    }
}

//Proxy - not mandatory
if(input_clone.hasOwnProperty("proxy")){
    proxy = input.get("proxy");
    if(proxy!=null || proxy!=""){
        connector_call.set("proxy",proxy);
        log.info("Proxy: "+proxy);
    }
}

//Timeout - not mandatory
if(input_clone.hasOwnProperty("timeout")){
    timeout = input.get("timeout");
    if(timeout!=null || timeout!=""){
        timeout = parseInt(timeout);
    }
    else{
        timeout = 60000;
    }
}
else{
    timeout = 60000;
}
connector_call.set("timeout",timeout);
log.info("Timeout: "+timeout);

//Calling the HTTP connector
response = connector_call.set("method",method).sync();

//Response's meta parameters
response_exitcode = response.exitcode();
response_message = response.message();

//Response's Body
response_body = response.get("body");

//Response's Headers
response_headers = response.get("headers");

if(response_exitcode==0){
    log.info("Successfull execution of method:"+method);
    log.info("Method result:"+response_body);
    //User Message
    user_message = "Response-Body: "+response_body+"  |  Response-Headers: "+response_headers;
    output.set("exit-code",0).set("result",response_body).set("user_message",user_message);
    log.trace("Finished executing 'flint-util:http:operation:workflow:put.js' successfully")
}

else{
    log.error("Failure in execution of method:"+method);
    output.set("error",response_message).set("exit-code",response_exitcode);
    log.trace("Finished executing 'flint-util:http:operation:workflow:put.js' with errors");
}