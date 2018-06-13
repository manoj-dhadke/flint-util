@log.trace("Started executing 'flint-util:ad-winrm:create_group.rb' flintbit...")
begin
	@group_name = @input.get('group-name')
	@sam_account_name= @input.get('SamAccountName')
	@path= @input.get('path')
	@target = @input.get('target')
	@username = @input.get('username')
	@password = @input.get('password')
	@path= @path.gsub(' ', ',')
	@description= @input.get('group-description')
	@command = "Import-module activedirectory;New-ADGroup -Name '#{@group_name}' -SamAccountName #{@sam_account_name} -GroupCategory Security -GroupScope Global -DisplayName '#{@group_name}' -Path '#{@path}' -Description '#{@description}'"
	@log.info("Command:: #{@command}")
	if @target.nil?
		raise "Please provide 'target/IP' to connect with machine"
	end
	# check for username present in global config.
	if @username.nil?
		raise "Please provide 'username' to connect with machine"
	end
	# check for Password present in global config.
	if @password.nil?
		raise "Please provide 'password' to connect with machine"
	end
	# Call flintbit synchronously and set arguments
	flintbit_response = @call.bit('flint-util:ad-winrm:winrm_commonconnect.rb')
                             .set('command', @command)
                             .set("target", @target)
                             .set("username", @username)
                             .set("password", @password)
                             .sync

	success_message = flintbit_response.message
	result= flintbit_response.get("result")
	@error_message= flintbit_response.get("error")

	if flintbit_response.get("exit-code") == 0
		@log.info("Success in executing WinRM Connector, where exitcode :: #{flintbit_response.get("exit-code")} | message :: #{success_message}")
		@log.info("Command executed :: #{@command} | Command execution results :: #{result}")
		@user_message = """**AD Group with group-name :'#{@group_name}' is created successfully**"""
		@log.info("*AD Group creation operation successful    ::user_message:: #{@user_message}")
		@output.set('result', result).set('user_message',@user_message)
		@log.trace("Finished executing 'winrm' flintbit with success...")
	else
		@log.error("Failure in executing WinRM Connector where, exitcode :: #{flintbit_response.get("exit-code")} | message :: #{@error_message}")
		@log.error("AD Group creation operation unsuccessful")
		#@new_error = @error_message[/[^\d]+/]
		#@error_msg = @new_error.gsub(/^At line\:/, '')
		#@error_msgs = @error_msg.gsub(/\'/,'')
		#@user_message = """**Error:#{@error_msgs}**"""
		@a = @error_message.split(/At line/).first
		@user_message = """**Error:**
#{@a.rstrip}"""
		@log.error("Failure in executing WinRM Connector where, exitcode :: #{flintbit_response.get("exit-code")} | message :: #{@error_message} | for user :: #{@user_message}")
		@output.set('error', @error_message).set('user_message',@user_message)
		@log.trace("Finished executing 'winrm' flintbit with error...")
	end
rescue => e
	@log.error(e.message)
	@user_message = """**Failed to create New Group in AD !** """
	@output.set('message', e.message).set('exit-code', -1).set('user_message',@user_message)
	@log.info('output in exception')
	@output.exit(1,e.message)
end
@log.trace("Finished executing 'flint-util:ad-winrm:create_group.rb' flintbit")
