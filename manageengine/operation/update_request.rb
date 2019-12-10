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

# begin
@log.trace("Started executing 'flint-util:operation:update-request.rb' flintbit...")
begin
    # Flintbit Input Parameters
    @connector_name = @input.get('connector_name')  # Name of the Manage Engine Connector
    @action = 'update-request'                      # update-request be executed
    @requestid = @input.get('requestid')            # Request-id of request
    @requester = @input.get('requester')            # Name of requester
    @subject = @input.get('subject')                # Subject of the request
    @description = @input.get('description')        # Description of the request
    @requesttemplate = @input.get('requesttemplate')# Template of the request
    @priority = @input.get('priority')              # Priority for the request
    @group = @input.get('group')                    # Group to which the request belongs
    @technician = @input.get('technician')          # Technician assigned to the request
    @level = @input.get('level')                    # Level of the request
    @status = @input.get('status')                  #Status of the request
    @service = @input.get('service')                #Service category to which the request belongs


    @log.info("Flintbit input parameters are, connector name :: #{@connector_name} | action :: #{@action} | requestid :: #{@requestid} |
    requester :: #{@requester} | description :: #{@description} | priority :: #{@priority} | group :: #{@group} | technician :: #{@technician}|
    level ::#{@level} | status :: #{@status} | service :: #{@service} ")

    @log.trace('Calling manageenginesdp Connector...')

        response = @call.connector(@connector_name)
                        .set("action", @action)
                        .set("request-id", @requestid)
                        .set("requester", @requester)
                        .set("subject", @subject)
                        .set("description", @description)
                        .set("requesttemplate", @requesttemplate)
                        .set("priority", @priority)
                        .set("site", "-")
                        .set("group", @group)
                        .set("technician", @technician)
                        .set("level", @level)
                        .set("status", @status)
                        .set("service",@service)
                        .timeout(10000)
                        .sync

    response_exitcode = response.exitcode       # Exit status code
    response_message = response.message         # Execution status messages

    response_body = response      # Response Body

    if response_exitcode == 0
        @log.info("Success in executing manageenginesdp Connector, where exitcode :: #{response_exitcode} | message :: #{response_message}")
        @log.info("Command executed :: #{@command} | Command execution results :: #{response_body}")
        @output.setraw('result', response_body.to_s)
        @log.trace("Finished executing 'manageenginesdp' flintbit with success...")
    else
        @log.error("Failure in executing manageenginesdp Connector where, exitcode :: #{response_exitcode} | message :: #{response_message}")
        @output.set('error', response_message)
        @log.trace("Finished executing 'manageenginesdp' flintbit with error...")
    end
rescue Exception => e
    @log.error(e.message)
    @output.set('exit-code', 1).set('message', e.message)
end
# end
