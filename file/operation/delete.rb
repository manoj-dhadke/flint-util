# begin
@log.trace("Started executing 'flint-util:file:operation:delete.rb' flintbit...")
begin
    # Flintbit Input Parameters
    connector_name = @input.get('connector_name')       # Name of the FILE Connector
    action = 'delete'                                   # Delete action
    file_path = @input.get('file')                      # Path of File

    @log.info("Flintbit input parameters are, connector name :: #{connector_name} | action :: #{action} | file_path ::  #{file_path}")

    @log.trace("Calling #{connector_name}...")
    response = @call.connector(connector_name)
                    .set('action', action)
                    .set('file', file_path)
                    .sync

    # File Connector Response Meta Parameters
    response_exitcode = response.exitcode  # Exit status code
    response_message = response.message    # Execution status messages

    if response_exitcode == 0
        @log.info("SUCCESS in executing #{connector_name} where, exitcode :: #{response_exitcode} | message :: #{response_message}")
        @output.set('result', response_message)
    else
        @log.error("ERROR in executing #{connector_name} where, exitcode :: #{response_exitcode} | message :: #{response_message}")
        @output.exit(1, response_message)
    end
rescue Exception => e
    @log.error(e.message)
    @output.set('exit-code', 1).set('message', e.message)
end
@log.trace("Finished executing 'flint-util:file:operation:delete.rb' flintbit...")
