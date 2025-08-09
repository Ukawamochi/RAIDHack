# IdeasApi

All URIs are relative to *https://raidhack-api.ukawamochi5.workers.dev*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**apiIdeasGet**](#apiideasget) | **GET** /api/ideas | アイデア一覧取得|
|[**apiIdeasIdApplicationsApplicationIdPut**](#apiideasidapplicationsapplicationidput) | **PUT** /api/ideas/{id}/applications/{applicationId} | 応募の承認・拒否|
|[**apiIdeasIdApplicationsGet**](#apiideasidapplicationsget) | **GET** /api/ideas/{id}/applications | アイデアの応募一覧取得|
|[**apiIdeasIdApplyPost**](#apiideasidapplypost) | **POST** /api/ideas/{id}/apply | アイデアに応募|
|[**apiIdeasIdGet**](#apiideasidget) | **GET** /api/ideas/{id} | アイデア詳細取得|
|[**apiIdeasIdLikePost**](#apiideasidlikepost) | **POST** /api/ideas/{id}/like | アイデアにいいね/いいね解除|
|[**apiIdeasPost**](#apiideaspost) | **POST** /api/ideas | アイデア投稿|

# **apiIdeasGet**
> ApiIdeasGet200Response apiIdeasGet()

公開されているアイデアの一覧を取得します

### Example

```typescript
import {
    IdeasApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new IdeasApi(configuration);

let page: number; //ページ番号 (optional) (default to 1)
let limit: number; //1ページあたりの件数 (optional) (default to 20)

const { status, data } = await apiInstance.apiIdeasGet(
    page,
    limit
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **page** | [**number**] | ページ番号 | (optional) defaults to 1|
| **limit** | [**number**] | 1ページあたりの件数 | (optional) defaults to 20|


### Return type

**ApiIdeasGet200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | アイデア一覧取得成功 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiIdeasIdApplicationsApplicationIdPut**
> ApiIdeasIdApplyPost201Response apiIdeasIdApplicationsApplicationIdPut(apiIdeasIdApplicationsApplicationIdPutRequest)

アイデア作成者が応募を承認または拒否します

### Example

```typescript
import {
    IdeasApi,
    Configuration,
    ApiIdeasIdApplicationsApplicationIdPutRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new IdeasApi(configuration);

let id: number; //アイデアID (default to undefined)
let applicationId: number; //応募ID (default to undefined)
let apiIdeasIdApplicationsApplicationIdPutRequest: ApiIdeasIdApplicationsApplicationIdPutRequest; //

const { status, data } = await apiInstance.apiIdeasIdApplicationsApplicationIdPut(
    id,
    applicationId,
    apiIdeasIdApplicationsApplicationIdPutRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **apiIdeasIdApplicationsApplicationIdPutRequest** | **ApiIdeasIdApplicationsApplicationIdPutRequest**|  | |
| **id** | [**number**] | アイデアID | defaults to undefined|
| **applicationId** | [**number**] | 応募ID | defaults to undefined|


### Return type

**ApiIdeasIdApplyPost201Response**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 応募審査成功 |  -  |
|**400** | リクエストが不正です |  -  |
|**401** | 認証が必要です |  -  |
|**403** | アクセス権限がありません |  -  |
|**404** | リソースが見つかりません |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiIdeasIdApplicationsGet**
> ApiIdeasIdApplicationsGet200Response apiIdeasIdApplicationsGet()

アイデア作成者のみ、そのアイデアへの応募一覧を取得できます

### Example

```typescript
import {
    IdeasApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new IdeasApi(configuration);

let id: number; //アイデアID (default to undefined)

const { status, data } = await apiInstance.apiIdeasIdApplicationsGet(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] | アイデアID | defaults to undefined|


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
|**403** | アクセス権限がありません |  -  |
|**404** | リソースが見つかりません |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiIdeasIdApplyPost**
> ApiIdeasIdApplyPost201Response apiIdeasIdApplyPost(apiIdeasIdApplyPostRequest)

指定されたアイデアに参加応募を行います

### Example

```typescript
import {
    IdeasApi,
    Configuration,
    ApiIdeasIdApplyPostRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new IdeasApi(configuration);

let id: number; //アイデアID (default to undefined)
let apiIdeasIdApplyPostRequest: ApiIdeasIdApplyPostRequest; //

const { status, data } = await apiInstance.apiIdeasIdApplyPost(
    id,
    apiIdeasIdApplyPostRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **apiIdeasIdApplyPostRequest** | **ApiIdeasIdApplyPostRequest**|  | |
| **id** | [**number**] | アイデアID | defaults to undefined|


### Return type

**ApiIdeasIdApplyPost201Response**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | 応募成功 |  -  |
|**400** | リクエストが不正です |  -  |
|**401** | 認証が必要です |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiIdeasIdGet**
> ApiIdeasIdGet200Response apiIdeasIdGet()

指定されたIDのアイデア詳細を取得します

### Example

```typescript
import {
    IdeasApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new IdeasApi(configuration);

let id: number; //アイデアID (default to undefined)

const { status, data } = await apiInstance.apiIdeasIdGet(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] | アイデアID | defaults to undefined|


### Return type

**ApiIdeasIdGet200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | アイデア詳細取得成功 |  -  |
|**404** | リソースが見つかりません |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiIdeasIdLikePost**
> ApiIdeasIdLikePost200Response apiIdeasIdLikePost()

指定されたアイデアにいいねまたはいいね解除を行います

### Example

```typescript
import {
    IdeasApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new IdeasApi(configuration);

let id: number; //アイデアID (default to undefined)

const { status, data } = await apiInstance.apiIdeasIdLikePost(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] | アイデアID | defaults to undefined|


### Return type

**ApiIdeasIdLikePost200Response**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | いいね処理成功 |  -  |
|**401** | 認証が必要です |  -  |
|**404** | リソースが見つかりません |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiIdeasPost**
> ApiIdeasPost201Response apiIdeasPost(apiIdeasPostRequest)

新しいアイデアを投稿します

### Example

```typescript
import {
    IdeasApi,
    Configuration,
    ApiIdeasPostRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new IdeasApi(configuration);

let apiIdeasPostRequest: ApiIdeasPostRequest; //

const { status, data } = await apiInstance.apiIdeasPost(
    apiIdeasPostRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **apiIdeasPostRequest** | **ApiIdeasPostRequest**|  | |


### Return type

**ApiIdeasPost201Response**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | アイデア投稿成功 |  -  |
|**400** | リクエストが不正です |  -  |
|**401** | 認証が必要です |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

