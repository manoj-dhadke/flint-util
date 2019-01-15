log.trace("Started executing 'flint-util:http:operation:http_request.js' flintbit...")
try {
    // Flintbit Input Parameters
    // mandatory
    connector_name = input.get('connector_name')    // Name of the HTTP Connector
    request_method = input.get('method')            // HTTP Request Method
    request_url = input.get('url')                // HTTP Request URL
    request_body = input.get('body')              // HTTP Request Body
    request_headers = input.get('headers')       // HTTP Request Headers
    is_proxy = input.get('is_proxy')		     //proxy (true or false)
    proxy_details = input.get('proxy')		     //if proxy is true then provide details of the proxy i. hostname,port,protocol

    // optional
    request_timeout = input.get('timeout')       // Timeout in milliseconds, taken by the Connetor to serve the request
    log.info("Flintbit input parameters are, connector name " + connector_name + " url :: " + request_url + " method :: " + request_method + " headers :: " + request_headers + " body :: " + request_body)

    if (is_proxy == null || target == "") {
        is_proxy = false

    }
    log.trace('Calling HTTP Connector...')

    //Request Method swith case
    switch (request_method) {
        case "GET": {
            call_connector = call.connector(connector_name)
                .set('method', request_method)
                .set('url', request_url)
                .set('is-proxy', is_proxy)
                //.set('proxy', proxy_details)
                .set('headers', request_headers)
                .timeout(60000)          //Execution time of the Flintbit in milliseconds



        } break;

        default: {
            call_connector = call.connector(connector_name)
                .set('method', request_method)
                .set('url', request_url)
                .set('body', request_body)
                .set('is-proxy', is_proxy)
                //.set('proxy', proxy_details)
                .set('headers', request_headers)
                .timeout(60000)          //Execution time of the Flintbit in milliseconds

        }
    }
    if (request_timeout == "" || request_timeout == null) {
        response = call_connector.sync()

    }
    else {
        response = call_connector.set('timeout', request_timeout).sync()

    }
    // HTTP Connector Response Meta Parameters
    response_exitcode = response.exitcode()  // Exit status code
    log.info("Exitcode: " + response_exitcode)
    response_message = response.message()    // Execution status messages

    // HTTP Connector Response Parameters
    response_body = response.get('body')       //Response Body
    response_headers = response.get('headers') //Response Headers

    if (response_exitcode == 0) {
        log.info("Success in executing HTTP Connector where, exitcode :: " + response_exitcode + " message :: " + response_message)
        log.info("HTTP Response Headers :: " + response_headers + " HTTP Response Body :: " + response_body)
        output.set('body', response_body).set('headers', response_headers)
        log.trace("Finished executing 'Http request' flintbit with success...")

    }

    else {
        log.error("Failure executing HTTP Connector where, exitcode :: " + response_exitcode + " message :: " + response_message)
        output.set('error', response_message).set("exit-code", -2)
        output.exit(-1, response_message)
        log.trace("Finished executing 'http_request.js' flintbit with error...")

    }

} catch (error) {
    log.error("Error message: " + error)
    output.exit(-5, response_message)
    
}
log.trace("Finished execution 'flint-util:http:operation:http_request.js' flintbit...")
