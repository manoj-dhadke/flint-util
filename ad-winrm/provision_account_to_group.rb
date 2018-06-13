@log.trace("Started executing 'flint-util:ad-winrm:provision_account.rb' flintbit...")
begin

	@first_name = @input.get('first-name')
	@last_name = @input.get('last-name')
	@login_name = @input.get('login-name')
	@initial = @input.get('initial')
	@employee_id = @input.get('emp-id')
	@password = @input.get('password')
	@group_name = @input.get('group-name')
	@target = @input.get('target')
	@username = @input.get('username')
	@target_password = @input.get('target_password')
	@full_name = "'" + @first_name + ' ' + @last_name + "'"
	@user_principal_name = @login_name + '@infiverve.com'
	@command ="Import-module activedirectory;New-ADUser -Name #{@full_name} -GivenName #{@first_name} -Surname #{@last_name} -Initials #{@initial} -SamAccountName #{@login_name} -UserPrincipalName #{@user_principal_name} -EmployeeID #{@employee_id} -AccountPassword (ConvertTo-SecureString -AsPlainText  #{@password}  -Force) -PassThru | ConvertTo-Json"
	if @target.nil?
		raise "Please provide 'target/IP' to connect with machine"
	end
	# check for username present in global config.
	if @username.nil?
		raise "Please provide 'username' to connect with machine"
	end
	# check for Password present in global config.
	if @target_password.nil?
		raise "Please provide 'password' to connect with machine"
	end
	#secureString = convertto-securestring "Password" -asplaintext -force
	# Call flintbit synchronously and set arguments
	flintbit_response = @call.bit('flint-util:ad-winrm:winrm_commonconnect.rb')
                             .set('command', @command)
                             .set("target", @target)
                             .set("username", @username)
                             .set("password", @target_password)
                             .sync
	success_message = flintbit_response.message
	@result= flintbit_response.get("result")
	@error_message= flintbit_response.get("error")
	#@newusername = flintbit_response.get("result").get("Name")

	if flintbit_response.get("exit-code") == 0
		@log.info("Success in executing WinRM Connector!!!!!!!!!, where exitcode :: #{flintbit_response.get("exit-code")} | message :: #{success_message}  |||| #{flintbit_response.class}")
		@log.info("Command executed :: #{@command} | Command execution results :: #{@result}")
		#if success_message == "success"
		@command = "Import-module activedirectory;Enable-ADAccount #{@login_name}"
		flintbit_response1 = @call.bit('flint-util:ad-winrm:winrm_commonconnect.rb')
		                     .set('command', @command)
                         .set("target", @target)
                         .set("username", @username)
                         .set("password", @target_password)
		                     .sync
		if flintbit_response1.get("exit-code") == 0
			@log.info('Success in executing command of Enable-ADAccount')
			@message_from_enableaction = "Active Directory user account is now enabled"
			@result = @util.json(@result)
			@name = @result.get('GivenName').to_s
			@surname = @result.get('Surname').to_s
			@userPrincipalName = @result.get('UserPrincipalName').to_s
			@samAccountName = @result.get('SamAccountName').to_s
			@distinguishedName = @result.get('DistinguishedName').to_s
			@fullName = @result.get('Name').to_s
			@objectguid = @result.get('ObjectGuid').to_s
		else
			@log.error('Error in executing command of Enable-ADAccount')
			@log.error 'Account provision operation unsuccessful'
			@message_from_enableaction = "Failed to enable Active Directory user account"
		end
		@command = "Import-module activedirectory;Set-ADUser #{@login_name} -changepasswordatlogon 1"
		flintbit_response1 = @call.bit('flint-util:ad-winrm:winrm_commonconnect.rb')
					     .set('command', @command)
               .set("target", @target)
               .set("username", @username)
               .set("password", @target_password)
					     .sync
		if flintbit_response1.get("exit-code") == 0
			flintbit_add_to_group = @call.bit('flint-util:ad-winrm:add_user_to_group.rb')
                                   .set('member-login-name', @login_name)
                                   .set('group-name',@group_name)
                                   .set("target", @target)
                                   .set("username", @username)
                                   .set("password", @target_password)
                                   .sync
			if flintbit_add_to_group.get("exit-code") == 0
				@log.info("Successfully added the user to AD group: #{@group_name}")
			else
				@log.error("Error in executing command to add user to AD group: #{@group_name}")
			end
			@log.info('Success in executing command of change password at first login')
			@message_from_firstlogin = "You can now change the default password at your first login"
		else
			@log.error('Error in executing command of change password at first login')
			@message_from_firstlogin = "Please login with default password"
		end
		#else
		#    raise 'Account provision operation unsuccessful'
		#
		#end
		@message_from_provision = "Active directory user account is created successfully"
		@user_message = """ Action details :
* #{@message_from_provision}
* #{@message_from_enableaction}
* #{@message_from_firstlogin}

User Details :
* Name : #{@name}
* Surname : #{@surname}
* User Principal Name : #{@userPrincipalName}
* Enabled : True
* Sam Account Name : #{@samAccountName}
* Distinguished Name : #{@distinguishedName}
* Full Name : #{@fullName}
* ObjectGUID : #{@objectguid}
* User with login-name: #{@login_name} added to Group : #{@group_name} """
		@log.info(">>>> #{@user_message} >>>>>>")
		@output.set('result', @result.to_s).set('user_message',@user_message).set('exit-code', 0)
	else
		@a = @error_message.split(/At line/).first
		@user_message = """**Error:**
#{@a.rstrip}"""
		@output.set('error', @new_error_msg).set('exit-code', -1).set('user_message',@user_message)
		#raise 'Account provision operation unsuccessful'
	end
rescue => e
	@log.error(e.message)
	@user_message = """**Failed to create user account !** """
	@output.set('message', e.message).set('exit-code', -1).set('user_message',@user_message)
	@log.info('output in exception')
	@output.exit(1,e.message)
end
@log.trace("Finished executing 'flint-util:ad-winrm:provision_account.rb' flintbit")
