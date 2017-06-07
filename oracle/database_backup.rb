@log.trace("Started executing 'flint-mmc:oracle:database_backup.rb' flintbit...")
begin
    @connector_name = @input.get('connector_name')
    if @connector_name.nil?
        @connector_name = @config.global('oracle.linux.connector_name')
    end
    @backup_script_path = @config.global('oracle.linux.backup_script_path')
    @oracle_username = @config.global('oracle.linux.oracle_username')
    @target = @input.get('target')
    @type = 'shell'
    @username = @config.global('oracle.oracle_server_username')
    @password = @config.global('oracle.oracle_server_password')
    @backup_type = @input.get('backup_type').downcase
    @db_name = @input.get('database_name')
    @command = "nohup sh #{@backup_script_path}backup_#{@db_name}_#{@backup_type}.sh &"
    @log.info("-----Command------: #{@command}")
    
    @log.info("Initiating Backup..")
    connector_call = @call.connector(@connector_name)
                               .set("target",@target)
                               .set("type",@type)
                               .set("username",@username)
                               .set("password",@password)
                               .set("command",@command2)
                               .set("timeout",2400000)
                               
    if @request_timeout.nil? || @request_timeout.is_a?(String)
    @log.trace("Calling #{@connector_name} with default timeout...")
        response = connector_call.sync
    else
    @log.trace("Calling #{@connector_name} with given timeout #{@request_timeout.to_s}...")
        response = connector_call.timeout(@request_timeout).sync
    end

    #SSH Connector Response Meta Parameters
    response_exitcode=response.exitcode           #Exit status code
    response_message=response.message            #Execution status message

    if response.exitcode == 0
        @log.info("Backup saved successfully in /u01/app/oracle/fast_recovery_area/XE/backupset/")
        @log.info("SUCCESS in executing #{@connector_name} where, exitcode :: #{response_exitcode} | 
                                                    message ::  #{response_message}")

        @output.set("exit-code",response_exitcode).set("message",response_message)
    else
        @log.error("ERROR in executing #{@connector_name} where, exitcode :: #{response_exitcode} | 
                                                            message ::  #{response_message}")
        @output.set('exit-code', 1).set('message', response_message)
    end

rescue Exception => e
    @log.error(e.message)
    @output.set('exit-code', 1).set('message', e.message)
end 
@log.trace("Finished executing 'flint-mmc:oracle:database_backup.rb' flintbit...")
