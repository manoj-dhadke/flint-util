require 'winrm'
@log.trace("Started executing 'flint-util:winrm:connect:ntlm_connect.rb' flintbit...")
begin
    command = @input.get('command')
    hostname = @input.get('hostname')
    protocol = @input.get('protocol')
    username = @input.get('username')
    password = @input.get('password')
    if command.nil?
        raise "Please provide 'command' to execute on windows machine"
    end
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
    winrm = WinRM::WinRMWebService.new(endpoint, :negotiate, user: username, pass: password)
    winrm.create_executor do |executor|
        executor.run_cmd(command) do |stdout, stderr|
            @log.debug('Output of command : ' + stdout)
            @log.debug('Error output of command : ' + stderr)
            @output.set('message', 'success').set('exit-code', 0).set('output', stdout).set('error_output', stderr)
        end
    end
rescue => e
    @log.error(e.message)
    @output.set('message', e.message).set('exit-code', -1)
    @log.info('output in exception')
end
@log.trace("Finished executing 'flint-util:winrm:connect:ntlm_connect.rb' flintbit")
# end
