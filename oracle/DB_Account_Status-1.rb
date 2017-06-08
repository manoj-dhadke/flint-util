# begin
@log.trace("Started execution of 'select' flintbit...")
# Flintbit Input Parameters
begin
	input_type = @input.type
	# this input parameters are not used

	if input_type == 'application/xml' # Input type of Request
		@connector_name = @input.get('/connector_name/text()')
		# All mandatory if jdbc_url not provided
		@connector_name = @input.get('/connector_name/text()')  # Name of the JDBC Connector
		@jdbc_url = @input.get('/jdbc_url/text()')              # JDBC Url
		@query = @input.get('/query/text()')                    # Query of the Database
		@driver = @input.get('/driver/text()')                  # Jdbc driver name for database
	else
		# All mandatory if jdbc_url not provided
		@connector_name = @input.get('connector_name')          # Name of the JDBC Connector
		@oracle_target_ip = @input.get('oracle_target_ip')                      # JDBC Url
		@database_name = @input.get('database_name')
		@query = @input.get('query')                            # Query of the Database
		@driver = @input.get('driver')
		@uname = @input.get('username').upcase
		@pass = @input.get('new_password')
		@admin_username = @config.global("oracle.dba_username")
		@admin_password = @config.global("oracle.dba_password")
		@jdbc_url = @config.global("oracle.jdbc_url")             # It gives value for path field from config_name
		@jdbc_url = @jdbc_url << "@" << @oracle_target_ip << "/" << @database_name
		@log.info("jdbcurl::#{@jdbc_url}")
		@connector_name = @config.global("oracle.connector_name") # Jdbc driver name for database
	end

	@connector_name = 'jdbc' if @connector_name.nil? || @connector_name.empty?
	@jdbc_url = @path if @jdbc_url.nil? || @jdbc_url.empty?
	@query = "select username, account_status from dba_users where username='#{@uname}'" if @query.nil? || @query.empty?
	@driver = 'oracle.jdbc.driver.OracleDriver' if @driver.nil? || @driver.empty?

	@log.info("Flintbit input parameters are, connector name :: #{@connector_name} | jdbc_url :: #{@jdbc_url} |
    driver :: #{@driver} | query :: #{@query}")

	@log.trace('Calling JDBC Connector...')

	response = @call.connector(@connector_name)
                    .set('action', 'select')
                    .set('username',@admin_username)
                    .set('password',@admin_password)
                    .set('query', @query)
                    .set('jdbc-url', @jdbc_url)
                    .set('name', @uname)
                    .set('driver', @driver).sync
	@log.info("------#{response}")

	# JDBC Connector Response Meta Parameters
	response_exitcode = response.exitcode # Exit status code
	response_message = response.message   # Execution status message

	# JDBC Connector Response Parameters
		result = response.get('result')       # Response Body
	#    @log.info("Result::#{result.size}")
	@log.info("Response::#{response.class}")
	#response=response.to_s
	if response.nil?
		@log.info"==========11111111111111111"
	elsif !result.nil? && result.size != 0
		result.each do |account_status|
			@log.info("#{account_status}")
			@acc = account_status ['ACCOUNT_STATUS']
			#@log.info("22222#{@acc}")
		end
		#@log.info("#{result.class}")
		#status = result.get('ACCOUNT_STATUS')
		#@log.info("111111#{status}")
		if (@acc.include? 'EXPIRED & LOCKED') || (@acc.include? 'LOCKED') || (@acc.include? 'EXPIRED')
			#@log.info("3333 we are in status")
			@log.info("Calling Account_unlock flintbit")
			account_unlock = @call.bit('flint-mmc:oracle:DB_Account_Unlock.rb')
                              .set('name',@uname)
                              .set('jdbc-url', @jdbc_url)
                              .sync
			#@log.info("$$$$$#{account_unlock}")
			if account_unlock.exitcode == 0

				@log.info("Now the  user account has been unlocked")
				@user_message_account_unlock = "Now the  user account has been unlocked"
				#@log.info("#{account_unlock}")
			else
				@log.error("Failure in executing Account unlock flintbit where, exitcode :: #{account_unlock.exitcode} | message ::  #{account_unlock.message}")
				@log.trace("Finished executing 'Account_unlock' flintbit with error...")
				@user_message_account_unlock = "Failure in Account unlock"
			end
		end
		result.each do |account_unlock|
			@log.info("#{account_unlock}")
			#@log.info("22222#{@acc}")
		end

		if (@acc.include? 'EXPIRED & LOCKED') || (@acc.include? 'LOCKED') || (@acc.include? 'EXPIRED')
			#@log.info("4444 we are in password")
			reset_password = @call.bit('flint-mmc:oracle:DB_Reset_Password.rb')
                              .set('name',@uname)
                              .set('pass',@pass)
                              .set('jdbc-url', @jdbc_url)
                              .sync
			#@log.info("$$$$$#{reset_password}")
			if reset_password.exitcode == 0

				@log.info("The user password has been reset now")
				@user_message_account_reset = "The user password has been reset"
				#@log.info("#{reset_password}")
			else
				@log.error("Failure in executing Password reset flintbit where, exitcode :: #{reset_password.exitcode} | message ::  #{reset_password.message}")
				@log.trace("Finished executing Password reset flintbit with error...")
				@user_message_account_reset = "Failed to reset the user password"
			end
		end
	else
		@log.error("Invalid parameters provided from input")
	end
	#result = result.to_s


	if response.exitcode == 0
		@log.info("Success in executing JDBC Connector where, exitcode :: #{response_exitcode} | message ::  #{response_message}")
		@log.info("HTTP Response Body :: #{result}")
		@user_message = """ Action details :
* #{@user_message_account_unlock }
* #{@user_message_account_reset }"""
		@output.set('result', result.to_s).set('user_message',@user_message)
	else
		@log.info("response_message::: #{response_message}")
		if response_message.include? 'Listener refused the connection' 
			@log.error("Database name specified is incorrect")
		elsif response_message.include? 'Io exception: Unknown host specified' 
			@log.error("The target/hostname specified is incorrect")
		else
			@log.error("Invalid parameters provided from input")
		end
		@log.error("Failure in executing JDBC Connector where, exitcode >>>>> :: #{response_exitcode} | message ::  #{response_message}")
		@user_message = "#Failed in getting user account status"
		@output.set('error', response_message).set('user_message',@user_message)
		@log.trace("Finished executing 'select' flintbit with error...")
	end
rescue Exception => e
	@log.error(e.message)
	@output.set('exit-code', 1).set('message', e.message)
end
@log.trace("Finished execution of account_status flintbit")
# end

