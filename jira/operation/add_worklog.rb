@log.trace("Started execution of 'flint-util:jira:operation:add_worklog.rb' flntbit..")
begin
    # Flintbit input parameters
    @connector_name = @input.get('connector_name')
    @action = 'add-worklog'                       # Action of jira connector
    @comment = @input.get('comment')              # Comment body on jira issue ticket
    @issue_id = @input.get('issue-id')            # Issue ID of jira
    @new_estimate = @input.get('new_estimate')
    @adjust_estimate = @input.get('adjust_estimate')
    @time_spend = @input.get('time_spend')
    @start_time = @input.get('start_time')
    @reduce_by = @input.get('reduce_by')
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
                    .set('started', @start_time)
                    .set('timeSpent', @time_spend)
                    .set('adjust-estimate', @adjust_estimate)
                    .set('new-estimate', @new_estimate)
                    .set("reduce-by", @reduce_by)
                    .sync

    # Jira Connector Response Parameters
    response_result = response.get('body') # Response Body

    # Jira Connector Response Meta Parameters
    response_exitcode = response.exitcode     # Exit status code
    response_message = response.message       # Execution status message

    if response_exitcode == 0
        @log.info("Successfully added worklog over an service request #{@issue_id}")
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
