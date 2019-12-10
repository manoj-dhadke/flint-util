/*
 *
 * INFIVERVE TECHNOLOGIES PTE LIMITED CONFIDENTIAL
 * _______________________________________________
 *
 *  (C) INFIVERVE TECHNOLOGIES PTE LIMITED, SINGAPORE
 *  All Rights Reserved.
 *  Product / Project: Flint IT Automation Platform
 *  NOTICE:  All information contained herein is, and remains
 *  the property of INFIVERVE TECHNOLOGIES PTE LIMITED.
 *  The intellectual and technical concepts contained
 *  herein are proprietary to INFIVERVE TECHNOLOGIES PTE LIMITED.
 *  Dissemination of this information or any form of reproduction of this material
 *  is strictly forbidden unless prior written permission is obtained
 *  from INFIVERVE TECHNOLOGIES PTE LIMITED, SINGAPORE.
*/

/**
** Creation Date: 23th August 2018
** Summary: This is Reset Active Directory User Password flintbit.
** Description: This flintbit is developed to reset AD user password after receiving service request from Freshserver.
**/

log.trace("Started executing flint-util:ad-winrm:reset_ad_password.js flintbit.")
    // Input parameters
    login_name = input.get("login_name")
    log.info(" login_name:" + login_name)

    // New default password
    password = "Welcome@123"

    log.trace(input)

    // Inputs for winrm taken from Global Config

    target = config.global("ad_credentials.target")
    target_username = config.global("ad_credentials.username")
    target_password = config.global("ad_credentials.password")
    
     
    // Command to reset AD user password
    command = " Import-module activedirectory;Set-ADAccountPassword -Identity " + " " + login_name.toString() + " " + " -Reset -NewPassword (ConvertTo-SecureString -AsPlainText " + " " + password.toString() + " " + " -Force)"

    log.info("Command : "+ command)

    // Flintbit call to reset password
    flintbit_response = call.bit("flint-util:ad-winrm:winrm_commonconnect.js")
                            .set("command", command)
                            .set("target", target)
                            .set("username",  target_username)
                            .set("password",  target_password)
                            .sync()

    // Extracting response of flintbit call
    message = flintbit_response.message()
    result = flintbit_response.get("result")

    first_error_message = flintbit_response.get("error")
    exitcode = flintbit_response.get("exit-code")

    // Exit-code Handling
    if (exitcode == 0) {
        
        log.info("Success in executing WinRM Connector! \nExitcode FOR RESET PASSWORD :: " + exitcode + "\nMessage :: " +  message)
        log.info("Reset password successful")
        log.trace("Finished executing winrm flintbit with success.")

        // Command to change password on first logon after resetting the password
        command = "Import-module activedirectory;Set-ADUser" + " " +  login_name + " " + " -changepasswordatlogon 1"

        // Flintbit call to change the password on first logon after resetting the password
        flintbit_response_first_logon = call.bit("flint-util:ad-winrm:winrm_commonconnect.js")
                                            .set("command", command)
                                            .set("target", target)
                                            .set("username",  target_username)
                                            .set("password",  target_password)
                                            .sync()

        exitcode_response = flintbit_response_first_logon.get("exit-code")
        second_error_message = flintbit_response_first_logon.get("error")
        
        if(exitcode_response == 0) {
            log.trace("Exit-code for FIRST LOGON: "+exitcode_response)
            log.info("Success in executing command of change password at first login")
        } else {
            log.error("ERROR AT FIRST LOGON: "+second_error_message)
            log.error("Error in executing command to change password at first login")
        }
        output.set("exit-code", exitcode).set('message', message)
    }else{
        output.set("exit-code", exitcode).set('message', first_error_message)
        log.error("ERROR AT RESET PASSWORD: "+first_error_message)
        output.exit(-1, error_message)
}
log.trace("Finished executing flint-util:ad-winrm:reset_password.js flintbit")
