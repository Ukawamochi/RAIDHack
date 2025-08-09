# AuthenticationApi

All URIs are relative to *https://raidhack-api.ukawamochi5.workers.dev*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**apiAuthGithubCallbackPost**](#apiauthgithubcallbackpost) | **POST** /api/auth/github/callback | GitHub OAuth認証|
|[**apiAuthMeGet**](#apiauthmeget) | **GET** /api/auth/me | 現在のユーザー情報取得|

# **apiAuthGithubCallbackPost**
> ApiAuthGithubCallbackPost200Response apiAuthGithubCallbackPost(apiAuthGithubCallbackPostRequest)

GitHubのOAuth認証コールバックを処理し、JWTトークンを取得します

### Example

```typescript
import {
    AuthenticationApi,
    Configuration,
    ApiAuthGithubCallbackPostRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthenticationApi(configuration);

let apiAuthGithubCallbackPostRequest: ApiAuthGithubCallbackPostRequest; //

const { status, data } = await apiInstance.apiAuthGithubCallbackPost(
    apiAuthGithubCallbackPostRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **apiAuthGithubCallbackPostRequest** | **ApiAuthGithubCallbackPostRequest**|  | |


### Return type

**ApiAuthGithubCallbackPost200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | GitHub認証成功 |  -  |
|**400** | リクエストが不正です |  -  |
|**500** | GitHub認証エラー |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiAuthMeGet**
> ApiAuthMeGet200Response apiAuthMeGet()

認証済みユーザーの情報を取得します

### Example

```typescript
import {
    AuthenticationApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthenticationApi(configuration);

const { status, data } = await apiInstance.apiAuthMeGet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**ApiAuthMeGet200Response**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | ユーザー情報取得成功 |  -  |
|**401** | 認証が必要です |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

