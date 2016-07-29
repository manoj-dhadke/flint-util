@log.trace("Started executing 'flint-util:operation:close-request.rb' flintbit...")
begin
              # Flintbit Input Parameters
              @connector_name = @input.get('connector_name') # Name of the Manage Engine Connector
              @action = 'close-request' # close-request be executed
              @requestid = @input.get('requestid')            # Request-id of request
              @closecomment = @input.get('closecomment')      # Comment to be added while closing request

              @log.info("Flintbit input parameters are, connector name :: #{@connector_name} | action :: #{@action} | requestid :: #{@requestid} ")

              @log.trace('Calling manageenginesdp Connector...')

              response = @call.connector(@connector_name)
                              .set('action', @action)
                              .set('request-id', @requestid)
                              .set('closecomment', @closecomment)
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
