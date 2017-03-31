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
