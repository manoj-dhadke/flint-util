# begin
@log.trace("Started executing 'flint-util:operation:add_request11.rb' flintbit...")
begin
    # Flintbit Input Parameters
    @connector_name = @input.get('connector_name')        # Name of the ManageEngine Connector
    @action = 'add-request'                               # Action to be perform 
    @requester = @input.get('requester')                  # Name of the Requester
    @subject = @input.get('subject')                      # Subject to add the Request
    @description = @input.get('description')              # Description for the Request made
    @requesttemplate=@input.get("requesttemplate")        # Templete for the Request
    @requestType = @input.get('requestType')              # Type of the Request
    @priority = @input.get('priority')                    # Priority of the Request
    @group = @input.get('group')                          # Request belongs to the group
    @technician = @input.get('technician')                # Name of the Technician assign to
    @level = @input.get('level')                          # Level of the Request 
    @status = @input.get('status')                        # Status of the added Request      
    @service = @input.get('service')                      # Service area for Request

    @log.info("Flintbit input parameters are, connector name :: #{@connector_name} | action :: #{@action} | requester :: #{@requester} |
    requesttemplate :: #{@requesttemplate} | requestType :: #{@requestType} | priority :: #{@priority} | group :: #{@group} | technician :: #{@technician}| 
    level :: #{@level} | status :: #{@status} | service :: #{@service} ")

    @log.trace('Calling ManageEngine Connector...')

    response = @call.connector(@connector_name)
                .set('action', @action)
                .set('requester', @requester)
                .set('subject', @subject)
                .set('description', @description)
                .set('requesttemplate', @requesttemplate)
                .set('requestType', @requestType)
                .set('priority', @priority)
                .set('site', '-')
                .set('group', @group)
                .set('technician', @technician)
                .set('level', @level)
                .set('status', @status)
                .set('service', @service)
                .timeout(10000)
                .sync

    # ManageEngine Connector Response Meta Parameters
    response_exitcode = response.exitcode       # Exit status code
    response_message = response.message         # Execution status messages

    # ManageEngine Connector Response Parameters
    response_body = response      # Response Body

    if response_exitcode == 0
        @log.info("Success in executing ManageEngine Connector, where exitcode :: #{response_exitcode} | message :: #{response_message}")
        @output.setraw('result', response_body.to_s)
        @log.trace("Finished executing 'add_request11' flintbit with success...")
    else
        @log.error("Failure in executing ManageEngine Connector where, exitcode :: #{response_exitcode} | message :: #{response_message}")
        @output.set('error', response_message)
        @log.trace("Finished executing 'add_request11' flintbit with error...")
    end
rescue Exception => e
    @log.error(e.message)
    @output.set('exit-code', 1).set('message', e.message)
end
# end
