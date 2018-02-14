@log.trace("Started executing 'flint-util:ad-winrm:list_locked_account.rb' flintbit...")
begin
    @command = "Search-ADAccount –LockedOut| select name"
    @target_smtp = @config.global('send-server-info-email-details').get('target')
    @username_smtp = @config.global('send-server-info-email-details').get('username')
    @password_smtp =@config.global('send-server-info-email-details').get('password')
    @to = @input.get('to')
    @from = @config.global('send-server-info-email-details').get('from')
    @subject =@config.global('send-server-info-email-details').get('subject')
    @connector_name_smtp = @config.global('send-server-info-email-details').get('connector_name')
    # Call flintbit synchronously and set arguments
    flintbit_response = @call.bit('flint-util:ad-winrm:winrm_commonconnect.rb')
                             .set('command', @command)
                             .sync

success_message = flintbit_response.message
@result= flintbit_response.get("result")
@error_message= flintbit_response.get("error")
@log.info("Result::#{@result}")
if flintbit_response.get("exit-code") == 0
@log.info("Success in executing WinRM Connector, where exitcode :: #{flintbit_response.get("exit-code")} | message :: #{success_message}")
    @user_message = """**User account names of the locked out accounts is :#{@result}  **"""
    @log.info("User account names of the locked out accounts is :#{@result}")
    @output.set('result', @result).set('user_message',@user_message)
    @log.trace("Finished executing 'winrm' flintbit with success...")
    @body_email = "The following accounts are locked in AD \n
                    #{@result}
                    Please unlock the AD accounts"
    email_flintbit_response = @call.bit('flint-util:ad-winrm:email_smtp.rb')
                                       .set('connector_name',@connector_name_smtp)
                                       .set('target',@target_smtp)
                                       .set('username',@username_smtp )
                                       .set('password',@password_smtp )
                                       .set('to',@to)
                                       .set('from',@from)
                                       .set('subject',@subject)
                                       .set('body', @body_email)
                                       .sync

    if email_flintbit_response.get("exit-code") == 0
    @log.info("Email send successfully on email-id : #{@to}")
  else
  @log.info("Failed to send email on email-id : #{@to}")
end
else
    @log.error("Failure in executing WinRM Connector where, exitcode :: #{flintbit_response.get("exit-code")} | message :: #{@error_message}")
    @log.error("Failed to fetch lockedout accounts from AD...")
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
    @user_message = """**Failed to fetch lockedout accounts from AD** """
    @output.set('message', e.message).set('exit-code', -1).set('user_message',@user_message)
    @log.info('output in exception')
    @output.exit(1,e.message)
end
@log.trace("Finished executing 'flint-util:ad-winrm:list_locked_account.rb' flintbit")
