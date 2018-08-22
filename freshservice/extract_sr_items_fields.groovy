log.info("start parsing input")
//log.info("Input is"+input.toString())
String rawTable = input.get("ticket_service_item_fields")
rawTable = rawTable.replaceAll("style='margin:0px;padding:0px;'","")
rawTable = rawTable.replaceAll("style='text-align:left; vertical-align:top;'","")
rawTable = rawTable.replaceAll("<td style='vertical-align:top;'> : </td>","")
rawTable = rawTable.replaceAll("<table >","<table>")
rawTable = rawTable.replaceAll("<td >","<td>")
log.info("Clean string is::"+rawTable)
String xml = rawTable
def parsed = new XmlSlurper().parseText(xml)
//log.info("Value ::: "+parsed.tr[0].td[0].text())
def list = parsed.tr*.td*.list()
log.info("List of Inputs ::: "+list)

def json = new groovy.json.JsonBuilder()

json{
  list.collect {"${it.get(0).toString().trim()}"  "${it.get(1).toString().trim()}"}
}

log.info("Json ::: "+json.toString())

output.setraw("data",json.toString())

