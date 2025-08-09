# TeamDetail


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **number** |  | [default to undefined]
**idea_id** | **number** |  | [default to undefined]
**name** | **string** |  | [default to undefined]
**description** | **string** |  | [optional] [default to undefined]
**discord_invite_url** | **string** |  | [optional] [default to undefined]
**status** | **string** |  | [default to undefined]
**created_at** | **string** |  | [default to undefined]
**updated_at** | **string** |  | [default to undefined]
**members** | [**Array&lt;TeamDetailAllOfMembers&gt;**](TeamDetailAllOfMembers.md) |  | [optional] [default to undefined]
**idea** | [**Idea**](Idea.md) |  | [optional] [default to undefined]

## Example

```typescript
import { TeamDetail } from './api';

const instance: TeamDetail = {
    id,
    idea_id,
    name,
    description,
    discord_invite_url,
    status,
    created_at,
    updated_at,
    members,
    idea,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
