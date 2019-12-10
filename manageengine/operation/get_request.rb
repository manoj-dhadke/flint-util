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

@log.trace("Started executing 'flint-util:operation:update-request.rb' flintbit...")
begin
              # Flintbit Input Parameters
              @connector_name = @input.get('connector_name')  # Name of the Manage Engine Connector
              @action = 'get-request'                         # get-request be executed
              @requestid = @input.get('requestid')            # Request-id of request

              @log.info("Flintbit input parameters are, connector name :: #{@connector_name} | action :: #{@action} | requestid :: #{@requestid} ")

              @log.trace('Calling manageenginesdp Connector...')

              response = @call.connector(@connector_name)
                              .set('action', @action)
                              .set('request-id', @requestid)
                              .sync

              response_exitcode = response.exitcode # Exit status code
              response_message = response.message # Execution status messages

              # ManageEngineSDP Connector Response Parameters
              response_body = response # Response Body

              if response_exitcode == 0
                  @log.info("Success in executing ManageEngineSDP Connector, where exitcode :: #{response_exitcode} | message :: #{response_message}")
                  @output.setraw('result', response_body.to_s)
                  @log.trace("Finished executing 'manageenginesdp' flintbit with success...")
              else
                  @log.error("Failure in executing ManageEngineSDP Connector where, exitcode :: #{response_exitcode} | message :: #{response_message}")
                  @output.set('error', response_message)
                  @log.trace("Finished executing 'manageenginesdp' flintbit with error...")
                           end
          rescue Exception => e
              @log.error(e.message)
              @output.set('exit-code', 1).set('message', e.message)
          end
# end
