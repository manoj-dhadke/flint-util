#begin
@log.trace("Started executing 'flint-util:aws:operation:describe_security_group.rb' flintbit...")

#Flintbit Input Parameters
#Mandatory
connector_name = @input.get("connector_name")             		#Name of the Amazon EC2 Connector
action = "describe-security-group"                            #Specifies the name of the operation: describe-security-group
group_name = @input.get("group_name")              		    	  #Contains one or more security groups name corresponding to the
																															#region that you want to describe
#Optional
region = @input.get("region")													  			#Amazon EC2 region (default region is 'us-east-1')
request_timeout = @input.get("timeout")									  		#Execution time of the Flintbit in milliseconds (default timeout is 60000 milloseconds)

@log.info("Flintbit input parameters are, action :      #{action} |
	                                        group_name : #{group_name} |
	                                        region :      #{region}")

connector_call = @call.connector(connector_name)
								 .set("action",action)
								 .set("group-name",group_name)

if !region.nil? && !region.empty?
   connector_call.set("region",region)
else
   @log.trace("region is not provided so using default region 'us-east-1'")     
end

if request_timeout.nil? || request_timeout.is_a?(String)
   @log.trace("Calling #{connector_name} with default timeout...")
	 response = connector_call.sync
else
   @log.trace("Calling #{connector_name} with given timeout #{request_timeout.to_s}...")
	 response = connector_call.timeout(request_timeout).sync
end

#Amazon EC2 Connector Response Meta Parameters
response_exitcode = response.exitcode              	          #Exit status code
response_message = response.message                           #Execution status messages

#Amazon EC2 Connector Response Parameters
security_group_info=response.get("security-group-info")       #Set of Amazon EC2 security groups details

if response_exitcode == 0
	@log.info("SUCCESS in executing #{connector_name} where, exitcode : #{response_exitcode} | 
																															message : #{response_message}")
	security_group_info.each do |group_info|
  @log.info("Amazon EC2 Security group owner ID : #{group_info.get("owner-id")} |
						 										 group name : #{group_info.get("group-name")} |
						 										 group description : #{group_info.get("group-description")} |
						 										 group vpc ID : #{group_info.get("vpc-id")} |
						 										 group ID : #{group_info.get("group-id")} |
						 										 group IP Permissions Egress : #{group_info.get("ip-permissions-egress")} |
						 										 group Tags : #{group_info.get("tags")} |
						 										 group IP Permissions : #{group_info.get("ip-permissions")} |")
	end
	@output.setraw("security-group-info",security_group_info.to_s)
else
	@log.error("ERROR in executing #{connector_name} where, exitcode : #{response_exitcode} |
																															 message : #{response_message}")  
  @output.set("error",response_message)
  #@output.exit(1,response_message)														#Use to exit from flintbit
end
  @log.trace("Finished executing 'flint-util:aws:operation:describe_security_group.rb' flintbit")
#end
