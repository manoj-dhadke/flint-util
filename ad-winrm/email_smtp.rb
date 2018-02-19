# begin
@log.info('Started execution of SMTP script !!')

@log.trace("Started execution of 'smtp' flintbit..." + @input.raw.to_s)
begin
	# Flintbit Input Parameters
	input_type = @input.type
	# this input parameters are not used

	if input_type == 'application/xml' # Input type of Request
		# All mandatory if jdbc_url not provided
		@connector_name = @input.get('/connector_name/text()') # Name of the SMTP Connector
		@target = @input.get('/target/text()') # Target for smtp
		@from = @input.get('/from/text()') # Mail adress of sender
		@user_name = @input.get('/user_name/text()')           # User name of sender
		@password = @input.get('/password/text()')             # Password of sender
		@to = @input.get('/to/text()') # Mail address of reciver
		@cc = @input.get('/cc/text()') # cc
		@bcc = @input.get('/bcc/text()') # bcc
		@subject = @input.get('/subject/text()') # Subject line of mail
		@body = @input.get('/body/text()') #Body of mail
		@attachments = @input.get('/attachments/text()') #Attachments add to mail
	else
		# All mandatory if jdbc_url not provided
		@connector_name = @input.get('connector_name') # Name of the SMTP Connector
		@target = @input.get('target') # Target for smtp
		@from = @input.get('from') # Mail adress of sender
		@user_name = @input.get('username')           # User name of sender
		@password = @input.get('password')             # Password of sender
		@to = @input.get('to') # Mail address of reciver
		@cc = @input.get('cc') # cc
		@bcc = @input.get('bcc') # bcc
		@subject = @input.get('subject') # Subject line of mail
		@body = @input.get('body') #Body of mail
		@attachments = @input.get('attachments') #Attachments add to mail

	end
	@log.trace('Calling SMTP Connector...')
	# @log.info("CONNECTOR NAME "+@connector_name.to_s)
	# @log.info("Target "+@target.to_s)
	# @log.info("FROM "+@from.to_s)
	# @log.info("USERNAME "+@user_name.to_s)
	# @log.info("password "+@password.to_s)
	# @log.info("TO "+@to.to_s)

	response = @call.connector(@connector_name)
                    .set('target', @target)
                    .set('from', @from)
                    .set('username', @user_name)
                    .set('password', @password)
                    .set('to', @to)
                    .set('subject', @subject)
                    .set('body', @body)
                    .set('action', 'send')
                    .set("content-type", "text/html")
                    .set('port', 587)
                    .set('timeout', 600000)
                    .sync

	# SMTP Connector Response Meta Parameters
	response_exitcode = response.exitcode     # Exit status code
	response_message = response.message       # Execution status message

	# SMTP Connector Response Parameters
	result = response.get('result') # Response Body

	if response.exitcode == 0
		@log.info("Success in executing SMTP Connector where, exitcode :: #{response_exitcode} | message ::  #{response_message}")
		@log.info("SMTP Response Body ::#{response_message}")
		@output.set('result', response_message).set('exit-code', 0)
	else
		@log.error("Failure in executing SMTP Connector where, exitcode :: #{response_exitcode} | message ::  #{response_message}")
		@log.error('Failed')
		@output.set('result', response.message).set('exit-code', -1)
	end
rescue Exception => e
	@log.error(e.message)
	@output.set('exit-code', 1).set('message', e.message)
end
@log.info('Finished execution of SMTP script !!')
# end
