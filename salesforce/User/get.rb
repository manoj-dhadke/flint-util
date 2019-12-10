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
@log.trace("Started executing 'SalesForce:get.rb' flintbit...")
begin
    # Flintbit Input Parameters
    @connector_name = @input.get('connector_name') # Name of the Salesforce Connector
    if @connector_name.nil?
        @connector_name = 'salesforce'
    end
    @action = 'get-record'                     # Contains the name of the operation: list
    @sobject = 'User'
    @request_id = @input.get('id')

    @log.info("Flintbit input parameters are, connector name :: #{@connector_name} |action :: #{@action}| sobject :: #{@sobject}")

          response = @call.connector(@connector_name)
                          .set('action', @action)
                          .set('sobject', @sobject)
                          .set('id', @request_id)
                          .sync

    # Salesforce Connector Response Meta Parameters
    response_exitcode = response.exitcode           # Exit status code
    response_message = response.message             # Execution status message

    # Salesforce Connector Response Parameters
    response_body = response.get('body')            # Response body
    @log.info("#{response_body}")
    if response_exitcode == 0  
    
        @log.info("Success in executing SalesForce Connector, where exitcode :: #{response_exitcode} | message :: #{response_message}")
        @output.setraw('result', response_body)
        @log.trace("Finished executing 'SalesForce' flintbit with success...")
    else
        @log.error("Failure in executing SalesForce Connector where, exitcode :: #{response_exitcode} | message :: #{response_message}")
        @output.set('error', response_message)
        @log.trace("Finished executing 'SalesForce' flintbit with error...")
    end
rescue Exception => e
    @log.error(e.message)
    @output.set('exit-code', 1).set('message', e.message)
end
@log.trace("Finished executing 'SalesForce:get.rb' flintbit...")
# end
