# ProjectsApi

All URIs are relative to *https://raidhack-api.ukawamochi5.workers.dev*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**apiProjectsUserIdProjectIdApplicationsApplicationIdPut**](#apiprojectsuseridprojectidapplicationsapplicationidput) | **PUT** /api/projects/{userId}/{projectId}/applications/{applicationId} | プロジェクト応募処理|
|[**apiProjectsUserIdProjectIdGet**](#apiprojectsuseridprojectidget) | **GET** /api/projects/{userId}/{projectId} | プロジェクト詳細取得|
|[**apiProjectsUserIdProjectIdMessagesGet**](#apiprojectsuseridprojectidmessagesget) | **GET** /api/projects/{userId}/{projectId}/messages | プロジェクトメッセージ取得|
|[**apiProjectsUserIdProjectIdMessagesPost**](#apiprojectsuseridprojectidmessagespost) | **POST** /api/projects/{userId}/{projectId}/messages | プロジェクトメッセージ送信|
|[**apiProjectsUserIdProjectIdSettingsPut**](#apiprojectsuseridprojectidsettingsput) | **PUT** /api/projects/{userId}/{projectId}/settings | プロジェクト設定更新|

# **apiProjectsUserIdProjectIdApplicationsApplicationIdPut**
> SuccessResponse apiProjectsUserIdProjectIdApplicationsApplicationIdPut(apiProjectsUserIdProjectIdApplicationsApplicationIdPutRequest)

プロジェクトへの応募を承認または拒否します（プロジェクトオーナーのみ）

### Example

```typescript
import {
    ProjectsApi,
    Configuration,
    ApiProjectsUserIdProjectIdApplicationsApplicationIdPutRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new ProjectsApi(configuration);

let userId: string; //ユーザー名 (default to undefined)
let projectId: string; //プロジェクト名 (default to undefined)
let applicationId: number; //応募ID (default to undefined)
let apiProjectsUserIdProjectIdApplicationsApplicationIdPutRequest: ApiProjectsUserIdProjectIdApplicationsApplicationIdPutRequest; //

const { status, data } = await apiInstance.apiProjectsUserIdProjectIdApplicationsApplicationIdPut(
    userId,
    projectId,
    applicationId,
    apiProjectsUserIdProjectIdApplicationsApplicationIdPutRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **apiProjectsUserIdProjectIdApplicationsApplicationIdPutRequest** | **ApiProjectsUserIdProjectIdApplicationsApplicationIdPutRequest**|  | |
| **userId** | [**string**] | ユーザー名 | defaults to undefined|
| **projectId** | [**string**] | プロジェクト名 | defaults to undefined|
| **applicationId** | [**number**] | 応募ID | defaults to undefined|


### Return type

**SuccessResponse**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 応募処理成功 |  -  |
|**401** | 認証が必要です |  -  |
|**403** | アクセス権限がありません |  -  |
|**404** | リソースが見つかりません |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiProjectsUserIdProjectIdGet**
> ApiProjectsUserIdProjectIdGet200Response apiProjectsUserIdProjectIdGet()

指定されたユーザーのプロジェクト詳細を取得します

### Example

```typescript
import {
    ProjectsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ProjectsApi(configuration);

let userId: string; //ユーザー名 (default to undefined)
let projectId: string; //プロジェクト名（URL エンコードされた文字列） (default to undefined)

const { status, data } = await apiInstance.apiProjectsUserIdProjectIdGet(
    userId,
    projectId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **userId** | [**string**] | ユーザー名 | defaults to undefined|
| **projectId** | [**string**] | プロジェクト名（URL エンコードされた文字列） | defaults to undefined|


### Return type

**ApiProjectsUserIdProjectIdGet200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | プロジェクト詳細取得成功 |  -  |
|**404** | リソースが見つかりません |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiProjectsUserIdProjectIdMessagesGet**
> ApiProjectsUserIdProjectIdMessagesGet200Response apiProjectsUserIdProjectIdMessagesGet()

プロジェクトのメッセージ一覧を取得します

### Example

```typescript
import {
    ProjectsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ProjectsApi(configuration);

let userId: string; //ユーザー名 (default to undefined)
let projectId: string; //プロジェクト名 (default to undefined)
let type: 'public' | 'private'; //メッセージタイプ (optional) (default to 'public')
let limit: number; //取得件数 (optional) (default to 50)
let offset: number; //オフセット (optional) (default to 0)

const { status, data } = await apiInstance.apiProjectsUserIdProjectIdMessagesGet(
    userId,
    projectId,
    type,
    limit,
    offset
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **userId** | [**string**] | ユーザー名 | defaults to undefined|
| **projectId** | [**string**] | プロジェクト名 | defaults to undefined|
| **type** | [**&#39;public&#39; | &#39;private&#39;**]**Array<&#39;public&#39; &#124; &#39;private&#39;>** | メッセージタイプ | (optional) defaults to 'public'|
| **limit** | [**number**] | 取得件数 | (optional) defaults to 50|
| **offset** | [**number**] | オフセット | (optional) defaults to 0|


### Return type

**ApiProjectsUserIdProjectIdMessagesGet200Response**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | メッセージ取得成功 |  -  |
|**401** | 認証が必要です |  -  |
|**404** | リソースが見つかりません |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiProjectsUserIdProjectIdMessagesPost**
> ApiProjectsUserIdProjectIdMessagesPost201Response apiProjectsUserIdProjectIdMessagesPost(apiProjectsUserIdProjectIdMessagesPostRequest)

プロジェクトにメッセージを送信します

### Example

```typescript
import {
    ProjectsApi,
    Configuration,
    ApiProjectsUserIdProjectIdMessagesPostRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new ProjectsApi(configuration);

let userId: string; //ユーザー名 (default to undefined)
let projectId: string; //プロジェクト名 (default to undefined)
let apiProjectsUserIdProjectIdMessagesPostRequest: ApiProjectsUserIdProjectIdMessagesPostRequest; //

const { status, data } = await apiInstance.apiProjectsUserIdProjectIdMessagesPost(
    userId,
    projectId,
    apiProjectsUserIdProjectIdMessagesPostRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **apiProjectsUserIdProjectIdMessagesPostRequest** | **ApiProjectsUserIdProjectIdMessagesPostRequest**|  | |
| **userId** | [**string**] | ユーザー名 | defaults to undefined|
| **projectId** | [**string**] | プロジェクト名 | defaults to undefined|


### Return type

**ApiProjectsUserIdProjectIdMessagesPost201Response**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | メッセージ送信成功 |  -  |
|**401** | 認証が必要です |  -  |
|**404** | リソースが見つかりません |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiProjectsUserIdProjectIdSettingsPut**
> SuccessResponse apiProjectsUserIdProjectIdSettingsPut(projectSettings)

プロジェクトの設定を更新します（プロジェクトオーナーのみ）

### Example

```typescript
import {
    ProjectsApi,
    Configuration,
    ProjectSettings
} from './api';

const configuration = new Configuration();
const apiInstance = new ProjectsApi(configuration);

let userId: string; //ユーザー名 (default to undefined)
let projectId: string; //プロジェクト名 (default to undefined)
let projectSettings: ProjectSettings; //

const { status, data } = await apiInstance.apiProjectsUserIdProjectIdSettingsPut(
    userId,
    projectId,
    projectSettings
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **projectSettings** | **ProjectSettings**|  | |
| **userId** | [**string**] | ユーザー名 | defaults to undefined|
| **projectId** | [**string**] | プロジェクト名 | defaults to undefined|


### Return type

**SuccessResponse**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | プロジェクト設定更新成功 |  -  |
|**401** | 認証が必要です |  -  |
|**403** | アクセス権限がありません |  -  |
|**404** | リソースが見つかりません |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

