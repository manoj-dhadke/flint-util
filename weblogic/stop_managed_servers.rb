@log.trace("Started executing flint-mmc:weblogic:stop_managed_servers.rb' flintbit...")
begin
    @app_name = @input.get("application_name")
    @environment = @input.get("environment")
    @connector_name = @input.get('connector_name')
    if @connector_name.nil?
        @connector_name = @config.global("weblogic.#{@app_name}.connector_name")
    end
    @weblogic_domain = @config.global("weblogic.#{@app_name}.domain")       
    @target = @config.global("weblogic.#{@app_name}.target_managed_server")
    @username = @config.global("weblogic.#{@app_name}.username_managed_server")
    @password = @config.global("weblogic.#{@app_name}.password_managed_server")
    @request_timeout = @config.global("weblogic.#{@app_name}.request_timeout")
        
    @command1 = "ls"
    @command1 = "ls"
    @command = [@command1, @command2]

    connector_call=@call.connector(@connector_name)
                        .set("type", "shell")
                        .set("target",@target)
                        .set("username",@username)
                        .set("password",@password)
                        .set("command",@command)

    if @request_timeout.nil? || @request_timeout.is_a?(String)
    @log.trace("Calling #{@connector_name} with default timeout...")
        response = connector_call.sync
    else
    @log.trace("Calling #{@connector_name} with given timeout #{@request_timeout.to_s}...")
        response = connector_call.timeout(@request_timeout).sync
    end
    
    #SSH Connector Response Meta Parameters
    response_exitcode=response.exitcode           #Exit status code
    response_message=response.message             #Execution status message
    
    result=response.get("result") 
    @log.info("----Result stop managed servers---::: #{result}")
    if response.exitcode == 0
        @log.info("SUCCESS in executing #{@connector_name} where, exitcode :: #{response_exitcode} | 
                                                    message ::  #{response_message}")
        @output.set("exit-code",response_exitcode).set("message",response_message)
        @log.info("Successfully stopped managed servers")
        user_message = """## Successfully stopped managed servers"""
        @output.set('user_message', user_message)
    else
        @log.error("ERROR in executing #{@connector_name} where, exitcode :: #{response_exitcode} | 
                                                            message ::  #{response_message}")
        @output.set('exit-code', 1).set('message', response_message)
        @log.info("Failed to stop managed servers")
        user_message = """## Failed to stop managed servers"""
        @output.set('user_message', user_message)
    end

rescue Exception => e
    @log.error(e.message)
    @output.set('exit-code', 1).set('message', e.message)
    @log.info("There is an issue while stopping managed servers")
    user_message = """## There is an issue while stopping managed servers"""
    @output.set('user_message', user_message)
end
@log.trace("Finished executing 'flint-mmc:weblogic:stop_managed_servers.rb' flintbit...")