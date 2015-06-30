#begin
@log.trace("Started execution of 'select_db' flintbit...")
 #Flintbit Input Parameters
 
input_type = @input.type
# this input parameters are not used

 if input_type == "application/xml"  # Input type of Request
        @connector_name = @input.get("/connector_name/text()")
	 #All mandatory if jdbc_url not provided  
        @connector_name = @input.get("/connector_name/text()")  #Name of the JDBC Connector
	@jdbc_url = @input.get("/jdbc_url/text()")              #JDBC Url
        @query = @input.get("/query/text()")                    #Query of the Database
	@driver = @input.get("/driver/text()")                  #Jdbc driver name for database 
else
	#All mandatory if jdbc_url not provided  
        @connector_name= @input.get("connector_name")          #Name of the JDBC Connector
        @jdbc_url = @input.get("jdbc_url")                     #JDBC Url
        @query = @input.get("query")                           #Query of the Database
        @driver = @input.get("driver")                         #Jdbc driver name for database 
end
 
if @connector_name.nil? || @connector_name.empty?
	@connector_name = "mysql_db"
end
if @jdbc_url.nil? || @jdbc_url.empty?
	@jdbc_url = "jdbc:mysql://localhost:3306/flint"
end
if @query.nil? || @query.empty?
	@query = "select * from persons"
end
if @driver.nil? || @driver.empty?
	@driver = "com.mysql.jdbc.Driver"
end
@log.info("Flintbit input parameters are, connector name :: #{@connector_name} |
	                                  jdbc_url ::       #{@jdbc_url} |
	                                  driver ::         #{@driver} |
	                                  query ::          #{@query}") 


 
@log.trace("Calling JDBC Connector...")

    response = @call.connector(@connector_name)
                    .set("action","select")
                    .set("query",@query)
                    .set("jdbc-url",@jdbc_url)
                    .set("driver",@driver).sync

#HTTP Connector Response Meta Parameters
response_exitcode=response.exitcode           #Exit status code
response_message=response.message             #Execution status message

#HTTP Connector Response Parameters
result = response.get("result")              #Response Body

if response.exitcode == 0
	@log.info("Success in executing JDBC Connector where, exitcode :: #{response_exitcode} | 
    	                                                      message ::  #{response_message}")
	@log.info("HTTP Response Body :: #{result}")
	@output.set("result",result.to_s)
else
	@log.error("Failure in executing JDBC Connector where, exitcode :: #{response_exitcode} | 
		                                               message ::  #{response_message}")
        @output.set("error",response_message)
	@log.trace("Finished executing 'http_get' flintbit with error...")
end
 
@log.trace("Finished execution of 'select_db.rb'")
#end
