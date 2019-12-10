=begin
##########################################################################
#
#  INFIVERVE TECHNOLOGIES PTE LIMITED CONFIDENTIAL
#  __________________
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
@log.trace("Started executing 'flint-util:http:validation:head.rb' flintbit...")
begin
    # Flintbit Input Parameters
    # mandatory
    @connector_name = @input.get('connector_name')   # Name of the HTTP Connector
    @request_method = @input.get('method')           # HTTP Request Method
    @request_url = @input.get('url')                 # HTTP Request URL
    # optional
    @request_timeout = @input.get('timeout')         # HTTP Request Timeout in milliseconds, taken by the Connetor to serve the request
    @request_headers = @input.get('headers')         # HTTP Request Headers

    @connector_name = 'http1' if @connector_name.nil? || @connector_name.empty?
    @request_method = 'head' if @request_method.nil? || @request_method.empty?
    if @request_url.nil? || @request_url.empty?
        @request_url = 'http://jakarta.apache.org'
    end

    @log.info("Flintbit input parameters are, connector name :: #{@connector_name} | url :: #{@request_url} | method :: #{@request_method}")

    @log.trace('Calling HTTP Connector...')

    call_connector = @call.connector(@connector_name)
                          .set('method', @request_method)
                          .set('url', @request_url)
    # .timeout(10000)          #Execution time of the Flintbit in milliseconds

    response = if @request_timeout.to_s.empty?
                   call_connector.sync
               else
                   call_connector.set('timeout', @request_timeout).sync
               end

    # HTTP Connector Response Meta Parameters
    response_exitcode = response.exitcode    # Exit status code
    response_message = response.message      # Execution status message

    # HTTP Connector Response Parameters
    response_headers = response.get('headers') # Response Headers

    if response.exitcode == 0
        @log.info("Success in executing HTTP Connector where, exitcode :: #{response_exitcode} | message :: #{response_message}")
        @log.info("HTTP Response Headers :: #{response_headers}")
        @output.set('result', response_headers)
        @log.trace("Finished executing 'head' flintbit with success...")
    else
        @log.error("Failure in executing HTTP Connector where, exitcode :: #{response_exitcode} | message :: #{response_message}")
        @output.set('error', response_message)
        @log.trace("Finished executing 'head' flintbit with error...")
    end
rescue Exception => e
    @log.error(e.message)
    @output.set('exit-code', 1).set('message', e.message)
end
@log.trace("Finished execution 'flint-util:http:validation:head.rb' flintbit...")
# end
