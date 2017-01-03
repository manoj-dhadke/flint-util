@log.trace("Started execution of 'flint-util:jira:operation:delete_comment.rb' flntbit..")
begin
    # Getting input parameters
    @connector_name = @input.get('connector_name')
    @issue_id = @input.get('issue-id')       # Id of issue in Jira
    @comment_id = @input.get('comment-id')   # Id of comment on issue
    @action = 'delete-comment'               # Action of jira connector
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
                    .set('comment-id', @comment_id.to_i)
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
        @log.info("Success in executing #{@connector_name} connector, where exitcode : " + response_exitcode.to_s + ' | message : ' + response_message)
        @output.set('exit-code', 0).set('message', 'success')
    else
        @log.error("Failure in executing  #{@connector_name} connector, where exitcode : " + response_exitcode.to_s + ' | message : ' + response_message)
        @output.set('exit-code', 1).set('message', response_message)
    end
rescue Exception => e
    @log.error(e.message)
    @output.set('exit-code', 1).set('message', e.message)
end
@log.trace("Finished execution of 'flint-util:jira:operation:delete_comment.rb' flntbit..")
