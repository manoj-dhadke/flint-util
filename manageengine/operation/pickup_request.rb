# begin
@log.trace("Started executing 'flint-util:operation:add_request11.rb' flintbit...")
begin
    # Flintbit Input Parameters
    @connector_name = @input.get('connector_name')        # Name of the ManageEngine Connector
    @action = 'pickup-request'                            # Action to be perform
    @requestid = @input.get('request-id')                  # Request-id of request

@log.info("Flintbit input parameters are, connector name :: #{@connector_name} | action :: #{@action} | requestid :: #{@requestid} ")

    @log.trace('Calling ManageEngine Connector...')


response = @call.connector('manageenginesdp')
                .set('action', @action)
                .set('request-id', @requestid)
                .sync

 # ManageEngine Connector Response Meta Parameters
    response_exitcode = response.exitcode       # Exit status code
    response_message = response.message         # Execution status messages

 # ManageEngine Connector Response Parameters
    response_body = response      # Response Body

    if response_exitcode == 0
        @log.info("Success in executing ManageEngine Connector, where exitcode :: #{response_exitcode} | message :: #{response_message}")
        @output.setraw('result', response_body.to_s)
        @log.trace("Finished executing 'add_request11' flintbit with success...")
    else
        @log.error("Failure in executing ManageEngine Connector where, exitcode :: #{response_exitcode} | message :: #{response_message}")
        @output.set('error', response_message)
        @log.trace("Finished executing 'add_request11' flintbit with error...")
    end
rescue Exception => e
    @log.error(e.message)
    @output.set('exit-code', 1).set('message', e.message)
end
# end
