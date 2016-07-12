@log.trace("Started execution of 'flint-util:jira:operation:add_comment.rb' flntbit..")
begin
    # Flintbit input parameters
    @connector_name = @input.get('connector_name')
    @action = 'add-comment'                       # Action of jira connector
    @body = @input.get('body')                    # Comment body on jira issue ticket
    @issue_id = @input.get('issue-id')            # Issue ID of jira
    @use_proxy = @input.get('use_proxy')
    @proxy = @input.get('proxy')

    response = @call.connector(@connector_name)
                    .set('action', @action)
                    .set('comment', @body)
                    .set('issue-id', @issue_id)
                    .set('use-proxy', @use_proxy)
                    .set('proxy', @proxy)
                    .timeout(30000)
                    .sync

    # Jira Connector Response Parameters
    response_result = response.get('body')    # Response Body

    # Jira Connector Response Meta Parameters
    response_exitcode = response.exitcode     # Exit status code
    response_message = response.message       # Execution status message

    if response_exitcode == 0
        @log.info("Successfully added comment over an service request #{@issue_id}")
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
@log.trace("Finished execution of 'flint-util:jira:operation:add_comment.rb' flntbit..")
