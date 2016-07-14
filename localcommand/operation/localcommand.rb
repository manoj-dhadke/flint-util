# begin
@log.trace("Started executing 'flint-util:operation:local-command.rb' flintbit...")
begin
    # Flintbit Input Parameters
    @connector_name = @input.get('connector_name')  # Name of the local-command Connector
    @command =  @input.get('command')               # Command/Commands to be execute

    @log.info("Flintbit input parameters are, connector name :: #{@connector_name} |command  :: #{@command} ")

    @log.trace('Calling local-command Connector...')

        response = @call.connector(@connector_name)
                        .set('command', @command)
                        .set('timeout', 40000)
                        .sync
        # .timeout(10000) # Execution time of the Flintbit in milliseconds
    end

    # Local-command Connector Response Meta Parameters
    response_exitcode = response.exitcode       # Exit status code
    response_message = response.message         # Execution status messages

    # Local-command Connector Response Parameters
    response_body = response.get('result')

    if response_exitcode == 0
        @log.info("Success in executing Talnet Connector, where exitcode :: #{response_exitcode} | message :: #{response_message}")
        @log.info("Command executed :: #{@command} | Command execution results :: #{response_body}")
        @output.set('result', response_body)
        @log.trace("Finished executing 'talnet' flintbit with success...")
    else
        @log.error("Failure in executing Local-command Connector where, exitcode :: #{response_exitcode} | message :: #{response_message}")
        @output.set('error', response_message)
        @log.trace("Finished executing 'Local-command' flintbit with error...")
    end
rescue Exception => e
    @log.error(e.message)
    @output.set('exit-code', 1).set('message', e.message)
end
# end
