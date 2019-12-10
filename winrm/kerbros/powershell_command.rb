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
@log.trace("Started executing 'flint-util:winrm:kerbros:powershell_command.rb' flintbit...")
begin
      hostname = @input.get('hostname')
      protocol = @input.get('protocol')
      krb5_realm = @input.get('kerb5_realm')
      command = @input.get('command')
      @command = 'powershell -command ' + command.to_s
      bit_response = @call.bit('flint-util:winrm:connect:kerbros_connect.rb').set('command', @command).set('hostname', hostname)
                          .set('protocol', protocol).set('kerb5_realm', krb5_realm).sync
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
@log.trace("Finished execution of 'flint-util:winrm:kerbros:powershell_command.rb' flintbit...")
# end
