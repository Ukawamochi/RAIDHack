# ApplicationDetail


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **number** |  | [default to undefined]
**idea_id** | **number** |  | [default to undefined]
**applicant_id** | **number** |  | [default to undefined]
**message** | **string** |  | [optional] [default to undefined]
**motivation** | **string** |  | [optional] [default to undefined]
**status** | **string** |  | [default to undefined]
**applied_at** | **string** |  | [default to undefined]
**reviewed_at** | **string** |  | [optional] [default to undefined]
**review_message** | **string** |  | [optional] [default to undefined]
**idea** | [**ApplicationDetailAllOfIdea**](ApplicationDetailAllOfIdea.md) |  | [optional] [default to undefined]
**applicant** | [**User**](User.md) |  | [optional] [default to undefined]

## Example

```typescript
import { ApplicationDetail } from './api';

const instance: ApplicationDetail = {
    id,
    idea_id,
    applicant_id,
    message,
    motivation,
    status,
    applied_at,
    reviewed_at,
    review_message,
    idea,
    applicant,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
