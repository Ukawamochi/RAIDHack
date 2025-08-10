# ProjectDetail


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **number** |  | [default to undefined]
**title** | **string** |  | [default to undefined]
**description** | **string** |  | [default to undefined]
**status** | **string** |  | [default to undefined]
**hostId** | **number** |  | [default to undefined]
**hostName** | **string** |  | [default to undefined]
**githubUrl** | **string** |  | [optional] [default to undefined]
**demoUrl** | **string** |  | [optional] [default to undefined]
**otherLinks** | [**Array&lt;ProjectDetailOtherLinksInner&gt;**](ProjectDetailOtherLinksInner.md) |  | [optional] [default to undefined]
**members** | [**Array&lt;ProjectDetailMembersInner&gt;**](ProjectDetailMembersInner.md) |  | [default to undefined]
**applicants** | [**Array&lt;ProjectDetailApplicantsInner&gt;**](ProjectDetailApplicantsInner.md) |  | [default to undefined]
**isRecruitingEnabled** | **boolean** |  | [default to undefined]
**maxMembers** | **number** |  | [default to undefined]
**progressPercentage** | **number** |  | [default to undefined]
**createdAt** | **string** |  | [default to undefined]
**updatedAt** | **string** |  | [default to undefined]
**startDate** | **string** |  | [optional] [default to undefined]
**deadline** | **string** |  | [optional] [default to undefined]

## Example

```typescript
import { ProjectDetail } from './api';

const instance: ProjectDetail = {
    id,
    title,
    description,
    status,
    hostId,
    hostName,
    githubUrl,
    demoUrl,
    otherLinks,
    members,
    applicants,
    isRecruitingEnabled,
    maxMembers,
    progressPercentage,
    createdAt,
    updatedAt,
    startDate,
    deadline,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
