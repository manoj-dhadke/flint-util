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

@log.trace("Started execution 'activedirectory:reset_user_password.rb' flintbit...") # execution Started
begin

    # Flintbit input parametes
    # Mandatory
    @connector_name = @input.get('connector_name') # active-directory connector name
    @dn = @input.get('distinguished-names')  #distinguished-names to identify the user in the active-directory
    @newuserpassword=@input.get('new-password') ##new user password for given user account

    # Optional
    request_timeout = @input.get('timeout')	# Execution time of the Flintbit in milliseconds (default timeout is 60000 milloseconds)

    connector_call = @call.connector(@connector_name)
                    .set('action',"reset-password")
                    .set('distinguished-names', @dn)
                    .set('new-password', @newuserpassword)

    if @connector_name.nil? || @connector_name.empty?
        raise 'Please provide "active-directory connector name (connector_name)" to reset user account password'
    end
    if @newuserpassword.nil? || @newuserpassword.empty?
        raise 'Please provide "new user password (new-password)" to reset user account password'
    end

    if @dn.nil? || @dn.empty?
        raise 'Please provide "user distinguished name (distinguished-names)" to reset user account password'
    end

    if request_timeout.nil? || request_timeout.is_a?(String)
        @log.trace("Calling #{@connector_name} with default timeout...")
        # calling active-directory connector
        response = connector_call.sync
    else
        @log.trace("Calling #{@connector_name} with given timeout #{request_timeout}...")
        # calling active-directory connector
        response = connector_call.timeout(request_timeout).sync
    end

    # active-directory  Connector Response Meta Parameters
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

@log.trace("Finished execution 'activedirectory:reset_user_password.rb' flintbit...") # Execution Finished
