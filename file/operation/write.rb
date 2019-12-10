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
@log.trace("Started executing 'flint-util:file:operation:write.rb' flintbit...")
begin
    # Flintbit Input Parameters
    connector_name = @input.get('connector_name') # Name of the FILE Connector
    action = 'write'                              # Write Action
    file_path = @input.get('file')                # File Name and Location
    data = @input.get('data')                     # Data to be written to the File

    @log.info("Flintbit input parameters are, connector name :: #{connector_name} | action :: #{action} | file_path :: #{file_path} |
     file_content :: #{data}")

    @log.trace("Calling #{connector_name}...")
    response = @call.connector(connector_name)
                    .set('action', action)
                    .set('file', file_path)
                    .set('data', data)
                    .sync

    # File Connector Response Meta Parameters
    response_exitcode = response.exitcode # Exit status code
    response_message = response.message   # Execution status messages

    # File Connector Response Parameters
    response_file = response.get('file') # File, data is written to
    response_body = response.get('body') # Response Body, data written to the file

    if response_exitcode == 0
        @log.info("SUCCESS in executing #{connector_name} where, exitcode :: #{response_exitcode} | message :: #{response_message}")
        @log.info("File :: #{response_file} | Data written to the file :: #{response_body}")
        @output.set('content', response_body)
        @output.set('file-path', response_file)
    else
        @log.error("ERROR in executing #{connector_name} where, exitcode :: #{response_exitcode} | message :: #{response_message}")
        @output.exit(1, response_message)
    end
rescue Exception => e
    @log.error(e.message)
    @output.set('exit-code', 1).set('message', e.message)
end
@log.trace("Finished executing 'flint-util:file:operation:write.rb' flintbit...")
# end
