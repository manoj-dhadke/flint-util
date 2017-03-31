@log.trace("Started execution of 'flint-util:jenkins:hipchat_listener.rb' flintbit..")
# Getting fields from Hipchat input Json
@message = @input.get('item').get('message').get('message')
@id = @input.get('item').get('message').get('id')
@mention_name = @input.get('item').get('message').get('from').get('mention_name')
@room_name = @input.get('item').get('room').get('name')
@log.info("message:: #{@message} | id :#{@id} |mention_name: #{@mention_name}| room_name: #{@room_name}")
@builds = @config.global("hipchat_jenkins.#{@room_name}.builds")
@build_operation =  @config.global("hipchat_jenkins.build_operation")
begin
	@log.info("Message::#{@message}")
	if @message.start_with?("#{@build_operation} deploy")
		@body = '{"color":"green","message":"Hello @' + @mention_name + ',I have started deploying the build.You will get an email notification once the deployment is complete","notify":true,"message_format":"text"}'
		@call.bit('flint-util:jenkins:add_message.rb').set('body', @body).sync

		@build_name=   @message.gsub! "#{@build_operation} deploy",''
		@build_name_removedspace= @build_name.strip

		@concatenate_command =  "#{@build_operation} deploy" + @build_name


		if !@concatenate_command.nil?
			if !@build_name_removedspace.nil? && !@build_name_removedspace.empty?

				#if "#{@builds.include?(@build_name)}"
				if (@builds.include?(@build_name_removedspace))
					@log.info('Calling Flintbit to perform jenkins build Operation')
					response_startbuild = @call.bit('flint-util:jenkins:start_build.rb')
                    .set('id', @id)
                    .set('mention_name', @mention_name)
                    .set('build_name', @build_name_removedspace)
                    .sync

					#@replymessage = response_startbuild.get("reply_message")
					#@log.info("response_status!! #{@replymessage }")
					#body = '{"color":"green","message":"' + @replymessage + '","notify":true,"message_format":"text"}'
					#@call.bit('flint-util:jenkins:add_message.rb').set('body', body).sync
				else
					reply_message = 'Hello @' + @mention_name + ",Build-name not present in the Hipchat Room #{@room_name}, Please provide valid build name" '\n' 'Usage: /build deploy [buildname]'
					body = '{"color":"green","message":"' + reply_message + '","notify":true,"message_format":"text"}'
					@call.bit('flint-util:jenkins:add_message.rb').set('body', body).sync
				end
			else
				reply_message = 'Hello @' + @mention_name + ', Build name not provided, Please provide build name,''\n' 'Usage: /build deploy [buildname]'
				body = '{"color":"green","message":"' + reply_message + '","notify":true,"message_format":"text"}'
				@call.bit('flint-util:jenkins:add_message.rb').set('body', body).sync
			end
		else
			reply_message = 'Hello @' + @mention_name + ',Command not provided, Please provide valid Command,''\n' 'Usage: /build deploy [buildname]'
			body = '{"color":"green","message":"' + reply_message + '","notify":true,"message_format":"text"}'
			@call.bit('flint-util:jenkins:add_message.rb').set('body', body).sync
		end

	elsif @message.start_with?("#{@build_operation} status")
		@body = '{"color":"green","message":"Hello @' + @mention_name + ',I have started processing your request","notify":true,"message_format":"text"}'
		@call.bit('flint-util:jenkins:add_message.rb').set('body', @body).sync
		@build_name=   @message.gsub! "#{@build_operation} status",''
		@build_name_removedspace= @build_name.strip
		@concatenate_command =  "#{@build_operation} status" + @build_name

		if !@concatenate_command.nil?
			if !@build_name_removedspace.nil? && !@build_name_removedspace.empty?

				#if "#{@builds.include?(@build_name)}"
				if (@builds.include?(@build_name_removedspace))

					@log.info('Calling Flintbit to get jenkins build status')
					response_status =	@call.bit('flint-util:jenkins:status_build.rb')
                                    .set('id', @id)
                                    .set('mention_name', @mention_name)
                                    .set('build_name', @build_name_removedspace)
                                    .sync

					@replymessage = response_status.get("reply_message")

					body = '{"color":"green","message":"' + @replymessage + '","notify":true,"message_format":"text"}'
					@call.bit('flint-util:jenkins:add_message.rb').set('body', body).sync


				else
					reply_message = 'Hello @' + @mention_name + ",Build-name not present in the Hipchat Room #{@room_name}, Please provide valid build name" '\n' 'Usage: /build status [buildname]'
					body = '{"color":"green","message":"' + reply_message + '","notify":true,"message_format":"text"}'
					@call.bit('flint-util:jenkins:add_message.rb').set('body', body).sync
				end
			else
				reply_message = 'Hello @' + @mention_name + ', Build name not provided, Please provide build name,''\n' 'Usage: /build status [buildname]'
				body = '{"color":"green","message":"' + reply_message + '","notify":true,"message_format":"text"}'
				@call.bit('flint-util:jenkins:add_message.rb').set('body', body).sync
			end
		else
			reply_message = 'Hello @' + @mention_name + ',Command not provided, Please provide valid Command,''\n' 'Usage: /build status [buildname]'
			body = '{"color":"green","message":"' + reply_message + '","notify":true,"message_format":"text"}'
			@call.bit('flint-util:jenkins:add_message.rb').set('body', body).sync
		end


	elsif @message.start_with?("#{@build_operation} lastfailed")
		@body = '{"color":"green","message":"Hello @' + @mention_name + ',I have started processing your request","notify":true,"message_format":"text"}'
		@call.bit('flint-util:jenkins:add_message.rb').set('body', @body).sync
		@build_name=   @message.gsub! "#{@build_operation} lastfailed",''
		@build_name_removedspace= @build_name.strip
		@concatenate_command =  "#{@build_operation} lastfailed" + @build_name
		if !@concatenate_command.nil?
			if !@build_name_removedspace.nil? && !@build_name_removedspace.empty?

				#if "#{@builds.include?(@build_name)}"
				if (@builds.include?(@build_name_removedspace))
					@log.info('Calling Flintbit to get jenkins lastfailed build')
					response_lastfailed= @call.bit('flint-util:jenkins:lastfailed_build.rb')
                          .set('id', @id)
                          .set('mention_name', @mention_name)
                          .set('build_name', @build_name_removedspace)
                          .sync

					@replymessage = response_lastfailed.get("reply_message")

					body = '{"color":"green","message":"' + @replymessage + '","notify":true,"message_format":"text"}'
					@call.bit('flint-util:jenkins:add_message.rb').set('body', body).sync

				else
					reply_message = 'Hello @' + @mention_name + ",Build-name not present in the Hipchat Room #{@room_name}, Please provide valid build name" '\n' 'Usage: /build lastfailed [buildname]'
					body = '{"color":"green","message":"' + reply_message + '","notify":true,"message_format":"text"}'
					@call.bit('flint-util:jenkins:add_message.rb').set('body', body).sync
				end
			else
				reply_message = 'Hello @' + @mention_name + ', Build name not provided, Please provide build name,''\n' 'Usage: /build lastfailed [buildname]'
				body = '{"color":"green","message":"' + reply_message + '","notify":true,"message_format":"text"}'
				@call.bit('flint-util:jenkins:add_message.rb').set('body', body).sync
			end
		else
			reply_message = 'Hello @' + @mention_name + ',Command not provided, Please provide valid Command,''\n' 'Usage: /build lastfailed [buildname]'
			body = '{"color":"green","message":"' + reply_message + '","notify":true,"message_format":"text"}'
			@call.bit('flint-util:jenkins:add_message.rb').set('body', body).sync
		end
	else
		reply_message = 'Hello @' + @mention_name + ',Please provide valid command :''\n' 'Usage:  /build deploy [buildname] ''\n' '/build status [buildname] ''\n' '/build lastfailed [buildname]'
		body = '{"color":"green","message":"' + reply_message + '","notify":true,"message_format":"text"}'
		@call.bit('flint-util:jenkins:add_message.rb').set('body', body).sync

	end
rescue Exception => e
	@log.error(e.message)
	@output.set('exit-code', 1).set('message', e.message)
	reply_message = 'Hello @' + @mention_name + 'Something went wrong, please try again ' + e.message.to_s
	@body = '{"color":"green","message":"' + reply_message + '","notify":true,"message_format":"text"}'
	@call.bit('flint-util:jenkins:add_message.rb').set('body', @body).sync
end
@log.trace("Started execution of 'flint-util:jenkins:hipchat_listener.rb' flintbit..")
