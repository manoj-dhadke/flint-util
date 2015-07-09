#begin
@log.trace("Started executing 'patch' flintbit...")

#Flintbit Input Parameters
#mandatory
@connector_name=@input.get("connector_name")  #Name of the HTTP Connector
@request_method=@input.get("method")          #HTTP Request Method
@request_url=@input.get("url")                #HTTP Request URL
@request_body=@input.get("body")              #HTTP Request Body
@request_headers=@input.get("headers")        #HTTP Request Headers
#optional
@request_timeout=@input.get("timeout")        #Timeout in milliseconds, taken by
                                              #the Connetor to serve the request
if @connector_name.nil? || @connector_name.empty?
   @connector_name="http1"
end
if @request_method.nil? || @request_method.empty?
   @request_method="patch"
end
if @request_url.nil? || @request_url.empty?
   @request_url="http://httpbin.org/patch"
end
if @request_body.nil? || @request_body.empty?
   @request_body="Have some suggestions for flint? We are listening!!"
end
if @request_headers.nil? || @request_headers.empty?
   @request_headers="Content-Type:text/plain"
end

@log.info("Flintbit input parameters are, connector name :: #{@connector_name} |
                                          url ::            #{@request_url} |
                                          method ::         #{@request_method} |
                                          headers ::        #{@request_headers} |
                                          body ::           #{@request_body} |
                                          timeout ::        #{@request_timeout}")

@log.trace("Calling HTTP Connector...")
call_connector=@call.connector(@connector_name)
                    .set("method",@request_method)
                    .set("url",@request_url)
                    .set("body",@request_body)
                    .set("headers",@request_headers)
                    #.timeout(10000)          #Execution time of the Flintbit in milliseconds

if @request_timeout.to_s.empty?

    response=call_connector.sync

else

    response=call_connector.set("timeout",request_timeout).sync

end

#HTTP Connector Response Meta Parameters
response_exitcode=response.exitcode          #Exit status code
response_message=response.message            #Execution status messages

#HTTP Connector Response Parameters
response_body=response.get("body")           #Response Body
response_headers=response.get("headers")     #Response Headers

if response.exitcode == 0

    @log.info("Success in executing HTTP Connector where, exitcode :: #{response_exitcode} |
                                                           message :: #{response_message}")
    @log.info("HTTP Response Headers :: #{response_headers} |
                  HTTP Response Body :: #{response_body}")
    @output.set("result",response_body)
    @log.trace("Finished executing 'patch' flintbit with success...")

else

    @log.error("Failure executing HTTP Connector where, exitcode :: #{response_exitcode} |
                                                         message :: #{response_message}")
    @output.set("error",response_message)
    @log.trace("Finished executing 'patch' flintbit with error...")
end
#end
