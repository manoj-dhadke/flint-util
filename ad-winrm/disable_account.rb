=begin
##########################################################################
#
#  INFIVERVE TECHNOLOGIES PTE LIMITED CONFIDENTIAL
#  __________________
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

@log.trace("Started executing 'flint-util:ad-winrm:disable_account.rb' flintbit...")
begin
	@login_name = @input.get('login-name')
	@target = @input.get('target')
	@username = @input.get('username')
	@password = @input.get('password')
	@command = "Import-module activedirectory;Disable-adAccount #{@login_name}"

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
		@user_message = """**Account with username : '#{@login_name}' is disabled successfully**"""
		@log.info("Account Disable operation successful:::: usermessage :::: #{@user_message}")
		@output.set('result', result).set('user_message',@user_message)
		@log.trace("Finished executing 'winrm' flintbit with success...")
	else
		#@new_error = @error_message[/[^\d]+/]
		#@error_msg = @new_error.gsub(/^At line\:/, '')
		#@user_message = """**Error: #{@error_msg}**"""
		@a = @error_message.split(/At line/).first
		@user_message = """**Error:**
#{@a.rstrip}"""
		@log.error("Failure in executing WinRM Connector where, exitcode :: #{flintbit_response.get("exit-code")} | message :: #{@error_message} | for user :: #{@user_message}")
		@output.set('error', @error_message).set('user_message',@user_message)
		@log.trace("Finished executing 'winrm' flintbit with error...")
	end
rescue => e
	@log.error(e.message)
	@user_message = """**Failed to disable user account !** """
	@output.set('message', e.message).set('exit-code', -1).set('user_message',@user_message)
	@log.info('output in exception')
	@output.exit(1,e.message)
end
@log.trace("Finished executing 'flint-util:ad-winrm:disable_account.rb' flintbit")
