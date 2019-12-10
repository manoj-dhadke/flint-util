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

@log.trace("Started execution 'ldap:create_user_account.rb' flintbit...") # execution Started
begin
    # Flintbit input parametes
    # Mandatory
    @connector_name = @input.get('connector_name') # ldap connector name
    @fname = @input.get('first-name') #first name of the user which you want to create
    @lname = @input.get('last-name') #last name of the user which you want to create
    @password = @input.get('account-password')  #account password of the user which you want to create
    @dn = @input.get('distinguished-names') #distinguished-names for the domain name in which you want to create user
    @userloginname = @input.get('user-login-name') #user login name of the user which you want to create

    # Optional
    request_timeout = @input.get('timeout')	# Execution time of the Flintbit in milliseconds (default timeout is 60000 milloseconds)

    connector_call = @call.connector(@connector_name)
                          .set('action', 'create-user-account')
                          .set('first-name', @fname)
                          .set('last-name', @lname)
                          .set('account-password', @password)
                          .set('distinguished-names', @dn)
                          .set('user-login-name', @userloginname)

    # checking connector name is nil or empty
    if @connector_name.nil? || @connector_name.empty?
        raise 'Please provide "ldap connector name (connector_name)" to create user account'
    end

    if @fname.nil? || @fname.empty?
        raise 'Please provide "User first name (first-name)" to create user account'
    end

    if @lname.nil? || @lname.empty?
        raise 'Please provide "user last name (last-name)" to create user account'
    end

    if @userloginname.nil? || @userloginname.empty?
        raise 'Please provide "user account login name (user-login-name)" to create user account'
    end

    if @password.nil? || @password.empty?
        raise 'Please provide "user account password (account-password)" to create user account'
    end

    if @dn.nil? || @dn.empty?
        raise 'Please provide "distinguished name (distinguished-names)" to create user account'
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

@log.trace("Finished execution 'ldap:create_user_account.rb' flintbit...") # Execution Finished
