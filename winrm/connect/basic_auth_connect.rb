require 'winrm'
@log.trace("Started executing 'flint-util:winrm:connect:basic_auth_connect.rb' flintbit...")
begin
    command = @input.get('command')

    if command.nil?
        raise "Please provide 'command' to execute on windows machine"
    end
    hostname = @input.get('hostname')
    protocol = @input.get('protocol')
    username = @input.get('username')
    password = @input.get('password')
    # check for hostname.
    if hostname.nil?
        raise "Please provide 'hostname' to Connect with windows machine"
    end
    # check for username.
    if username.nil?
        raise "Please provide 'username' to Connect with windows machine"
    end
    # check for Password.
    if password.nil?
        raise "Please provide 'password' to Connect with windows machine"
    end
    # check for Protocol.
    if protocol.nil?
        @log.info("Protocol is not provided so using default protocol as 'http'")
        protocol = 'http'
    end
    # Setting port on the basis of protocol value.
    port = 5985
    if protocol.casecmp('http').zero?
        port = 5985
    else
        protocol = 'https'
        port = 5986
    end
    endpoint = '' + protocol + '://' + hostname + ':' + port.to_s + '/wsman'
    winrm = WinRM::WinRMWebService.new(endpoint, :plaintext, user: username, pass: password, basic_auth_only: true)
    @command_output = ''
    @error_output = ''
    winrm.create_executor do |executor|
        executor.run_cmd(command) do |stdout, stderr|
            @command_output = @command_output.to_s + stdout.to_s
            @error_output = @error_output.to_s + stderr.to_s
        end
    end
    @log.debug('Output of command : ' + @command_output.to_s)
    @log.debug('Error output of command : ' + @error_output.to_s)
    @output.set('message', 'success').set('exit-code', 0).set('output', @command_output).set('error_output', @error_output)

rescue => e
    @log.error(e.message)
    @output.set('message', e.message).set('exit-code', -1)
    @log.info('output in exception')
end
@log.trace("Finished executing 'flint-util:winrm:connect:basic_auth_connect.rb' flintbit")
# end
