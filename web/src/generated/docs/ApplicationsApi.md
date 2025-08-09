# ApplicationsApi

All URIs are relative to *https://raidhack-api.ukawamochi5.workers.dev*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**apiApplicationsIdCreateTeamPost**](#apiapplicationsidcreateteampost) | **POST** /api/applications/{id}/create-team | 承認済み応募からチーム作成|
|[**apiApplicationsMeGet**](#apiapplicationsmeget) | **GET** /api/applications/me | 自分の応募一覧取得|

# **apiApplicationsIdCreateTeamPost**
> ApiApplicationsIdCreateTeamPost201Response apiApplicationsIdCreateTeamPost()

承認済みの応募からチームを作成します

### Example

```typescript
import {
    ApplicationsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ApplicationsApi(configuration);

let applicationId: number; //応募ID (default to undefined)

const { status, data } = await apiInstance.apiApplicationsIdCreateTeamPost(
    applicationId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **applicationId** | [**number**] | 応募ID | defaults to undefined|


### Return type

**ApiApplicationsIdCreateTeamPost201Response**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | チーム作成成功 |  -  |
|**400** | リクエストが不正です |  -  |
|**401** | 認証が必要です |  -  |
|**404** | リソースが見つかりません |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiApplicationsMeGet**
> ApiIdeasIdApplicationsGet200Response apiApplicationsMeGet()

認証済みユーザーの応募履歴を取得します

### Example

```typescript
import {
    ApplicationsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ApplicationsApi(configuration);

const { status, data } = await apiInstance.apiApplicationsMeGet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**ApiIdeasIdApplicationsGet200Response**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 応募一覧取得成功 |  -  |
|**401** | 認証が必要です |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

