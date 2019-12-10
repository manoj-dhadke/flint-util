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

require 'json'
begin
	@log.trace("Started execution of 'flint-util:jenkins:lastfailed_build.rb' flintbit..")
	@jenkins_username = @config.global("jenkins_build.username") # Username of the jenkins user
	@jenkins_api_token= @config.global("jenkins_build.apitoken") #Api token of Jenkins
	@jenkins_host= @config.global("jenkins_build.jenkins_host")  #Jenkins host URL
	@lastfailedBuild = @config.global("jenkins_build.last_failed_build_url")
  @crumburl = @config.global("jenkins_build.crumb_url")
  @id = @input.get('id')
  @mention_name = @input.get('mention_name')          # Name of chat tool user
  @build_name = @input.get('build_name')

	if @build_name.include? " "
		@status_url = @jenkins_host << @build_name.gsub!(" ", "%20") << @lastfailedBuild
    @build_name.gsub!("%20", " ")
	else
		@status_url = @jenkins_host << @build_name << @lastfailedBuild
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
	@log.info("crumbLastBuild::: #{@crumb}")

	if @exitcode == 0

		response_buildstatus= @call.connector("http")
              .set("method", "GET")
              .set("url",@status_url)
              .set("headers",["Authorization:#{@concatenate_authorization}","Jenkins-Crumb:#{@crumb}"])
              .set("body","abc")
              .set("timeout",300000)
              .sync
		response_body=response_buildstatus.get("body")           #Response Body
		@log.info ("response>>>: #{response_body}")
	else
		@log.error("message : #{@crum_message}")
	end
	@buildstatus_exitcode = response_buildstatus.exitcode
	@buildstatus_message = response_buildstatus.message
	responseJson = @util.json(response_body)
	@responseResult = responseJson.get('result')
	@responseFullDisplayName = responseJson.get('fullDisplayName')
	@responseUrl = responseJson.get('url')
  if @buildstatus_exitcode == 0

                @log.info("Success in getting last build status ")
                @reply_message = 'Hello @' + @mention_name + ',Last failed Build status is : '+ @responseResult + ' |Full Build-name: ' + @responseFullDisplayName + ' |Build URL: ' + @responseUrl
                @output.set("reply_message",@reply_message)
        else
                @log.info("message : #{@buildstatus_message}| There is no last failed build found for #{@build_name}")
                @reply_message =  'Hello @' + @mention_name + ', There is no last failed build found for build-name: ' + @build_name
                @output.set("reply_message",@reply_message)

        end

rescue Exception => e
	@log.error(e.message)
  @reply_message = 'Hello @' + @mention_name + ',Failed in getting build status of: ' + @build_name + ' due to ' + e.message + ''
  @output.set('exit-code', 1).set('message', e.message).set("reply_message",@reply_message)
end
@log.trace("Finished execution of 'flint-util:jenkins:lastfailed_build.rb' flintbit..")
