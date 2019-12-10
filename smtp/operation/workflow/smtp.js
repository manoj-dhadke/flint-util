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

log.trace("Starting the execution of 'flint-util:smtp:operation:workflow:smtp.js'");

//Connector
connector_name = 'smtp';
connector_call = call.connector(connector_name);
log.info("Connector Name: " + connector_name);

//Action
action = "send";
log.info("Action: " + action);
connector_call.set("action", action);

input_clone = JSON.parse(input);

if (input_clone.hasOwnProperty("protocol_connection")) {

    protocol_connection = input_clone["protocol_connection"];
    encryptedCredentials = protocol_connection["encryptedCredentials"];
    //Username
    username = encryptedCredentials["username"];
    if (username != "" && username != null) {
        connector_call.set("username", username);
        log.info("Username: " + username);
    }
    else {
        log.error("Username is null or a empty string.");
    }

    //Password
    password = encryptedCredentials["password"];
    if (password != "" && password != null) {
        connector_call.set("password", password);
        log.info("Password is given.");
    }
    else {
        log.error("Password is an empty string or a null");
    }

    //Target
    target = encryptedCredentials["target"];
    if (target != "" && target != null) {
        connector_call.set("target", target);
        log.info("Target: " + target);
    }
    else {
        log.error("Hostname is an empty string or null.");
    }

    //Port
    port = encryptedCredentials["port"];
    if (port != null && port != "") {
        connector_call.set("port", port);
        log.info("Port: " + port);
    }
    else {
        log.error("Port is an empty string or null");
    }

    //From
    if (input_clone.hasOwnProperty("from")) {
        from = input.get("from");
        if (from != null && from != "") {
            connector_call.set("from", from);
            log.info("From: " + from);
        }
        else {
            log.error("From is null or an empty string");
        }
    }
    else {
        log.error("Input JSON doesn't contain 'from' key");
    }

    //To
    if (input_clone.hasOwnProperty("to")) {
        to = input.get("to");
        if (to != null && to != "") {
            connector_call.set("to", to);
            log.info("To: " + to);
        }
        else {
            log.error("To is null or an empty string");
        }
    }
    else {
        log.error("Input JSON doesn't contain 'to' key");
    }

    //Subject
    if (input_clone.hasOwnProperty("subject")) {
        subject = input.get("subject");
        if (subject != null && subject != "") {
            connector_call.set("subject", subject);
            log.info("Subject: " + subject);
        }
        else {
            log.error("Subject is null or an empty string");
        }
    }
    else {
        log.error("Input JSON doesn't contain 'subject' key");
    }

    //Body
    if (input_clone.hasOwnProperty("body")) {
        body = input.get("body");
        if (body != null && body != "") {
            connector_call.set("body", body);
            log.info("Body: " + body);
        }
        else {
            log.error("Body is null or an empty string");
        }
    }
    else {
        log.error("Input JSON doesn't contain 'body' key");
    }

    //cc
    if (input_clone.hasOwnProperty("cc")) {
        cc = input.get("cc");
        if (cc != null && cc != "") {
            index_cc = cc.indexOf(",");
            if (index_cc != -1) {
                cc = cc.split(",");
                connector_call.set("cc", cc);
                log.info("cc: " + cc);
            }
            else {
                cc_array = [];
                cc_array.push(cc);
                connector_call.set("cc", cc_array);
                log.info("cc: " + cc_array);
            }
        }
        else {
            log.info("cc is null or an empty string");
        }
    }
    else {
        log.info("Input JSON doesn't contain 'cc' key");
    }

    //bcc
    if (input_clone.hasOwnProperty("bcc")) {
        bcc = input.get("bcc");
        if (bcc != null && bcc != "") {
            index_bcc = bcc.indexOf(",");
            if (index_bcc != -1) {
                bcc = bcc.split(",");
                connector_call.set("bcc", bcc);
                log.info("bcc: " + bcc);
            }
            else {
                bcc_array = [];
                bcc_array.push(bcc);
                connector_call.set("bcc", bcc_array);
                log.info("bcc: " + bcc_array);
            }
        }
        else {
            log.info("bcc is null or an empty string");
        }
    }
    else {
        log.info("Input JSON doesn't contain 'bcc' key");
    }

    //Attachments
    if (input_clone.hasOwnProperty("attachments")) {
        attachments = input.get("attachments");
        log.trace("Current attachment value " + typeof attachments)
        if (attachments != null && attachments != "" && attachments != []) {
            index_attachment = attachments.indexOf(",");
            if (index_attachment != -1) {
                attachments = attachments.split(",");
                connector_call.set("attachments", attachments);
                log.info("Attachments: " + attachments);
            }
            else {
                attachments_array = [];
                attachments_array.push(attachments);
                connector_call.set("attachments", attachments_array);
                log.info("Attachments: " + attachments_array);
            }
        }
        else {
            log.info("attachments is null or an empty string");
        }
    }
    else {
        log.info("Input JSON doesn't contain 'attachments' key");
    }

    //Connector call
    response = connector_call.sync();

    //Response Meta Parameters
    response_exitcode = response.exitcode();
    response_message = response.message();

    //Response Result
    result = response.get("result");

    if (response_exitcode == 0) {
        log.info("Email sent Successfully!");
        user_message = "email sent successfully.";
        output.set("result", result).set("user_message", user_message).set("exit-code", response_exitcode);
        log.trace("Finished executing 'flint-util:smtp:operation:workflow:smtp.js' successfully");
    }
    else {
        log.error("Failure in sending email");
        output.set("error", response_message).set("exit-code", response_exitcode);
        log.trace("Finished executing 'flint-util:smtp:operation:workflow:smtp.js' with errors");
    }
}
else {
    log.error("Protocol Connection is not given.");
}
