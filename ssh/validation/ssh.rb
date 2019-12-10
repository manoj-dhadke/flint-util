=begin
#
#  INFIVERVE TECHNOLOGIES PTE LIMITED CONFIDENTIAL
#  _______________________________________________
# 
#  (C) INFIVERVE TECHNOLOGIES PTE LIMITED, SINGAPORE
#  All Rights Reserved.
#  Product / Project: Flint IT Automation Platform
#  NOTICE:  All information contained herein is, and remains
#  the property of INFIVERVE TECHNOLOGIES PTE LIMITED.
#  The intellectual and technical concepts contained
#  herein are proprietary to INFIVERVE TECHNOLOGIES PTE LIMITED.
#  Dissemination of this information or any form of reproduction of this material
#  is strictly forbidden unless prior written permission is obtained
#  from INFIVERVE TECHNOLOGIES PTE LIMITED, SINGAPORE.
=end

# begin
@log.trace("Started executing 'flint-util:validation:ssh.rb' flintbit...")
begin
    # Flintbit Input Parameters
    @connector_name = @input.get('connector_name')     # Name of the SSH Connector
    @target = @input.get('target')                     # Target machine where the command will be executed
    @type = @input.get('type')                         # Type of execution - shell or exec
    @username = @input.get('username')                 # Target username
    @password = @input.get('password')                 # Target password
    # @passphrase=@input.get("passphrase")             #Passphrase to be used
    @key_file = @input.get('key-file')                 # SSH Key-file placed in "/flint-dist/gridconfig/keystore"
    @command = @input.get('command')                   # Command/Commands to be executed
    @timeout = @input.get('timeout')                   # Timeout in milliseconds, taken by
    @type = @input.get('type')                         # the Connetor to serve the request

    @connector_name = 'ssh_test' if @connector_name.nil? || @connector_name.empty?
    @target = 'ip address of target' if @target.nil? || @target.empty?
    @type = 'exec' if @type.nil? || @type.empty?
    @username = 'username of target' if @username.nil? || @username.empty?
    @password = 'password of target machine' if @password.nil? || @password.empty?
    @passphrase = '' if @passphrase.nil? || @passphrase.empty?
    @key_file = 'public key' if @key_file.nil? || @key_file.empty?
    @command = 'command' if @command.nil? || @command.empty?
    @timeout = 100_000 if @timeout.nil? || @timeout.empty?
    @type = 'exec' if @type.nil? || @type.empty?
    @log.info("Flintbit input parameters are, connector name :: #{@connector_name} |
                                              target ::         #{@target} |
                                              type ::           #{@type} |
                                              username ::       #{@username} |
                                              password ::       #{@password} |
                                              passphrase ::     #{@passphrase} |
                                              key-file ::       #{@key_file} |
                                              command  ::       #{@command} |
                                              timeout  ::       #{@timeout}")

    @log.trace('Calling SSH Connector...')
    if @timeout.to_s.empty?
        response = @call.connector(@connector_name)
                        .set('target', @target)
                        .set('type', @type)
                        .set('username', @username)
                        .set('password', @password)
                        .set('passphrase', @passphrase)
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
                        .set('passphrase', @passphrase)
                        .set('key-file', @key_file)
                        .set('command', @command)
                        .set('timeout', @timeout)
                        .set('type', @type)
                        .sync
        # .timeout(10000) # Execution time of the Flintbit in milliseconds
    end

    # SSH Connector Response Meta Parameters
    response_exitcode = response.exitcode              # Exit status code
    response_message = response.message                # Execution status messages

    # SSH Connector Response Parameters
    response_body = response.get('result') # Response Body

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
