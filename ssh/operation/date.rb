# begin
@log.trace("Started executing 'flint-util:operation:ssh.rb' flintbit...")
begin
    # Flintbit Input Parameters
    @connector_name = @input.get('connector_name')  # Name of the SSH Connector
    @target = @input.get('target')                  # Target machine where the command will be executed
    @type = @input.get('type')                      # Type of execution - shell or exec
    @username = @input.get('username')              # Target username
    @password = @input.get('password')              # Target password
    # @passphrase=@input.get("passphrase")          #Passphrase to be used
    @key_file = @input.get('key-file')              # SSH Key-file placed in "/flint-dist/gridconfig/keystore"
    @command = "date"                              # Command/Commands to be executed
    @timeout = @input.get('timeout')                # Timeout in milliseconds, taken by
    @type = @input.get('type')                      # the Connetor to serve the request

    @log.info("Flintbit input parameters are, connector name :: #{@connector_name} | target :: #{@target} | type :: #{@type} |
    username :: #{@username} | password :: #{@password} | key-file :: #{@key_file} | command  :: #{@command} | timeout  :: #{@timeout}")

    @log.trace('Calling SSH Connector...')
    if @timeout.to_s.empty?
        response = @call.connector(@connector_name)
                        .set('target', @target)
                        .set('type', @type)
                        .set('username', @username)
                        .set('password', @password)
                        .set('key-file', @key_file)
                        .set('command', @command)
                        .set('type', @type)
                        .sync
    # .timeout(10000) # Execution time of the Flintbit in milliseconds
    else
        response = @call.connector(@connector_name)
                        .set('target', @target)
                        .set('type', @type)
                        .set('username', @username)
                        .set('password', @password)
                        .set('key-file', @key_file)
                        .set('command', @command)
                        .set('timeout', @timeout)
                        .set('type', @type)
                        .sync
        # .timeout(10000) # Execution time of the Flintbit in milliseconds
    end

    # SSH Connector Response Meta Parameters
    response_exitcode = response.exitcode       # Exit status code
    response_message = response.message         # Execution status messages

    # SSH Connector Response Parameters
    response_body = response.get('result')      # Response Body

    if response_exitcode == 0
        @log.info("Success in executing SSH Connector, where exitcode :: #{response_exitcode} | message :: #{response_message}")
        @log.info("Command executed :: #{@command} | Command execution results :: #{response_body}")
        @output.set('result', response_body)
        @log.trace("Finished executing 'ssh' flintbit with success...")
    else
        @log.error("Failure in executing SSH Connector where, exitcode :: #{response_exitcode} | message :: #{response_message}")
        @output.set('error', response_message)
        @log.trace("Finished executing 'ssh' flintbit with error...")
    end
rescue Exception => e
    @log.error(e.message)
    @output.set('exit-code', 1).set('message', e.message)
end
# end
