#begin
@log.trace("Started executing 'flint-util:aws:operation:start_amazon_instance.rb' flintbit...")
begin
#Flintbit Input Parameters
#Mandatory
connector_name=@input.get("connector_name")             		#Name of the Amazon EC2 Connector
action="start-instances"                                		#Specifies the name of the operation: start-instances
instance_id = @input.get("instance_id")              		    #Contains one or more instance IDs corresponding to the
																														#instances that you want to start
#Optional
region = @input.get("region")													  		#Amazon EC2 region (default region is 'us-east-1')
request_timeout=@input.get("timeout")									  		#Execution time of the Flintbit in milliseconds (default timeout is 60000 milloseconds)

@log.info("Flintbit input parameters are, action :            #{action} |
	                                        instance_id :       #{instance_id} |
	                                        region :            #{region}")

@log.trace("Calling Amazon EC2 Connector...")

call_connector = @call.connector(connector_name)
								 .set("action",action)
                
if connector_name.nil? || connector_name.empty?
   raise 'Please provide Amazon EC2 "connector name (connector_name)" to start Instance'
end

if instance_id.nil? || instance_id.empty?
   raise 'Please provide "Amazon instance ID (instance_id)" to start Instance'
else
	 call_connector.set("instance-id",instance_id)
end

if !region.nil? && !region.empty?
   call_connector.set("region",region)
else
   @log.trace("Region is not provided so using default region 'us-east-1'")     
end

if request_timeout.nil? || request_timeout.is_a?(String)
   response = call_connector.sync
else
	 response = call_connector.timeout(request_timeout).sync
end

#Amazon EC2 Connector Response Meta Parameters
response_exitcode=response.exitcode              	          #Exit status code
response_message=response.message                           #Execution status messages

#Amazon EC2 Connector Response Parameters
instances_set=response.get("started-instances-set")         #Set of Amazon EC2 started instances

if response_exitcode == 0
	@log.info("SUCCESS in executing Amazon EC2 Connector where, exitcode : #{response_exitcode} | 
																															message :  #{response_message}")
	instances_set.each do |instance_id|
  @log.info("Amazon EC2 Instance current state :  #{instance_id.get("current-state")} |
						 Amazon EC2 Instance previous state : #{instance_id.get("previous-state")}
						 Amazon EC2 Instance id :             #{instance_id.get("instance-id")}")
	end
	@output.setraw("started-instances-set",instances_set.to_s)
else
	@log.error("ERROR in executing Amazon EC2 Connector where, exitcode : #{response_exitcode} |
																															 message :  #{response_message}")  
  @output.set("error",response_message)
  #@output.exit(1,response_message)															#Used to exit from flintbit
end
rescue Exception => e
  @log.error(e.message)
end
  @log.trace("Finished executing 'flint-util:aws:operation:start_amazon_instance.rb' flintbit")
#end
