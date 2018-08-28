log.trace("Started executing flint-util:ad-winrm:reset_password.js flintbit...")

try{
    // Input parameters
    login_name = input.get("login_name")
    log.info(" login_name:" + login_name)

    // NEW RESET DEFAULT PASSWORD
    password = "Welcome@123"

    log.trace(input)

    // Inputs for winrm 
    target = input.get('target')
     target_username = input.get('target_username')
     target_password = input.get('target_password')
    

    log.info("Before flintbit call")
 
    // COMMAND TO RESET PASSWORD

    command = " Import-module activedirectory;Set-ADAccountPassword -Identity " + " " + login_name.toString() + " " + " -Reset -NewPassword (ConvertTo-SecureString -AsPlainText " + " " + password.toString() + " " + " -Force)"

    log.info("Command : "+ command)


    // CALL TO RESET PASSWORD
    flintbit_response = call.bit("flint-util:ad-winrm:winrm_commonconnect.js")
                            .set("command", command)
                            .set("target", target)
                            .set("username",  target_username)
                            .set("password",  target_password)
                            .sync()

    //extracting response of connector call
     message = flintbit_response.message()
    result = flintbit_response.get("result")

    first_error_message = flintbit_response.get("error")
    exitcode = flintbit_response.get("exit-code")

    log.trace("First WINRM ==========> "+flintbit_response)

    //exception handling
    //case to execute if  message is the response
    if (exitcode == 0) {
        
        log.info("Success in executing WinRM Connector! \nExitcode FOR RESET PASSWORD :: " + exitcode + "\nMessage :: " +  message)

        log.info("Reset password successful")
        log.trace("Finished executing winrm flintbit with success...")

        // COMMAND TO CHANGE PASSWORD ON FIRST LOGON
        command = "Import-module activedirectory;Set-ADUser" + " " +  login_name + " " + " -changepasswordatlogon 1"

        // CALL TO CHANGE PASSWORD ON FIRST LOGON
        flintbit_response_first_logon = call.bit("flint-util:ad-winrm:winrm_commonconnect.js")
                                            .set("command", command)
                                            .set("target", target)
                                            .set("username",  target_username)
                                            .set("password",  target_password)
                                            .sync()


        exitcode_response = flintbit_response_first_logon.get("exit-code")
        second_error_message = flintbit_response_first_logon.get("error")
        if(exitcode_response == 0){

            log.trace("SECOND WINRM ==========> "+flintbit_response_first_logon)


            log.trace("Exit-code for FIRST LOGON: "+exitcode_response)
            log.info("Success in executing command of change password at first login")
            
        }
        else {
            log.error("ERROR AT FIRST LOGON: "+second_error_message)
            log.error("Error in executing command to change password at first login")
        }

        output.set("exit-code", exitcode).set('message', message)
    }else{
        output.set("exit-code", exitcode).set('message', message)
        log.error("ERROR AT RESET PASSWORD: "+first_error_message)
 
    }
}catch(error){
    log.trace("Catch Exception: "+error)
}
log.trace("Finished executing flint-util:ad-winrm:reset_password.js flintbit")