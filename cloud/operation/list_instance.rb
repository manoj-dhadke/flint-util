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
@log.trace("Started executing 'flint-util:cloud:operation:list_instance.rb' flintbit...")
begin
     # Flintbit Input Parameters
     # Mandatory
     @connector_name = @input.get('connector_name') # Name of the Cloud Connector
     @action = @input.get('action') # Action
     # optional
     @key = @input.get('key')                        # Key
     @secret = @input.get('secret')                  # Secret
     @cloud = @input.get('cloud')                    # Cloud
     @request_timeout = @input.get('timeout')        # timeout

     @log.info("Flintbit input parameters are, connector name :: #{@connector_name} |
     	                                       action ::        #{@action}|
                                                id ::            #{@id}|
                                                key ::           #{@key}|
                                                secret ::        #{@secret}|
                                                cloud ::         #{@cloud}|
                                                timeout ::       #{@request_timeout}")

     connector_call = @call.connector(@connector_name)
                           .set('action', @action)
                           .set('key', @key)
                           .set('cloud', @cloud)
                           .set('secret', @secret)

     if @request_timeout.nil? || @request_timeout.is_a?(String)
         @log.trace("Calling #{@connector_name} with default timeout...")
         response = connector_call.sync
     else
         @log.trace("Calling #{@connector_name} with given timeout #{request_timeout}...")
         response = connector_call.timeout(@request_timeout).sync
     end

     # Cloud Connector Response Meta Parameters
     response_exitcode = response.exitcode           # Exit status code
     response_message = response.message             # Execution status message

     # Cloud Connector Response Parameters
     result = response.get('list-instance') # Response body

     if response.exitcode == 0
         result.each do |instance_id|
             @log.info("#{@connector_name} Instance  id : #{instance_id.get('id')} |
           						  Provider id :  #{instance_id.get('provider-id')}
           					         Location :  #{instance_id.get('location')}")
         end
         @log.info("SUCCESS in executing cloud Connector where, exitcode :: #{response_exitcode} | message ::  #{response_message}")
         @log.info("HTTP Response Body :: #{result}")
         # @output.set("result",result.to_s)
         # @log.info("----response---"+response.to_s)
         @output.setraw('info', response.to_s)
     else
         @log.error("ERROR in executing cloud Connector where, exitcode :: #{response_exitcode} | message ::  #{response_message}")
         @output.exit(1, response_message)
     end
     @log.trace("FINISHED executing 'flint-util:jcloud:operation:list_instance.rb' flintbit...")
 rescue Exception => e
     @log.error(e.message)
     @output.set('exit-code', 1).set('message', e.message)
 end
# end
