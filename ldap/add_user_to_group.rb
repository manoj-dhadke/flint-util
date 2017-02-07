@log.trace("Started execution 'ldap:add_user_to_group.rb' flintbit...") # execution Started
begin
    # Flintbit input parameters
    # Mandatory
    @connector_name = @input.get('connector_name') # ldap connector name
    @userdn = @input.get('user-distinguished-names') #user distinguished-names to identify user in active-directory
    @groupdn = @input.get('group-distinguished-names') #group distinguished-names to identify group in active-directory

    # Optional input parameters
    request_timeout = @input.get('timeout')	# Execution time of the Flintbit in milliseconds (default timeout is 60000 milloseconds)

    connector_call = @call.connector(@connector_name)
                          .set('action', 'add-user-to-group')
                          .set('distinguished-names', @userdn)
                          .set('group-distinguished-names', @groupdn)

    if @connector_name.nil? || @connector_name.empty?
        raise 'Please provide "ldap connector name (connector_name)" to  add user to group'
    end

    if @userdn.nil? || @userdn.empty?
        raise 'Please provide "user distinguished name (user-distinguished-names)" to  add user to group'
    end

    if @groupdn.nil? || @groupdn.empty?
        raise 'Please provide "group distinguished name (group-distinguished-names)"to  add user to group'
    end

    if request_timeout.nil? || request_timeout.is_a?(String)
        @log.trace("Calling #{@connector_name} with default timeout...")
        # calling ldap connector
        response = connector_call.sync
    else
        @log.trace("Calling #{@connector_name} with given timeout #{request_timeout}...")
        # calling ldap connector
        response = connector_call.timeout(request_timeout).sync
    end

    # ldap  Connector Response Meta Parameters
    response_exitcode = response.exitcode # Exit status code
    response_message =  response.message # Execution status message

    @log.info("RESPONSE :: #{response}")

    if response_exitcode == 0
        @log.info("Success in executing #{@connector_name} Connector, where exitcode :: #{response_exitcode} | message :: #{response_message}")
        @output.set('result', response.to_s).set('exit-code', 0)
    else
        @log.error("ERROR in executing #{@connector_name} where, exitcode :: #{response_exitcode} | message :: #{response_message}")
        @output.set('message', response_message.to_s).set('exit-code', -1)
    end

rescue Exception => e
    @log.error(e.message)
    @output.set('exit-code', -1).set('message', e.message)
end

@log.trace("Finished execution 'ldap:add_user_to_group.rb' flintbit...") # Execution Finished
