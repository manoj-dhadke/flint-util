#import the smlets
Set-ExecutionPolicy RemoteSigned -force
import-module smlets;
#Required Args for flint 

#$priority=$args[0]
#$urgency=$args[1]
#$srarea=$args[2]
#$srsubarea=$args[2]
#$serviceRequestTitle=$args[2]
$serviceRequestDescription=$args[0]

#Get the Service Request Class
$serviceRequestClass = Get-SCSMClass -name System.WorkItem.ServiceRequest$

#Get the enumeration values needed for the lists in the Service Request
$serviceRequestArea = get-SCSMEnumeration -Name ServiceRequestAreaEnum.Hardware.Server
$serviceRequestPriority = Get-SCSMEnumeration -Name ServiceRequestPriorityEnum.Medium
$serviceRequestUrgency = Get-SCSMEnumeration -Name ServiceRequestUrgencyEnum.Medium

#Create a hash table of the Service Request Arguments
 $serviceRequestHashTable = @{
 Title = $serviceRequestTitle;
 Description = "$serviceRequestDescription";
 Urgency = $serviceRequestUrgency;
 Priority = $serviceRequestPriority;
 ID = 'SR{0}';
Area = $serviceRequestArea
}

#Create initial Service Request
$newServiceRequest = New-SCSMOBject -Class $serviceRequestClass -PropertyHashtable $serviceRequestHashTable -PassThru
$serviceRequestId = $newServiceRequest.ID
echo $serviceRequestId

#Get The Service Request Type Projection
$serviceRequestTypeProjection = Get-SCSMTypeProjection -name System.WorkItem.ServiceRequestProjection$

#Get the Service Request created earlier in a form where we can apply the template
$serviceRequestProjection = Get-SCSMObjectProjection -ProjectionName $serviceRequestTypeProjection.Name -filter "ID -eq $serviceRequestId"

#Get The Service Request Template
$serviceRequestTemplate = Get-SCSMObjectTemplate -DisplayName "Flint Integration"

#Apply the template to the Service Request
Set-SCSMObjectTemplate -Projection $serviceRequestProjection -Template $serviceRequestTemplate
