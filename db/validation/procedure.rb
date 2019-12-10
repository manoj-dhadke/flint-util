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
@log.trace("Started execution of 'procedure' flintbit...")
begin
    # Flintbit Input Parameters

    input_type = @input.type
    # this input parameters are not used

    if input_type == 'application/xml' # Input type of Request
        # All mandatory if jdbc_url not provided
        @connector_name = @input.get('/connector_name/text()') # Name of the JDBC Connector
        @jdbc_url = @input.get('/jdbc_url/text()')             # JDBC Url
        @query = @input.get('/query/text()')                   # Query of the Database
        @driver = @input.get('/driver/text()')                 # Jdbc driver name for database
    else
        # All mandatory if jdbc_url not provided
        @connector_name = @input.get('connector_name') # Name of the JDBC Connector
        @jdbc_url = @input.get('jdbc_url')             # JDBC Url
        @query = @input.get('query')                   # Query of the Database
        @driver = @input.get('driver')                 # Jdbc driver name for database
    end

    @connector_name = 'mysql_db' if @connector_name.nil? || @connector_name.empty?
    @jdbc_url = 'your jdbc url' if @jdbc_url.nil? || @jdbc_url.empty?
    @query = 'your procedure call' if @query.nil? || @query.empty?
    @driver = 'com.mysql.jdbc.Driver' if @driver.nil? || @driver.empty?

    @log.info("Flintbit input parameters are, connector name :: #{@connector_name} | jdbc_url :: #{@jdbc_url} |
    driver :: #{@driver} | query :: #{@query}")

    @log.trace('Calling JDBC Connector...')

    response = @call.connector(@connector_name)
                    .set('action', 'procedure')
                    .set('query', @query)
                    .set('jdbc-url', @jdbc_url)
                    .set('driver', @driver).sync

    # JDBC Connector Response Meta Parameters
    response_exitcode = response.exitcode # Exit status code
    response_message = response.message   # Execution status message

    # JDBC Connector Response Parameters
    result = response.get('result')       # Response Body

    if response.exitcode == 0
        @log.info("Success in executing JDBC Connector where, exitcode :: #{response_exitcode} | message ::  #{response_message}")
        @log.info("HTTP Response Body :: #{result}")
        @output.set('result', result.to_s)
    else
        @log.error("Failure in executing JDBC Connector where, exitcode :: #{response_exitcode} | message ::  #{response_message}")
        @output.set('error', response_message)
        @log.trace("Finished executing 'procedure' flintbit with error....")
    end
rescue Exception => e
    @log.error(e.message)
    @output.set('exit-code', 1).set('message', e.message)
end
@log.trace("Finished execution of 'procedure.rb'")
# end
