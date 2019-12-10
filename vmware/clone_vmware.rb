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

@log.trace("Started execution 'flint-vmware:vc55:clone_vm.rb' flintbit...") # execution Started
begin

    # Flintbit input parametes
    @connector_name = @config.global('vmware.connector_name')                # "vmware"
    @action = "clone-vm"
    @datacenter=@input.get('datacenter-name')
    @vmname=@input.get('vm-name')
    @clonename=@input.get('clone-from-name')
    @hostname=@input.get('host-name')
    @username=@input.get('username')
    @password = @input.get('password')
    @url = @input.get('url')

    #Optional
    request_timeout = @input.get('timeout')	# Execution time of the Flintbit in milliseconds (default timeout is 60000 milloseconds)

    # calling vmware connector
    response = @call.connector(@connector_name)
                    .set('action',@action)            
                    .set('url',@url)
                    .set('username',@username)
                    .set('password',@password)
                    .set('datacenter-name',@datacenter)
                    .set('vm-name',@vmname)
                    .set('clone-from-name',@clonename)
                    .set('host-name',@hostname)
                    .sync

     response_exitcode = response.exitcode # Exit status code
     response_message =  response.message # Execution status message


      if response_exitcode==0
         @log.info("Success in executing #{@connector_name} Connector, where exitcode :: #{response_exitcode} | message :: #{response_message}")
         @user_message = "VMware VM named #{@vmname} created"         
         @output.set("result::", "success").set('user_message',@user_message)

      else
         @log.error("ERROR in executing #{@connector_name} where, exitcode :: #{response_exitcode} | message :: #{response_message}")
         @user_message = "Error in creating VMware VM named #{@vmname}" 
         @output.exit(1, response_message).set('user_message',@user_message)
      end

rescue Exception => e
    @log.error(e.message)
    @output.set('exit-code', 1).set('message', e.message)
end

@log.trace("Finished execution 'flint-vmware:vc55:clone_vm.rb' flintbit...")
