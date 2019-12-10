=begin
#
#  INFIVERVE TECHNOLOGIES PTE LIMITED CONFIDENTIAL
#  _______________________________________________
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
@log.trace("Started executing 'flint-util:file:validation:append.rb' flintbit...")
begin
    # Flintbit Input Parameters
    connector_name = @input.get('connector_name') # Name of the File Connector
    action = 'append'                             # Action
    file_path = @input.get('file')                # File Name and File Location
    data = @input.get('data')                     # Data to be appended to the File

    connector_name = 'File Connector' if connector_name.nil? || connector_name.empty?
    action = 'append' if action.nil? || action.empty?
    if file_path.nil? || file_path.empty?
        file_path = Dir.pwd + '/flintbox/example/hello.rb'
    end
    data = ' -by Infiverve Technologies' if data.nil? || data.empty?

    @log.info("Flintbit input parameters are, connector name : #{connector_name} | action : #{action} | file_path : #{file_path} |
    file_content :   #{data}")

    @log.trace("Calling #{connector_name}...")
    response = @call.connector(connector_name)
                    .set('action', action)
                    .set('file', file_path)
                    .set('data', data)
                    .sync

    # File Connector Response Meta Parameters
    response_exitcode = response.exitcode  # Exit status code
    response_message = response.message    # Execution status messages

    # File Connector Response Parameters
    response_file = response.get('file')   # File, data is appended to
    response_body = response.get('body')   # Response Body, data appended to the file

    if response_exitcode == 0
        @log.info("SUCCESS in executing #{connector_name} where, exitcode :: #{response_exitcode} | message :: #{response_message}")
        @log.info("File : #{response_file} | Data appended to the File:: #{response_body}")
        @output.set('file-path', response_file)
        @output.set('content', response_body)
    else
        @log.error("ERROR in executing #{connector_name} where, exitcode :: #{response_exitcode} | message :: #{response_message}")
        @output.exit(1, response_message)
    end
rescue Exception => e
    @log.error(e.message)
    @output.set('exit-code', 1).set('message', e.message)
end
@log.trace("Finished executing 'flint-util:file:validation:append.rb' flintbit...")
# end
