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

@log.trace("Started executing 'flint-util:ad-winrm:list_locked_account.rb' flintbit...")
begin
    @command = "Import-module activedirectory;Search-ADAccount –LockedOut| select name|Convertto-json"
    @target_smtp = @config.global('send-server-info-email-details').get('target')
    @username_smtp = @config.global('send-server-info-email-details').get('username')
    @password_smtp =@config.global('send-server-info-email-details').get('password')
    @to = @input.get('to')
    @target = @input.get('target')
    @username = @input.get('username')
    @password = @input.get('password')
    @from = @config.global('send-server-info-email-details').get('from')
    @subject =@config.global('send-server-info-email-details').get('subject')
    @connector_name_smtp = @config.global('send-server-info-email-details').get('connector_name')

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
@result= flintbit_response.get("result")
@error_message= flintbit_response.get("error")
@log.info("Result::#{@result}")

if flintbit_response.get("exit-code") == 0
  if @result.empty? || @result.nil?
  @log.info("No lockedout account found in AD")
  @user_message = "No lockedout accounts found in AD"
  @output.set('user_message',@user_message)
  else
    @result = @result.gsub("[", '').gsub("]",'').gsub("{",'').gsub("}",'')
    @log.info("Result::#{@result}")
    @log.info("Success in executing WinRM Connector, where exitcode :: #{flintbit_response.get("exit-code")} | message :: #{success_message}")
    @log.trace("Finished executing 'winrm' flintbit with success...")
    @body_email = "<br> The following accounts are locked in AD <br>
                    <br> #{@result} <br>
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
    @user_message = """**Successfully performed the operation to get locked user account list and email sent successfully on : #{@to} **"""
    @log.info("User account names of the locked out accounts is :#{@result}")
    @output.set('result', @result).set('user_message',@user_message)
  else
  @log.info("Failed to send email on email-id : #{@to}")
end
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
