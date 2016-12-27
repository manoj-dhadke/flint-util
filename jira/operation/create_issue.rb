@log.trace("Started execution of 'flint-util:jira:operation:create_issue.rb' flntbit..")
begin
    # Flintbit input parameters
    @connector_name = @input.get('connector_name')
    @action = 'create-issue' # Action of jira connector
    @summary = @input.get('summary')
    @description = @input.get('description')
    @issuetype = @input.get('issuetype')
    @priority =  @input.get('priority')
    @components = @input.get('components')
    @labels = @input.get('labels')
    @duedate = @input.get('duedate')
    @reporter = @input.get('reporter')
    @assignee = @input.get('assignee')
    @custom_field = @input.get('custom-field')

    response = @call.connector(@connector_name)
                    .set('action', @action)
                    .set('summary', @summary)
                    .set('description', @description)
                    .set('issuetype', @issuetype)
                    .set('priority', @priority)
                    .set('components', @components)
                    .set('labels', @labels)
                    .set('duedate', @duedate)
                    .set('reporter', @reporter)
                    .set('assignee', @assignee)
                    .set('custom-field', @custom_field)
                    .sync

    # Jira Connector Response Parameters
    ticket_content = response.get('body') # Response Result, ticket information from jira servicedesk.

    # Jira Connector Response Meta Parameters
    response_exitcode = response.exitcode     # Exit status code
    response_message = response.message       # Execution status message

    if response_exitcode == 0
        issue_id = ticket_content["key"]
        @log.info("Successfully created jira issue #{issue_id}")
        @log.info("Success in executing #{@connector_name} connector, where exitcode : " + response_exitcode.to_s + ' | message : ' + response_message)
        @output.set('exit-code', 0).set('message', 'success').set('result', ticket_content.to_s)
    else
        @log.error("Failure in executing  #{@connector_name} connector, where exitcode : " + response_exitcode.to_s + ' | message : ' + response_message)
        @output.set('exit-code', 1).set('message', response_message)
    end
rescue Exception => e
    @log.error(e.message)
    @output.set('exit-code', 1).set('message', e.message)
end
@log.trace("Finished execution of 'flint-util:jira:operation:create_issue.rb' flntbit..")
