/**
 * Creation Date: 22/05/2019
 * Summary: POST method of HTTP
 * Description: To POST data from a URL using HTTP Connector
 */

//Starting execution of flintbit
log.trace("Started executing 'flint-util:http:operation:workflow:post.js'");

//method
method = "post";

input_clone = JSON.parse(input); //For checking purposes

//Connector name - mandatory
connector_name = "http";
connector_call = call.connector(connector_name);
log.info("Connector Name: " + connector_name);

//URL - mandatory
if (input_clone.hasOwnProperty("url")) {
    url = input.get("url");
    if (url != null || url != "") {
        connector_call.set("url", url);
        log.info("URL: " + url);
    }
    else {
        log.error("URL is null or empty string.");
    }
}
else {
    log.error("'url' key not given in input JSON");
}

//Body - mandatory
if (input_clone.hasOwnProperty("body")) {
    body = input.get("body");
    if (body != null || body != "") {
        connector_call.set("body", body);
        log.info("Body: " + body);
    }
    else {
        log.error("Body is null or empty string.");
    }
}
else {
    log.error("'body' key not given in input JSON");
}

//Headers - not mandatory
if (input_clone.hasOwnProperty("headers")) {
    headers = input.get("headers");
    // Headers array
    if (headers != null || headers != "") {
        if (typeof headers == "object") {
            log.trace("Headers is an array")
            log.trace(headers)
            connector_call.set("headers", headers);

            // Multiple Headers
        } else if (headers.match(',')) {
            log.trace("Removing spaces if any: " + headers)
            log.trace("Multiple headers are given")
            headers = headers.split(',')
            for (index in headers) {
                log.trace("=============>> " + headers[index].indexOf('Authorization') >= 0)
                if (headers[index].indexOf('Authorization') >= 0) {
                    log.trace("Authorization header is >>>>>>> " + headers[index])

                } else {
                    headers[index].replace(/ /g, '')
                    log.trace('Removing whitespaces  >>> ' + headers)
                }
            }

            connector_call.set("headers", headers);
            log.info("Headers: " + headers);
            log.info("Type of header is "+typeof headers)
        } else {
            // Single header
            log.info("One header is given: " + headers)
            // Single headers
            if (headers.indexOf('Authorization') >= 0) {
                log.trace("Single header: Authorization is given")
                connector_call.set("headers", headers);
            } else {
                headers = headers.replace(/ /g, '')
                connector_call.set("headers", headers);
            }
        }
    } else {
        log.trace("Headers are empty or null")
    }
}


//Is Proxy - not mandatory
if (input_clone.hasOwnProperty("is_proxy")) {
    is_proxy = input.get("is_proxy");
    if (is_proxy != null & is_proxy != "") {
        if (typeof is_proxy == "boolean") {
            connector_call.set("is-proxy", is_proxy);
        } else {
            if (is_proxy == "true") {
                is_proxy = true
            } else if (is_proxy == "false") {
                is_proxy = false
            } else {
                is_proxy = false
                connector_call.set("is-proxy", is_proxy);
                log.info("Is Proxy?: " + is_proxy);
            }
        }
    }
}

//Proxy - not mandatory
if (input_clone.hasOwnProperty("proxy")) {
    proxy = input.get("proxy");
    if (proxy != null || proxy != "") {
        connector_call.set("proxy", proxy);
        log.info("Proxy: " + proxy);
    }
}

//Timeout - not mandatory
if (input_clone.hasOwnProperty("timeout")) {
    timeout = input.get("timeout");
    if (timeout != null && timeout != "") {
        timeout = parseInt(timeout);
    }
    else {
        timeout = 60000;
    }
}
else {
    timeout = 60000;
}
connector_call.set("timeout", timeout);
log.info("Timeout: " + timeout);

//Calling the HTTP connector
response = connector_call.set("method", method).sync();

//Response's meta parameters
response_exitcode = response.exitcode();
response_message = response.message();
log.trace("Response message:: "+response_message)

//Response's Body
response_body = response.get("body");

//Response's Headers
response_headers = response.get("headers");

if (response_exitcode == 0) {
    log.info("Successfull execution of method:" + method);
    log.info("Method result:" + response_body);
    //User Message
    user_message = "Response-Body: " + response_body + "  |  Response-Headers: " + response_headers;
    output.set("exit-code", 0).set("result", response_body).set("user_message", user_message);
    log.trace("Finished executing 'flint-util:http:operation:workflow:post.js' successfully")
}

else {
    log.error("Failure in execution of method:" + method);
    output.set("error", response_message).set("exit-code", response_exitcode);
    log.trace("Finished executing 'flint-util:http:operation:workflow:post.js' with errors");
}