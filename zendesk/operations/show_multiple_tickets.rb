# begin
@log.trace("Started executing 'zendesk:show_multiple_ticket.rb' flintbit...")
begin
    # Flintbit Input Parameters
    @connector_name = @input.get('connector_name') # Name of the zendesk Connector
    #if you not want to provide connector name each time, jsut uncomment the below line and set zendesk connector_name.
    # @connector_name = 'zendesk' if @connector_name.nil?
    @action = 'show-multiple-tickets' # Contains the name of the operation: show-multiple-tickets
    @id = @input.get('ticket-id') #Provide multiple Ticket Id's to view its details
    @request_timeout = @input.get('timeout')

    if @connector_name.nil? || @connector_name.empty?
     raise 'Please provide "Zendesk connector name (connector_name)" '
    end

    @log.info("Flintbit input parameters are, connector name :: #{@connector_name} |action :: #{@action}  | ticket-id's :: #{@id}")

    connector_call = @call.connector(@connector_name)
                    .set('action', @action)
                    .set('ticket-id', @id)


 if @request_timeout.nil? || @request_timeout.is_a?(String)
         @log.trace("Calling #{@connector_name} with default timeout...")
         response = connector_call.sync
     else
         @log.trace("Calling #{@connector_name} with given timeout #{@request_timeout}...")
         response = connector_call.timeout(@request_timeout).sync
     end

    # zendesk Connector Response Meta Parameters
    response_exitcode = response.exitcode           # Exit status code
    response_message = response.message             # Execution status message

    # zendesk Connector Response Parameters
    response_body = response.get('body') # Response body

    if response_exitcode == 0
        @log.info("Success in executing zendesk Connector, where exitcode :: #{response_exitcode} | message :: #{response_message}")
        @log.info("Result : #{response_body}")
        @output.setraw('result', response_body)
    else
        @log.error("Failure in executing zendesk Connector where, exitcode :: #{response_exitcode} | message :: #{response_message} | error :: #{response_body}")
        @output.set('exitcode', response_exitcode).set('error', response_message)
    end
rescue Exception => e
    @log.error(e.message)
    @output.set('exit-code', -1).set('message', e.message)
end
@log.trace("Finished executing 'zendesk:show_multiple_ticket.rb' flintbit...")
# end
