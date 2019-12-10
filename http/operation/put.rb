=begin
#
#  INFIVERVE TECHNOLOGIES PTE LIMITED CONFIDENTIAL
#  _______________________________________________
# 
#  (C) INFIVERVE TECHNOLOGIES PTE LIMITED, SINGAPORE
#  All Rights Reserved.
#  Product / Project: Flint IT Automation Platform
#  NOTICE:  All information contained herein is, and remains
#  the property of INFIVERVE TECHNOLOGIES PTE LIMITED.
#  The intellectual and technical concepts contained
#  herein are proprietary to INFIVERVE TECHNOLOGIES PTE LIMITED.
#  Dissemination of this information or any form of reproduction of this material
#  is strictly forbidden unless prior written permission is obtained
#  from INFIVERVE TECHNOLOGIES PTE LIMITED, SINGAPORE.
=end

# begin
@log.trace("Started executing 'flint-util:http:operation:put.rb' flintbit...")
begin
    # Flintbit Input Parameters
    # mandatory
    @connector_name = @input.get('connector_name')   # Name of the HTTP Connector
    @request_method = 'put'           # HTTP Request Method
    @request_url = @input.get('url')                 # HTTP Request URL
    @request_body = @input.get('body')               # HTTP Request Body
    @request_headers = @input.get('headers')         # HTTP Request Headers
    @is_proxy=@input.get('is-proxy')		     #proxy (true or false)
    @proxy_details=@input.get('proxy')		     #if proxy is true then provide details of the proxy i. hostname,port,protocol
    # optional
    @request_timeout = @input.get('timeout') # Timeout in milliseconds, taken by the Connetor to serve the request

    @log.info("Flintbit input parameters are, connector name :: #{@connector_name} | url :: #{@request_url} | method :: #{@request_method} |
    headers :: #{@request_headers} | body :: #{@request_body} | timeout :: #{@request_timeout}")

    if @is_proxy.nil?		
           @is_proxy = false
    end

    @log.trace('Calling HTTP Connector...')
    if @request_timeout.to_s.empty?
        response = @call.connector(@connector_name)
                        .set('method', @request_method)
                        .set('url', @request_url)
                        .set('body', @request_body)
			.set('is-proxy',@is_proxy)
			.set('proxy',@proxy_details)
                        .set('headers', @request_headers)
                        .sync
    else
        response = @call.connector(@connector_name)
                        .set('method', @request_method)
                        .set('url', @request_url)
                        .set('body', @request_body)
                        .set('headers', @request_headers)
			.set('is-proxy',@is_proxy)
			.set('proxy',@proxy_details)
                        .set('timeout', @request_timeout)
                        .sync
    end

    # HTTP Connector Response Meta Parameters
    response_exitcode = response.exitcode  # Exit status code
    response_message = response.message    # Execution status messages

    # HTTP Connector Response Parameters
    @response_body = response.get('body')       # Response Body
    @response_headers = response.get('headers') # Response Headers

    if response.exitcode == 0
        @log.info("Success in executing HTTP Connector where, exitcode :: #{response_exitcode} | message :: #{response_message}")
        @log.info("HTTP Response Headers :: #{@response_headers} | HTTP Response Body :: #{@response_body}")
        @output.set('result', @response_body)
        @log.trace("Finished executing 'put' flintbit with success...")
    else
        @log.error("Failure executing HTTP Connector where, exitcode :: #{response_exitcode} | message :: #{response_message}")
        @output.set('error', response_message)
        @log.trace("Finished executing 'put' flintbit with error...")
    end
rescue Exception => e
    @log.error(e.message)
    @output.set('exit-code', 1).set('message', e.message)
end
# end
