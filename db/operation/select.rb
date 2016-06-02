# begin
@log.trace("Started execution of 'select' flintbit...")
begin
    # Flintbit Input Parameters

    input_type = @input.type
    # this input parameters are not used

    if input_type == 'application/xml' # Input type of Request
        # All mandatory if jdbc_url not provided
        @connector_name = @input.get('/connector_name/text()') # Name of the JDBC Connector
        @jdbc_url = @input.get('/jdbc_url/text()')             # JDBC Url
        @query = @input.get('/query/text()')                   # Query of the Database
        # Not mandatory if jdbc url is provided
        @port = @input.get('/port/text()')                     # Port no of Datbase
        @database = @input.get('/database/text()')             # Name of the Database
        @db_type = @input.get('/db_type/text()')               # Type of the Database
        @target = @input.get('/target/text()')                 # Hostname of the database server
        @driver = @input.get('/driver/text()')                 # Jdbc driver name for database

    else
        # All mandatory if jdbc_url not provided
        @connector_name = @input.get('connector_name')         # Name of the JDBC Connector
        @jdbc_url = @input.get('jdbc_url')                     # JDBC Url
        @query = @input.get('query')                           # Query of the Database
        # Not mandatory if jdbc url is provided
        @port = @input.get('port')                             # Port no of Datbase
        @database = @input.get('database')                     # Type of the Database
        @db_type = @input.get('db_type')                       # Type of the Database
        @target = @input.get('target')                         # Hostname of the database server
        @driver = @input.get('driver')                         # Jdbc driver name for database
    end

    @log.info("Flintbit input parameters are, connector name :: #{@connector_name} | db_type :: #{@db_type}| jdbc_url :: #{@jdbc_url} |
    port :: #{@port} | database :: #{@database} | target :: #{@target} | driver :: #{@driver} | query :: #{@query}")

    @log.trace('Calling JDBC Connector...')
    if @jdbc_url.nil?
        response = @call.connector(@connector_name)
                        .set('action', 'select')
                        .set('port', @port)
                        .set('database', @database)
                        .set('db_type', @db_type)
                        .set('target', @target)
                        .set('query', @query)
                        .set('driver', @driver).sync

    else
        response = @call.connector(@connector_name)
                        .set('action', 'select')
                        .set('query', @query)
                        .set('jdbc-url', @jdbc_url)
                        .set('driver', @driver).sync
    end
    # JDBC Connector Response Meta Parameters
    response_exitcode = response.exitcode   # Exit status code
    response_message = response.message     # Execution status message

    # JDBC Connector Response Parameters
    result = response.get('result')         # Response Body

    if response.exitcode == 0
        @log.info("Success in executing JDBC Connector where, exitcode :: #{response_exitcode} | message :: #{response_message}")
        @log.info("HTTP Response Body :: #{result}")
        @output.set('result', result.to_s)
    else
        @log.error("Failure in executing JDBC Connector where, exitcode :: #{response_exitcode} | message :: #{response_message}")
        @output.set('error', response_message)
        @log.trace("Finished executing 'select' flintbit with error...")
    end
rescue Exception => e
    @log.error(e.message)
    @output.set('exit-code', 1).set('message', e.message)
end
@log.trace("Finished execution of 'select.rb'")
# end
