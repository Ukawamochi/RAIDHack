# WorkDetail


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **number** |  | [default to undefined]
**team_id** | **number** |  | [default to undefined]
**title** | **string** |  | [default to undefined]
**description** | **string** |  | [default to undefined]
**demo_url** | **string** |  | [optional] [default to undefined]
**repository_url** | **string** |  | [optional] [default to undefined]
**technologies** | **Array&lt;string&gt;** |  | [optional] [default to undefined]
**status** | **string** |  | [default to undefined]
**submitted_at** | **string** |  | [optional] [default to undefined]
**published_at** | **string** |  | [optional] [default to undefined]
**vote_count** | **number** |  | [optional] [default to undefined]
**user_voted** | **boolean** |  | [optional] [default to undefined]
**created_at** | **string** |  | [default to undefined]
**updated_at** | **string** |  | [default to undefined]
**team** | [**Team**](Team.md) |  | [optional] [default to undefined]
**team_members** | [**Array&lt;User&gt;**](User.md) |  | [optional] [default to undefined]

## Example

```typescript
import { WorkDetail } from './api';

const instance: WorkDetail = {
    id,
    team_id,
    title,
    description,
    demo_url,
    repository_url,
    technologies,
    status,
    submitted_at,
    published_at,
    vote_count,
    user_voted,
    created_at,
    updated_at,
    team,
    team_members,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
