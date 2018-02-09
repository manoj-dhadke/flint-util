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
    @directory= @input.get('Directory')
    @file=@input.get('File')
    @command =  "[ -d #{@directory} ] && echo 'Directory exist' || echo 'Directory does not exist'"              #Commands to be executed
    @command_check_file= "[ -f #{@file} ] && echo 'File exist' || echo 'File does not exist'"
    #@timeout = @input.get('timeout')                # Timeout in milliseconds, taken by
    #@type = @input.get('type')                      # the Connetor to serve the request
     @target_smtp = @config.global('smtp_file_create_approval').get('target')
     @username_smtp = @config.global('smtp_file_create_approval').get('username')
     @password_smtp =@config.global('smtp_file_create_approval').get('password')
     @to = @config.global('smtp_file_create_approval').get('to')
     @from = @config.global('smtp_file_create_approval').get('from')
     @subject =@config.global('smtp_file_create_approval').get('subject')
     @connector_name_smtp = @config.global('smtp_file_create_approval').get('connector_name')
     @body="Hello, Please provide the approval to create file with path #{@file} as the same does not exists"


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
                        .set('username', @username)
                        .set('password', @password)
                        .set('command', @command)
                        .sync
    # .timeout(10000) # Execution time of the Flintbit in milliseconds
    @log.info("Flintbit input parameters are, connector name :: #{@connector_name} | target :: #{@target}  |
    username :: #{@username} | password :: #{@password} | command  :: #{@command}")
    @log.info("Whether directory exists or not: #{response}")
    else
        response = @call.connector(@connector_name)
                        .set('target', @target)
                        .set('username', @username)
                        .set('password', @password)
                        .set('command', @command)
                        .sync
        # .timeout(10000) # Execution time of the Flintbit in milliseconds
    end
    @log.info("Whether directory exists or not: {response}")
    if (response.get('result').include? 'Directory exist')
                if @timeout.to_s.empty?
                response_file = @call.connector(@connector_name)
                        .set('target', @target)
                        .set('username', @username)
                        .set('password', @password)
                        .set('command', @command_check_file)
                        .sync
                # .timeout(10000) # Execution time of the Flintbit in milliseconds
                @log.info("Flintbit input parameters are, connector name :: #{@connector_name} | target :: #{@target}  |
                username :: #{@username} | password :: #{@password} | command  :: #{@command_check_file}")
                @log.info("Whether File exists or not:{response_file}")
                else
                response_file = @call.connector(@connector_name)
                        .set('target', @target)
                        .set('username', @username)
                        .set('password', @password)
                        .set('command', @command_check_file)
                        .sync
               # .timeout(10000) # Execution time of the Flintbit in milliseconds
               @log.info("Whether File exists or not:{response_file}")
               end
             @log.info("Whether File exists or not:{response_file.get('result')}")
       if(response_file.get('result').include? 'File does not exist')
        @log.info("Mail send to get approval as file does nit exists")
              response_smtp = @call.connector(@connector_name_smtp)
                    .set('target', @target_smtp)
                    .set('from', @from)
                    .set('username', @username_smtp)
                    .set('password', @password_smtp)
                    .set('to', @to)
                    .set('subject', @subject)
                    .set('body', @body)
                    .set('action', 'send')
                    .set("content-type", "text/html")
                    .set('port', 587)
                    .set('timeout', 600000)
                    .sync

       @log.info("Mail send successfully: #{response_smtp}")

       else
       @log.info("File already exist")
       @user_message = "File already exist"
       end
    
    else
    @log.info("Directory does not exist")
    @user_message = "Directory does not exist"
    end

    # SSH Connector Response Meta Parameters
    response_exitcode = response.exitcode       # Exit status code
    response_message = response.message         # Execution status messages

    # SSH Connector Response Parameters
    response_body = response.get('result')      # Response Body

    if response_exitcode == 0
        @log.info("Success in executing SSH Connector, where exitcode :: #{response_exitcode} | message :: #{response_message}")
        @log.info("Command executed :: #{@command_check_file} | Command execution results :: #{response_body}")
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
