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
    @connector_name_one = @config.global('ssh_serviceaide_linux.connector_name')  # Name of the SSH Connector
    @connector_name_two = @config.global('ssh_serviceaide_linux.connector_name')
    @target_one = @input.get('target_one')
    @log.info("target one:: #{@target_one}")
    @target_two = @input.get('target_two')                  # Target machine where the command will be executed
    #@type = @input.get('type')                      # Type of execution - shell or exec
    @username_one = @input.get('username_one')              # Target username
    @username_two = @input.get('username_two')
    @password_one = @input.get('password_one')              # Target password
    # @passphrase=@input.get("passphrase")          #Passphrase to be used
     @password_two = @input.get('password_two')
    #@key_file = @input.get('key-file')              # SSH Key-file placed in "/flint-dist/gridconfig/keystore"
    #@file= @input.get('File')
    @file_one= @input.get('File_one')
    @log.info("First File::#{@file_one}")
    @file_two= @input.get('File_two')
    @log.info("Second File::#{@file_two}")
    @command_one = "md5sum #{@file_one} "                 #Commands to be executed
    @command_two = "md5sum #{@file_two}"  
    #@command_main="sudo sh #{@file} start"
    #@timeout = @input.get('timeout')                # Timeout in milliseconds, taken by
    #@type = @input.get('type')                      # the Connetor to serve the request

    @log.info("Flintbit input parameters are, connector name :: #{@connector_name_one} | target :: #{@target_one}  |
    username :: #{@username_one} | password :: #{@password_one} | command  :: #{@command_one}")

@log.info("Flintbit input parameters are, connector name :: #{@connector_name_two} | target :: #{@target_two}  |
    username :: #{@username_one} | password :: #{@password_two} | command  :: #{@command_two}")


           if @target_one.nil?
                raise "Please provide 'hostname'"
            end
            # check for username present in global config.
            if @username_one.nil?
                raise "Please provide 'username'"
            end
            # check for Password present in global config.
            if @password_one.nil?
                raise "Please provide 'password'"
            end

    
    @log.trace('Calling SSH Connector...')
    if @timeout.to_s.empty?
        response_one = @call.connector(@connector_name_one)
                        .set('target', @target_one)
                        .set('type', @type)
                        .set('username', @username_one)
                        .set('password', @password_one)
                        .set('command', @command_one)
                        .set('type', @type)
                        .sync
    # .timeout(10000) # Execution time of the Flintbit in milliseconds
    else
        response_one = @call.connector(@connector_name_one)
                        .set('target', @target_one)
                        .set('type', @type)
                        .set('username', @username_one)
                        .set('password', @password_one)
                        .set('command', @command_one)
                        .set('type', @type)
                        .sync
        # .timeout(10000) # Execution time of the Flintbit in milliseconds
    end
    
if @target_two.nil?
                raise "Please provide 'hostname'"
            end
            # check for username present in global config.
            if @username_two.nil?
                raise "Please provide 'username'"
            end
            # check for Password present in global config.
            if @password_two.nil?
                raise "Please provide 'password'"
            end

    
    @log.trace('Calling SSH Connector...')
    if @timeout.to_s.empty?
        response_two = @call.connector(@connector_name_two)
                        .set('target', @target_two)
                        .set('type', @type)
                        .set('username', @username_two)
                        .set('password', @password_two)
                        .set('command', @command_two)
                        .set('type', @type)
                        .sync
    # .timeout(10000) # Execution time of the Flintbit in milliseconds
    else
        response_two = @call.connector(@connector_name_two)
                        .set('target', @target_two)
                        .set('type', @type)
                        .set('username', @username_two)
                        .set('password', @password_two)
                        .set('command', @command_two)
                        .set('type', @type)
                        .sync
        # .timeout(10000) # Execution time of the Flintbit in milliseconds
    end

    # SSH Connector Response Meta Parameters
    response_one_exitcode = response_one.exitcode       # Exit status code
    response_one_message = response_one.message         # Execution status messages
    response_two_exitcode = response_two.exitcode       # Exit status code
    response_two_message = response_two.message         # Execution status messages
    # SSH Connector Response Parameters
    response_one_body = response_one.get('result')      # Response Body
    @log.info("response :: #{response_one_body}")
    response_two_body = response_two.get('result')      # Response Body
    @log.info(" Server one file::#{response_one_body}")
    @log.info(" Server two file::#{response_two_body}")
    key_one=response_one_body.split(" ")
    key_two=response_two_body.split(" ")
    equal=key_one[0]==key_two[0]
    @log.info("Are the files equal :#{equal}")
    if equal==true
    @log.info("Configuration files are equal")
    @user_message="Configuration files are equal"
    else
    @log.info(" Configuration files are not equal")
    @user_message="Configuration files are not equal"
    end


    if response_one_exitcode == 0
        @log.info("Success in executing SSH Connector, where exitcode :: #{response_one_exitcode} | message :: #{response_one_message}")
        @log.info("Command executed :: #{@command_one} | Command execution results :: #{response_one_body}")
        @output.set('result', response_one_body).set('user_message',@user_message)
        @log.trace("Finished executing 'ssh' flintbit with success...")
    else
        @log.error("Failure in executing SSH Connector where, exitcode :: #{response_one_exitcode} | message :: #{response_one_message}")
        @output.set('error', response_one_message)
        @log.trace("Finished executing 'ssh' flintbit with error...")
    end
if response_two_exitcode == 0
        @log.info("Success in executing SSH Connector, where exitcode :: #{response_two_exitcode} | message :: #{response_two_message}")
        @log.info("Command executed :: #{@command_two} | Command execution results :: #{response_two_body}")
        @output.set('result', response_two_body).set('user_message',@user_message)
        @log.trace("Finished executing 'ssh' flintbit with success...")
    else
        @log.error("Failure in executing SSH Connector where, exitcode :: #{response_two_exitcode} | message :: #{response_two_message}")
        @output.set('error', response_two_message)
        @log.trace("Finished executing 'ssh' flintbit with error...")
    end
rescue Exception => e
    @log.error(e.message)
    @output.set('exit-code', 1).set('message', e.message)
end
# end
