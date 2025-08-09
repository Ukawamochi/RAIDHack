# ApiAuthGithubCallbackPost200Response


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**success** | **boolean** |  | [default to undefined]
**message** | **string** |  | [default to undefined]
**user** | [**User**](User.md) |  | [optional] [default to undefined]
**token** | **string** | API認証用JWTトークン | [optional] [default to undefined]
**access_token** | **string** | GitHubアクセストークン | [optional] [default to undefined]

## Example

```typescript
import { ApiAuthGithubCallbackPost200Response } from './api';

const instance: ApiAuthGithubCallbackPost200Response = {
    success,
    message,
    user,
    token,
    access_token,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
