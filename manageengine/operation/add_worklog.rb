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

@log.trace("Started executing 'flint-util:operation:add-note.rb' flintbit...")
begin
              # Flintbit Input Parameters
              @connector_name = @input.get('connector_name') # Name of the Manage Engine Connector
              @action = 'add-worklog'                           # add-worklog be executed
              @associated_entity = @input.get('associated_entity')           
              @associated_entity_id = @input.get('associated_entity_id')              
              @description = @input.get('description')              
              @name = @input.get('name')

              @log.info("Flintbit input parameters are, connector name :: #{@connector_name} | action :: #{@action} | associated_entity :: #{@associated_entity}|
                associated_entity_id :: #{@associated_entity_id} | description :: #{@description} | name = #{@name} ")

              @log.trace('Calling manageenginesdp Connector...')

              response = @call.connector(@connector_name)
                              .set('action', @action)
                              .set('associated_entity', @associated_entity)
                              .set('associated_entity_id', @associated_entity_id)
                              .set('description', @description)
                              .set('name', @name)
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

