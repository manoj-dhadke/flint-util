# begin
@log.trace("Started executing 'zendesk:create_user.rb' flintbit...")
begin
    # Flintbit Input Parameters
    @connector_name = @input.get('connector_name') # Name of the zendesk Connector
    #if you not want to provide connector name each time, jsut uncomment the below line and set zendesk connector_name.
    # @connector_name = 'zendesk' if @connector_name.nil?
    @action = 'create-user' # Contains the name of the operation: create-user
    @data = {} # Hash to store Key, Value pairs
    @data['email'] = @input.get('email')  #The user's primary email address
    @data['name'] = @input.get('name') #The user's name
    @data['alias'] = @input.get('alias') #An alias displayed to end users
    @data['details'] = @input.get('details') #Any details you want to store about the user, such as an address
    @data['external_id'] = @input.get('external_id') #A unique id you can specify for the user
    @data['notes'] = @input.get('notes') #Any notes you want to store about the user
    @data['phone'] = @input.get('phone')
    @data['role'] = @input.get('role')
    @request_timeout = @input.get('timeout')

    if @connector_name.nil? || @connector_name.empty?
     raise 'Please provide "Zendesk connector name (connector_name)" '
    end
    if @data.nil? || @data.empty?
     raise 'Please provide data to create user'
    end

    @log.info("Flintbit input parameters are, connector name :: #{@connector_name} |action :: #{@action} | data :: #{@data}")

    connector_call = @call.connector(@connector_name)
                    .set('action', @action)
                    .set('data', @data)


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
        @output.set('exitcode', response_exitcode).set('error', response_message).set('error', response_body)
    end
rescue Exception => e
    @log.error(e.message)
    @output.set('exit-code', -1).set('message', e.message)
end
@log.trace("Finished executing 'zendesk:create_user.rb' flintbit...")
# end
