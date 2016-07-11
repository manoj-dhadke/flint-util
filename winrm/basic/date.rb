# begin
@log.trace("Started executing 'flint-util:winrm:basic:date.rb' flintbit...")
begin
    hostname = @input.get('hostname')
    protocol = @input.get('protocol')
    username = @input.get('username')
    password = @input.get('password')
    bit_response = @call.bit('flint-util:winrm:connect:basic_auth_connect.rb').set('command', 'date /t && time /t').set('hostname', hostname)
                        .set('protocol', protocol).set('username', username).set('password', password).sync
    if bit_response.get('exit-code') == 0
        @output.set('message', 'success').set('exit-code', 0)
               .set('output', bit_response.get('output')).set('error_output', bit_response.get('error_output'))
    else
        @output.set('message', bit_response.get('message')).set('exit-code', bit_response.get('exit-code'))
    end
rescue Exception => e
    @log.error(e.message)
    @output.set('message', e.message).set('exit-code', -1)
    @log.info('output in exception')
end
@log.trace("Finished execution of 'flint-util:winrm:basic:date.rb' flintbit...")

# end
