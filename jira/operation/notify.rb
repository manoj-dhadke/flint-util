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

@log.trace("Started execution of 'flint-util:jira:operation:notify.rb' flntbit..")
begin
    # Flintbit input parameters
    @connector_name = @input.get('connector_name')
    @action = 'notify' # Action of jira connector
    @issue_id = @input.get('issue-id')
    @body = @input.get('body')
    @subject = @input.get('subject')
    @reporter = @input.get('reporter')
    if @reporter.is_a?(String)
      if @reporter == 'true'
        @reporter = true
      else
        @reporter = false
      end
    end
    @assignee = @input.get('assignee')
    if @assignee.is_a?(String)
      if @assignee == 'true'
        @assignee = true
      else
        @assignee = false
      end
    end
    @watcher = @input.get('watcher')
    if @watcher.is_a?(String)
      if @watcher == 'true'
        @watcher = true
      else
        @watcher = false
      end
    end
    @voters = @input.get('voters')
    if @voters.is_a?(String)
      if @voters == 'true'
        @voters = true
      else
        @voters = false
      end
    end

    response = @call.connector(@connector_name)
                    .set('action', @action)
                    .set('issue-id', @issue_id)
                    .set('body', @body)
                    .set('subject', @subject)
                    .set('reporter', @reporter)
                    .set('assignee', @assignee)
                    .set('watcher', @watcher)
                    .set('voters', @voters)
                    .sync

    # Jira Connector Response Parameters
    response_result = response.get('body') # Response Body

    # Jira Connector Response Meta Parameters
    response_exitcode = response.exitcode     # Exit status code
    response_message = response.message       # Execution status message

    if response_exitcode == 0
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
@log.trace("Finished execution of 'flint-util:jira:operation:add_worklog.rb' flntbit..")
