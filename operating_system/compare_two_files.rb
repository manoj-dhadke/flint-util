# begin
@log.trace("Started executing 'flint-util:Operating_system:compare_two_files.rb' flintbit...")
begin
    # Flintbit Input Parameters
    @connector_name = @config.global('ssh_serviceaide_linux.connector_name')  # Name of the SSH Connector
    @target = @input.get('target')                  # Target machine where the command will be executed
    #@type = @input.get('type')                      # Type of execution - shell or exec
    @username = @input.get('username')              # Target username
    @password = @input.get('password')              # Target password
    # @passphrase=@input.get("passphrase")          #Passphrase to be used
    #@key_file = @input.get('key-file')              # SSH Key-file placed in "/flint-dist/gridconfig/keystore"
    @file_one= @input.get('File_one')
   @log.info("First File::#{@file_one}")
    @file_two= @input.get('File_two')
   @log.info("Second File::#{@file_two}")
    @command = "md5sum #{@file_one} #{@file_two}"              #Commands to be executed
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
#@log.info("*************************#{response.get('result')}")
   token=[]
    key= response.get('result').split(" ")
    #@log.info("*************************#{response.get('result')}")
    #@log.info("*************************#{key.class}")
  key.each do |key|
    string= key.start_with?("/")or key.start_with?(" /")
   if string==false
   token.push(key)
    #@log.info("*************************#{token[0]}")
    @token_one=token[0]
    @token_two=token[1]
   #@log.info("*****55555********************#{@token_two}")
   end
  end
   @log.info("Token for first file::#{@token_one}")
   @log.info("Token for second file::#{@token_two}")
   equal= @token_one==@token_two
   @log.info("Are the files equal::#{equal}")
   if equal==false
   @log.info("files are not equal")
   @user_message="Files are not equal"
   else
   @log.info("files are equal")
   @user_message="Files are equal"
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
