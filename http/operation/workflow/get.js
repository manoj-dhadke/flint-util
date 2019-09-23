/**
 * Creation Date: 22/05/2019
 * Summary: GET method of HTTP
 * Description: To GET data from a URL using HTTP Connector
 */

//Starting execution of flintbit
log.trace("Started executing 'flint-util:http:operation:workflow:get.js'");

//method
method = "get";

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

//Headers - not mandatory
if (input_clone.hasOwnProperty("headers")) {
    headers = input.get("headers");
    if (headers != null || headers != "") {
        if (typeof headers == "object") {
            log.trace("Headers is an array")
            connector_call.set("headers", headers);

        }else if(headers.match(',')) {
            log.trace("Removing spaces if any: "+headers)
            headers = headers.replace(/ /g,'')
            log.trace("Multiple headers are given")
            headers = headers.split(',')

            connector_call.set("headers", headers);
            log.info("Headers: " + headers);
        } else {
            log.info("One header is given: " + headers)
            connector_call.set("headers", headers);
        }
    }else{
        log.trace("Headers are empty or null")
    }
}


//Is Proxy - not mandatory
if (input_clone.hasOwnProperty("is_proxy")) {
    is_proxy = input.get("is_proxy");
    if (is_proxy != null || is_proxy != "") {
        if(typeof is_proxy == "boolean"){
            connector_call.set("is-proxy", is_proxy);
        }else{
            if(is_proxy == "true"){
                is_proxy = true
            }else if(is_proxy == "false"){
                is_proxy = false
            }else{
                is_proxy = false
                connector_call.set("is-proxy", is_proxy);
                log.info("Is Proxy?: " + is_proxy);
            }
        }
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
log.trace("Connector response:: "+response)
//Response's meta parameters
response_exitcode = response.exitcode();
response_message = response.message();
log.trace("Message:: "+response_message)
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
    log.trace("Finished executing 'flint-util:http:operation:workflow:get.js' successfully")
}

else{
    log.error("Failure in execution of method:"+method);
    log.error("Error message: "+response_message)
    output.set("error",response_message).set("exit-code",response_exitcode).set('user_message', response_message);
    log.trace("Finished executing 'flint-util:http:operation:workflow:get.js' with errors");
}