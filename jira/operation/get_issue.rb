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

@log.trace("Started execution of 'flint-util:jira:operation:get_issue.rb' flntbit..")
begin
    # Getting input parameters
    @connector_name = @input.get('connector_name')
    @issue_id = @input.get('issue-id')       # Id of issue in Jira
    @action = 'get-issue'                # Action of jira connector
    @use_proxy = @input.get('use-proxy')
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
                    .set('issue-id', @issue_id)
                    .set('use-proxy', @use_proxy)
                    .set('proxy', @proxy)
                    .timeout(30000)
                    .sync

    # Jira Connector Response Parameters
    response_result = response.get('body') # Response Body
    # Jira Connector Response Meta Parameters
    response_exitcode = response.exitcode     # Exit status code
    response_message = response.message       # Execution status message

    if response_exitcode == 0
        @log.info("Success in executing #{@connector_name} connector, where exitcode : " + response_exitcode.to_s + ' | message : ' + response_message)
        @log.info("response ::" +response_result.to_s)
        res = {}
        res["id"] = response_result["id"]
        res["key"] = response_result["key"] 
        res["project_name"] = response_result["fields"]["project"]["name"]
        res["discription"] = response_result["fields"]["description"]
        res["created"] = response_result["fields"]["created"]
        res["priority"] = response_result["fields"]["priority"]["id"]
        res["assignee"] = response_result["fields"]["assignee"]["name"]
        @log.info("Output :: #{res}")  
        @output.set("result", "#{res}")
    else
        @log.error("Failure in executing  #{@connector_name} connector, where exitcode : " + response_exitcode.to_s + ' | message : ' + response_message)
        @output.set('exit-code', 1).set('message', response_message)
    end
rescue Exception => e
    @log.error(e.message)
    @output.set('exit-code', 1).set('message', e.message)
end
@log.trace("Finished execution of 'flint-util:jira:operation:delete_issue.rb' flntbit..")
