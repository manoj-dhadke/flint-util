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

# begin
@log.info('Started execution of SMTP script !!')
begin
    if @input.type == 'application/xml'
        @connector_name = @input.get('/connector_name/text()') # Name of the smtp connector
        @from = @input.get('/from/text()')                     # Address of mail sender
        @to = @input.get('/to/text()')                         # Address of mail reciever
        @subject = @input.get('/subject/text()')               # Subject of the mail
        @body = @input.get('/body/text()')                     # Body of the mail
        @cc = @input.get('/cc/text()')                         # Carbon copy send to address other than main address
        @bcc = @input.get('/bcc/text()')                       # Blank carbon copy send to address other than main address
        @attachments = @input.get('/attachments/text()')       # Files to be added during mail
    else
        @connector_name = @input.get('connector_name')         # Name of the smtp connector
        @from = @input.get('from')                             # Address of mail sender
        @to = @input.get('to')                                 # Address of mail reciever
        @subject = @input.get('subject')                       # Subject of the mail
        @body = @input.get('body')                             # Body of the mail
        @cc = @input.get('cc')                                 # Carbon copy send to address other than main address
        @bcc = @input.get('bcc')                               # Blank carbon copy send to address other than main address
        @attachments = @input.get('attachments')               # Files to be added during mail
    end

    @connector_name = 'email' if @connector_name.nil? || @connector_name.empty?
    @from = 'email address' if @from.nil? || @from.empty?
    @to = 'email address' if @to.nil? || @to.empty?
    @subject = 'This is subject' if @subject.nil? || @subject.empty?
    @body = 'This is body' if @body.nil? || @body.empty?
    @cc = 'email address' if @cc.nil? || @cc.empty?
    @bcc = 'email address' if @bcc.nil? || @bcc.empty?
    if @attachments.nil? || @attachments.empty?
        @attachments = '/home/kamaljeet/Desktop/add.rb'
    end

    @log.info("Flintbit input parameters are, connector_name :: #{@connector_name}|
    from :: #{@from}| to   :: #{@to}| subject :: #{@subject}|
    body :: #{@body}| cc :: #{@cc}| bcc :: #{@bcc}| attachments :: #{@attachments}")
    @log.trace('Calling SMTP Connector...')

    response = @call.connector(@connector_name)
                    .set('cc', @cc)
                    .set('bcc', @bcc)
                    .set('subject', @subject)
                    .set('from', @from)
                    .set('to', @to)
                    .set('body', @body)
                    .set('action', 'send')
                    .set('attachments', @attachments).sync

    # SMTP Connector Response Meta Parameters
    response_exitcode = response.exitcode    # Exit status code
    response_message = response.message      # Execution status message

    # SMTP Connector Response Parameters
    result = response.get('result') # Response Body

    if response.exitcode == 0
        @log.info("Success in executing SMTP Connector where, exitcode :: #{response_exitcode} | message ::  #{response_message}")
        @log.info("SMTP Response Body ::#{response_message}")
        @output.set('result', response_message)
    else
        @log.error("Failure in executing SMTP Connector where, exitcode :: #{response_exitcode} | message ::  #{response_message}")
        @log.error('Failed')
        @output.set('result', response_message)
    end
rescue Exception => e
    @log.error(e.message)
    @output.set('exit-code', 1).set('message', e.message)
end
@log.info('Finished execution of SMTP script !!')
# end
