# IdeaDetail


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **number** |  | [default to undefined]
**title** | **string** |  | [default to undefined]
**description** | **string** |  | [default to undefined]
**required_skills** | **Array&lt;string&gt;** |  | [optional] [default to undefined]
**user_id** | **number** |  | [default to undefined]
**status** | **string** |  | [default to undefined]
**like_count** | **number** |  | [optional] [default to undefined]
**user_liked** | **boolean** |  | [optional] [default to undefined]
**user** | [**IdeaUser**](IdeaUser.md) |  | [optional] [default to undefined]
**created_at** | **string** |  | [default to undefined]
**updated_at** | **string** |  | [default to undefined]
**applications** | [**Array&lt;Application&gt;**](Application.md) |  | [optional] [default to undefined]

## Example

```typescript
import { IdeaDetail } from './api';

const instance: IdeaDetail = {
    id,
    title,
    description,
    required_skills,
    user_id,
    status,
    like_count,
    user_liked,
    user,
    created_at,
    updated_at,
    applications,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
