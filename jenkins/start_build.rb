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

require 'json'
begin
	@log.trace("Started execution of 'flint-util:jenkins:start_build.rb'flintbit..")
	@jenkins_username = @config.global("jenkins_build.username") # Username of the jenkins user
	@jenkins_api_token= @config.global("jenkins_build.apitoken") #Api token of Jenkins
	@jenkins_host= @config.global("jenkins_build.jenkins_host")  #Jenkins host URL
	@crumburl = @config.global("jenkins_build.crumb_url")
	@id = @input.get('id')
	@mention_name = @input.get('mention_name')          # Name of chat tool user
	@build_name = @input.get('build_name')

	if @build_name.include? " "
		@build_url = @jenkins_host << @build_name.gsub!(" ", "%20") << "/build"
		@build_name.gsub!("%20", " ")
	else
		@build_url = @jenkins_host << @build_name << "/build"
	end

	@concatenate_string = @jenkins_username << ":" << @jenkins_api_token

	@encoded_string = @util.encode64(@concatenate_string)

	@concatenate_authorization = "Basic" << " " << @encoded_string

	response_crumb=@call.connector("http")
              .set("method", "GET")
              .set("url",@crumburl)
              .set("headers","Authorization:#{@concatenate_authorization}")
              .set("body","abc")
              .set("timeout",300000)
              .sync

	@exitcode = response_crumb.exitcode
	@crum_message = response_crumb.message


	response_crumb_body=response_crumb.get("body")
	response_body1 =@util.json(response_crumb_body)         #Response Body

	@crumb = response_body1.get("crumb")
	@log.info("crumb::: #{@crumb}")

	if @exitcode == 0
		response_build=@call.connector("http")
              .set("method", "POST")
              .set("url",@build_url)
              .set("headers",["Authorization:#{@concatenate_authorization}","Jenkins-Crumb:#{@crumb}"])
              .set("body","abc")
              .set("timeout",300000)
              .sync

		response_body2= response_build.get("body")
		response_message = response_build.message	# Execution status messages

	else
		@log.error("message : #{@crum_message}")
	end
	@build_exitcode = response_build.exitcode
	@build_message = response_build.message

	if @build_exitcode == 0
		@reply_message = 'Hello @' + @mention_name + ',The build request for ' + @build_name + ' is complete.'
		@output.set("reply_message",@reply_message)
	else
		@reply_message = 'Hello @' + @mention_name + ', Build Failed for ' + @build_name + ": #{response_build.get('error')}"
		@output.set("reply_message",@reply_message)
	end

rescue Exception => e
	@log.error(e.message)
	@reply_message = 'Hello @' + @mention_name + ', Build Failed: ' + @build_name + ' due to ' + e.message + ''
	@output.set('exit-code', 1).set('message', e.message).set("reply_message",@reply_message)
end
@log.trace("Finished execution of 'flint-util:jenkins:start_build.rb'flintbit..")
