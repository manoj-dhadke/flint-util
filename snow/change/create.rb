# begin
@log.trace("Started executing 'flint-snow:change:create.rb' flintbit...")
begin
    # Flintbit Input Parameters
    @connector_name = @input.get('connector_name') # Name of the ServiceNow Connector
    if @connector_name.nil?
        @connector_name = @config.global('flintserve.connector_name')
        @connector_name = 'servicenow' if @connector_name.nil?
   end
    @action = 'create-record' # Contains the name of the operation: list
    @tableName = 'change_request'
    @data = @input.get('data')

    @log.info("Input Data#{@data}")
    @log.info("Flintbit input parameters are, connector name :: #{@connector_name} |action :: #{@action}| tableName :: #{@tableName}")

    response = @call.connector(@connector_name)
                    .set('action', @action)
                    .set('table-name', @tableName)
                    .set('data', @data)
                    .sync

    # ServiceNow Connector Response Meta Parameters
    response_exitcode = response.exitcode           # Exit status code
    response_message = response.message             # Execution status message

    # ServiceNow Connector Response Parameters
    response_body = response.get('body') # Response body

    if response_exitcode == 0
        @log.info("Success in executing serviceNow Connector, where exitcode :: #{response_exitcode} | message :: #{response_message}")
        @log.info("#{response_body}")
        @output.setraw('result', "#{response_body}")
        @log.trace("Finished executing 'serviceNow' flintbit with success...")
    else
        @log.error("Failure in executing serviceNow Connector where, exitcode :: #{response_exitcode} | message :: #{response_message}")
        @output.set('error', response_message)
        @log.trace("Finished executing 'serviceNow' flintbit with error...")
    end
rescue Exception => e
    @log.error(e.message)
    @output.set('exit-code', 1).set('message', e.message)
end
@log.trace("Finished executing 'flint-snow:change:create.rb' flintbit...")
# end
