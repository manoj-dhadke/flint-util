@log.trace("Started executing flint-mmc:weblogic:clear_managed_server1.rb' flintbit...")
begin
    @app_name = @input.get("application_name")
    @environment = @input.get("environment")
    @connector_name = @input.get('connector_name')
    if @connector_name.nil?
        @connector_name = @config.global("weblogic.#{@app_name}.connector_name")
    end
    @weblogic_domain = @config.global("weblogic.#{@app_name}.domain")    
    @target = @config.global("weblogic.#{@app_name}.target_server1")
    @username = @config.global("weblogic.#{@app_name}.username_server1")
    @password = @config.global("weblogic.#{@app_name}.password_server1")
    @request_timeout = @config.global("weblogic.#{@app_name}.request_timeout")
        
    @command = "ls /web/bea_apps/domains/#{@weblogic_domain}/servers/PRLWEB01/stage /web/bea_apps/domains/#{@weblogic_domain}/servers/PRLWEB01/tmp"

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
    @log.info("----Result clear Stage and temp directories on server 1---::: #{result}")
    if response.exitcode == 0
        @log.info("SUCCESS in executing #{@connector_name} where, exitcode :: #{response_exitcode} | 
                                                    message ::  #{response_message}")
        @output.set("exit-code",response_exitcode).set("message",response_message)
        @log.info("Stage and temp directories cleared successfully on server 1")
        user_message = """## Stage and temp directories cleared successfully on server 1"""
        @output.set('user_message', user_message)
    else
        @log.error("ERROR in executing #{@connector_name} where, exitcode :: #{response_exitcode} | 
                                                            message ::  #{response_message}")
        @output.set('exit-code', 1).set('message', response_message)
        @log.info("Failed to clear Stage and temp directories on server 1")
        user_message = """## Failed to clear Stage and temp directories on server 1"""
        @output.set('user_message', user_message)
    end

rescue Exception => e
    @log.error(e.message)
    @output.set('exit-code', 1).set('message', e.message)
    @log.info("There is an issue while clearing Stage and temp directories on server 1")
    user_message = """## There is an issue while clearing Stage and temp directories on server 1"""
    @output.set('user_message', user_message)
end
@log.trace("Finished executing 'flint-mmc:weblogic:clear_managed_server1.rb' flintbit...")