@log.trace("Started executing 'flint-util:ad-winrm:reset_password.rb' flintbit...")
begin
    @logon_name = @input.get('login-name')
    @password = @input.get('password')
    @to =@input.get('to')
    #@command = "powershell -command dsmod user 'CN=#{@full_name},CN=Users,DC=infiverve,DC=com' -pwd '#{@password}' "
    @command = "Set-ADAccountPassword -Identity "+@logon_name.to_s+" -Reset -NewPassword (ConvertTo-SecureString -AsPlainText "+@password.to_s+" -Force)"
    # Call flintbit synchronously and set arguments
    flintbit_response = @call.bit('flint-util:ad-winrm:winrm_commonconnect.rb')
                             .set('command', @command)
                             .sync
success_message = flintbit_response.message
result= flintbit_response.get("result")
error_message= flintbit_response.get("error")

if flintbit_response.get("exit-code") == 0
@log.info("Success in executing WinRM Connector!!!!!!!!!, where exitcode :: #{flintbit_response.get("exit-code")} | message :: #{success_message}")
    @log.info("Command executed :: #{@command} | Command execution results :: #{result}")
    @log.info("Account lock operation successful")
    @output.set('result', result)
    @log.trace("Finished executing 'winrm' flintbit with success...")
    @message_from_reset = "Password for User: '#{@logon_name}' has been reset successfully"
        @command = "powershell -command Set-ADUser #{@logon_name} -changepasswordatlogon 1"
        flintbit_response1 = @call.bit('flint-util:ad-winrm:winrm_commonconnect.rb')
                             .set('command', @command)
                             .sync
		if flintbit_response1.get('exit-code') == 0
      @body = "AD account password for logon name #{@logon_name} reset successfully. The new password of the AD account is: #{@password}"
      @twilio_response =  @call.bit('flint-twilio:sms:send.rb')
                               .set('message', @body)
                               .set('to',@to)
                               .sync
        @log.info("Twilio response: #{@twilio_response}")
        if @twilio_response.get('exit-code') == 0
          @log.info("Successfully send SMS to the user")
        else
          @log.error("Failed to send SMS to the user")
        end
		    @log.info('Success in executing command of change password at first login')
		    @message_from_firstlogin = "You can now change the default password at your first login"
		    #@output.message(0,"Account Password Reset operation successful")
		else
		    @log.error('Error in executing command of change password at first login')
		    @message_from_firstlogin = "Please login with default password"
		    #raise "Account Password Reset operation unsuccessful"
        	end
	@user_message = """ Action details :
* #{@message_from_reset}
* #{@message_from_firstlogin} """
@output.set('result',result).set('user_message',@user_message)
else
@a = error_message.split(/At line/).first
@user_message = """**Error:**
#{@a.rstrip}"""
#@error_msg = error_message[/[^\:]+/]
#@user_message = @error_msg.gsub(/^At line/, '')
#@log.info("ERROR in executing command of change password at first login #{@new_error_msg}")
	#   @user_message = """**Error : #{@user_message} **"""
@output.set('error', error_message).set('exit-code', -1).set('user_message',@user_message)

#raise "Account Password Reset operation unsuccessful"
end
rescue => e
    @log.error(e.message)
    @user_message = """**Failed to reset password !** """
    @output.set('message', e.message).set('exit-code', -1).set('user_message',@user_message)
    @log.info('output in exception')
    @output.exit(1,e.message)
end
@log.trace("Finished executing 'flint-util:ad-winrm:reset_password.rb' flintbit")
