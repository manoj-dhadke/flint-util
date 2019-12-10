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

@log.info('Started execution of flint-util:jenkins:add_message.rb flintbit..')
# Getting input parameters
@body = @input.get('body')                   # HTTP body to post

# Getting required parameters from global configuration
    @http_connector_name = @config.global('hipchat_jenkins.http_post_url.name')
    @method = @config.global('hipchat_jenkins.http_post_url.method')
    @headers = @config.global('hipchat_jenkins.http_post_url.header')
    @url = @config.global('hipchat_jenkins.http_post_url.url')

begin
    @log.info("Flintbit input parameters are, connector name :: #{@http_connector_name} | Method ::  #{@method} |
    Body ::  #{@body} | Headers :: #{@headers}")

    @log.info('Calling HTTP connector to notify status')
    connector_response = @call.connector(@http_connector_name)
                              .set('method', @method)
                              .set('url', @url)
                              .set('body', @body)
                              .set('headers', @headers)
                              .sync

    response_exitcode = connector_response.exitcode
    response_message = connector_response.message

    if response_exitcode == 0
        @log.info("SUCCESS in executing #{@http_connector_name} where, exitcode :: #{response_exitcode} | message :: #{response_message}")
    else
        @log.error("ERROR in executing #{@http_connector_name} where, exitcode :: #{response_exitcode} | message :: #{response_message}")
    end
rescue Exception => e
    @log.error(e.message)
    @output.set('exit-code', 1).set('message', e.message)
    @log.error("ERROR in executing #{@http_connector_name} where, message :: " + e.message)
end
@log.info("Finished execution of 'flint-util:jenkins:add_message.rb flintbit..")
