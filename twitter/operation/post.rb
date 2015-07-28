#begin
@log.trace("Started executing 'flint-util:twitter:operation:post.rb' flintbit...")
#Flintbit Input Parameters
#mandatory
connector_name = @input.get("connector_name")                 #Name of the Twitter Connector
action = "post"		                                  					#Tweet text on Twitter action
text = @input.get("text")    	                        				#Text to tweet on Twitter

#optional
file = @input.get("file")													      			#Full path of image file to post a photo in a Tweet
access_token = @input.get("access_token")                     #Access Token to authenticate Twitter account
access_secret_token = @input.get("access_secret_token")       #Access Secret Token to authenticate Twitter account
consumer_secret_key = @input.get("consumer_secret_key")       #Consumer Secret Key to authenticate Twitter account
consumer_key = @input.get("consumer_key")                     #Consumer Key to authenticate Twitter account
request_timeout = @input.get("timeout")									      #Execution time of the Flintbit in milliseconds

@log.info("Flintbit input parameters are, action : #{action} |
	                                        text : #{text} |
	                                        file : #{file} |
	                                        access-token : #{access_token} |
	                                        access-secret-token : #{access_secret_token} |
	                                        consumer-secret-key : #{consumer_secret_key} |
	                                        consumer-key : #{consumer_key} |")

connector_call = @call.connector(connector_name)
                 .set("action",action)
								 .set("text",text)
								 .set("file",file)
								 .set("access-token",access_token)
								 .set("access-secret-token",access_secret_token)
								 .set("consumer-secret-key",consumer_secret_key)
								 .set("consumer-key",consumer_key)

if request_timeout.nil? || request_timeout.is_a?(String)
   @log.trace("Calling #{connector_name} with default timeout...")
	 response = connector_call.sync
else
   @log.trace("Calling #{connector_name} with given timeout #{request_timeout.to_s}...")
	 response = connector_call.timeout(request_timeout).sync
end

#Twitter Connector Response Meta Parameters
response_exitcode = response.exitcode              	        #Exit status code
response_message = response.message                         #Execution status messages

#Twitter Connector Response Parameters
status=response.get("text")            											#Tweet uploaded on twitter account
tweet_id=response.get("tweet-id")            								#Tweet ID of uploaded tweet on twitter account
access_level=response.get("access-level")            				#Tweet access level uploaded on twitter account
favorite_count=response.get("favorite-count")            		#Tweet favorite count uploaded on twitter account
retweet_count=response.get("retweet-count")            			#Tweet Retweet count uploaded on twitter account
username=response.get("username")            								#Username of twitter account

if response_exitcode == 0
	@log.info("SUCCESS in executing #{connector_name} where, exitcode : #{response_exitcode} | 
																													 message : #{response_message}")
	@log.info("Twitter Tweet ID : #{tweet_id} |
						 				       status : #{status} |
						 				       Access Level : #{access_level} |
						 				       favorite count : #{favorite_count} |
						 				 			 Retweet count : #{retweet_count} |
						 				 			 Username : #{username} |")

	@output.set("tweet-id",tweet_id)
  @output.set("status",status)
  @output.set("access-level",access_level)
  @output.set("favorite-count",favorite_count)
  @output.set("retweet-count",retweet_count)
  @output.set("username",username)
else
	@log.error("ERROR in executing #{connector_name} where, exitcode : #{response_exitcode} |
																													message : #{response_message}")
  @output.set("error",response_message)
  @output.exit(-1,response_message)													#Use to exit from flintbit
end

  @log.trace("Finished executing 'flint-util:twitter:operation:post.rb' flintbit")
#end
