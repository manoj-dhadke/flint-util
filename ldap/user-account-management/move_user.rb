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

@log.trace("Started execution 'ldap:move_user.rb' flintbit...") # execution Started
begin
  # Flintbit input parametes
  # Mandatory
  @connector_name = @input.get('connector_name') # ldap connector name
  @userolddn = @input.get('user-current-distinguished-names') #user distinguished-names to identify user in active-directory which you want move
  @usernewdn = @input.get('user-new-distinguished-names') #user new distinguished-names to identify to which user move

  # Optional
  request_timeout = @input.get('timeout')	# Execution time of the Flintbit in milliseconds (default timeout is 60000 milloseconds)

  connector_call = @call.connector(@connector_name)
                        .set('action', 'move-user')
                        .set('user-current-distinguished-names', @userolddn)
                        .set('user-new-distinguished-names', @usernewdn)

  if @connector_name.nil? || @connector_name.empty?
      raise 'Please provide "ldap connector name (connector_name)" to  remove user from group'
  end

  if @userolddn.nil? || @userolddn.empty?
      raise 'Please provide "user current distinguished name (user-current-distinguished-names)" to move into the new organizational unit'
  end

  if @usernewdn.nil? || @usernewdn.empty?
      raise 'Please provide "user new distinguished name (user-new-distinguished-names)"to move into the new organizational unit'
  end

  if request_timeout.nil? || request_timeout.is_a?(String)
      @log.trace("Calling #{@connector_name} with default timeout...")
      # calling ldap connector
      response = connector_call.sync
  else
      @log.trace("Calling #{@connector_name} with given timeout #{request_timeout}...")
      # calling ldap connector
      response = connector_call.timeout(request_timeout).sync
  end

  # ldap  Connector Response Meta Parameters
  response_exitcode = response.exitcode # Exit status code
  response_message =  response.message # Execution status message

  @log.info("RESPONSE :: #{response}")
  if response_exitcode == 0
      @log.info("Success in executing #{@connector_name} Connector, where exitcode :: #{response_exitcode} | message :: #{response_message}")
      @output.set('result', response.to_s).set('exit-code', 0)
  else
      @log.error("ERROR in executing #{@connector_name} where, exitcode :: #{response_exitcode} | message :: #{response_message}")
      @output.set('message', response_message.to_s).set('exit-code', -1)
  end

rescue Exception => e
  @log.error(e.message)
  @output.set('exit-code', -1).set('message', e.message)
end

@log.trace("Finished execution 'ldap:move_user.rb' flintbit...") # Execution Finished
