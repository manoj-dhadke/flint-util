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
@log.trace("Started executing 'example:remove_files_directory.rb' flintbit...")
begin
    # Flintbit Input Parameters
    @connector_name = @config.global('ssh_serviceaide_linux.connector_name')  # Name of the SSH Connector
    @target = @input.get('target')                  # Target machine where the command will be executed
    #@type = @input.get('type')                      # Type of execution - shell or exec
    @username = @input.get('username')              # Target username
    @password = @input.get('password')              # Target password
    # @passphrase=@input.get("passphrase")          #Passphrase to be used
    #@key_file = @input.get('key-file')              # SSH Key-file placed in "/flint-dist/gridconfig/keystore"
    @file= @input.get('File')
    @command = "[ -f #{@file} ] && echo 'File exist' || echo 'File does not exist'"               #Commands to be executed
    @command_main="sudo sh #{@file} start"
    #@timeout = @input.get('timeout')                # Timeout in milliseconds, taken by
    #@type = @input.get('type')                      # the Connetor to serve the request

    @log.info("Flintbit input parameters are, connector name :: #{@connector_name} | target :: #{@target}  |
    username :: #{@username} | password :: #{@password} | command  :: #{@command}")

           if @target.nil?
                raise "Please provide 'hostname'"
            end
            # check for username present in global config.
            if @username.nil?
                raise "Please provide 'username'"
            end
            # check for Password present in global config.
            if @password.nil?
                raise "Please provide 'password'"
            end

    
    @log.trace('Calling SSH Connector...')
    if @timeout.to_s.empty?
        response = @call.connector(@connector_name)
                        .set('target', @target)
                        .set('type', @type)
                        .set('username', @username)
                        .set('password', @password)
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
                        .set('command', @command)
                        .set('type', @type)
                        .sync
        # .timeout(10000) # Execution time of the Flintbit in milliseconds
    end
    @log.info("whether the file exists or not: #{response}")
    if (response.get('result').include? 'File exist')
      
      if @timeout.to_s.empty?
        response = @call.connector(@connector_name)
                        .set('target', @target)
                        .set('type', @type)
                        .set('username', @username)
                        .set('password', @password)
                        .set('command', @command_main)
                        .set('type', @type)
                        .sync
       # .timeout(10000) # Execution time of the Flintbit in milliseconds
     else
        response = @call.connector(@connector_name)
                        .set('target', @target)
                        .set('type', @type)
                        .set('username', @username)
                        .set('password', @password)
                        .set('command', @command_main)
                        .set('type', @type)
                        .sync
        # .timeout(10000) # Execution time of the Flintbit in milliseconds
      end
      @user_message = "Shell script executed"
    else
      @log.info("File does not exist")
      @user_message = "File does not exist"
    end

    # SSH Connector Response Meta Parameters
    response_exitcode = response.exitcode       # Exit status code
    response_message = response.message         # Execution status messages

    # SSH Connector Response Parameters
    response_body = response.get('result')      # Response Body

    if response_exitcode == 0
        @log.info("Success in executing SSH Connector, where exitcode :: #{response_exitcode} | message :: #{response_message}")
        @log.info("Command executed :: #{@command} | Command execution results :: #{response_body}")
        @output.set('result', response_body).set('user_message',@user_message)
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
