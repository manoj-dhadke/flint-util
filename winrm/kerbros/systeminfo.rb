# begin
@log.trace("Started executing 'flint-util:winrm:kerbros:systeminfo.rb' flintbit...")
begin
      hostname = @input.get('hostname')
      protocol = @input.get('protocol')
      krb5_realm = @input.get('kerb5_realm')
      bit_response = @call.bit('flint-util:winrm:connect:kerbros_connect.rb').set('command', 'systeminfo').set('hostname', hostname)
                          .set('protocol', protocol).set('kerb5_realm', kerb5_realm).sync
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
@log.trace("Finished execution of 'flint-util:winrm:kerbros:systeminfo.rb' flintbit...")
# end
