log.trace("Started executing>>>>>>>>>>>>> flint-util:ad-winrm:reset_password.js flintbit...")

try{
    // Input parameters
    login_name = input.get("login_name")
    log.info(" login_name:" + login_name)
    // NEW RESET DEFAULT PASSWORD
    password = "Infiverve@123"
    log.info("After login_name and password")
    log.trace(input)

    // Inputs for winrm 
    target = input.get('target')
    ad_username = input.get('target_username')
    ad_password = input.get('target_password')
    
    // Printing out all inputs global and others
    // log.info("Target: "+target)
    // log.info("Target username: "+ad_username )
    // log.info("Target password: "+ad_password)
    // log.info("AD User Login Name: "+login_name)
    // log.info("Connector Name: "+config.global("winrm.connector_name"))
    // log.info("Port: "+config.global("winrm.port"))
    // log.info("Transport: "+config.global("winrm.transport"))
    // log.info("Shell: "+config.global("winrm.shell"))

    log.info("Before flintbit call")
 
    // COMMAND TO RESET PASSWORD

    command = " Import-module activedirectory;Set-ADAccountPassword -Identity " + " " + login_name.toString() + " " + " -Reset -NewPassword (ConvertTo-SecureString -AsPlainText " + " " + password.toString() + " " + " -Force)"

    // command = " Import-module activedirectory;Set-ADAccountPassword -Identity " +  login_name.toString() +" -Reset -NewPassword (ConvertTo-SecureString -AsPlainText " + password.toString() +" -Force)"
    log.info("Command : "+ command)

    

    // CALL TO RESET PASSWORD
    flintbit_response = call.bit("flint-util:ad-winrm:winrm_commonconnect.js")
                            .set("command", command)
                            .set("target", target)
                            .set("username", ad_username)
                            .set("password", ad_password)
                            .sync()

    //extracting response of connector call
    success_message = flintbit_response.message()
    result = flintbit_response.get("result")

    first_error_message = flintbit_response.get("error")
    exitcode = flintbit_response.get("exit-code")

    //exception handling
    //case to execute if success_message is the response
    if (exitcode == 0) {
        log.info("Success in executing WinRM Connector! \nExitcode FOR RESET PASSWORD :: " + exitcode + "\nMessage :: " + success_message)

        log.info("Reset password successful")
        log.trace("Finished executing winrm flintbit with success...")

        // COMMAND TO CHANGE PASSWORD ON FIRST LOGON
        command = "Import-module activedirectory;Set-ADUser" + " " +  login_name + " " + " -changepasswordatlogon 1"

        // CALL TO CHANGE PASSWORD ON FIRST LOGON
        flintbit_response_first_logon = call.bit("flint-util:ad-winrm:winrm_commonconnect.js")
                                            .set("command", command)
                                            .set("target", target)
                                            .set("username", ad_username)
                                            .set("password", ad_password)
                                            .sync()


        exitcode_response = flintbit_response_first_logon.get("exit-code")
        second_error_message = flintbit_response_first_logon.get("error")
        if(exitcode_response == 0){
            log.trace("Exit-code for FIRST LOGON: "+exitcode_response)
            log.info("Success in executing command of change password at first login")
            
        }
        else {
            log.error("ERROR AT FIRST LOGON: "+second_error_message)
            log.error("Error in executing command to change password at first login")
        }
    }else{
        log.error("ERROR AT RESET PASSWORD: "+first_error_message)
 
    }
}catch(error){
    log.trace("Catch Exception: "+error)
}
log.trace("Finished executing flint-util:ad-winrm:reset_password.js flintbit")