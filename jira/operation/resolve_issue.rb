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

@log.trace("Started execution of 'flint-util:jira:operation:resolve_issue.rb' flntbit..")
begin
    # Getting input parameters
    @connector_name = @input.get('connector_name')
    @comment = @input.get('comment')         # Comment body
    @issue_id = @input.get('issue-id')       # Id of issue in Jira
    @action = 'resolve-issue'                # Action of jira connector
    @use_proxy = @input.get('use_proxy')
    if @use_proxy.is_a?(String)
      if @use_proxy == 'true'
        @use_proxy = true
      else
        @use_proxy = false
      end
    end
    @proxy = @input.get('proxy')

    response = @call.connector(@connector_name)
                    .set('action', @action)
                    .set('comment', @comment)
                    .set('issue-id', @issue_id)
                    .set('use-proxy', @use_proxy)
                    .set('proxy', @proxy)
                    .timeout(30_000)
                    .sync

    # Jira Connector Response Parameters
    response_result = response.get('body') # Response Body
    # Jira Connector Response Meta Parameters
    response_exitcode = response.exitcode     # Exit status code
    response_message = response.message       # Execution status message

    if response_exitcode == 0
        @log.info("Successfully change status of an service request #{@issue_id}")
        @log.info("Success in executing #{@connector_name} connector, where exitcode : " + response_exitcode.to_s + ' | message : ' + response_message)
        @output.set('exit-code', 0).set('message', 'success').set('result', response_result.to_s)
    else
        @log.error("Failure in executing  #{@connector_name} connector, where exitcode : " + response_exitcode.to_s + ' | message : ' + response_message)
        @output.set('exit-code', 1).set('message', response_message)
    end
rescue Exception => e
    @log.error(e.message)
    @output.set('exit-code', 1).set('message', e.message)
end
@log.trace("Finished execution of 'flint-util:jira:operation:resolve_issue.rb' flntbit..")
