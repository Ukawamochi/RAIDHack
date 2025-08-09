# WorksApi

All URIs are relative to *https://raidhack-api.ukawamochi5.workers.dev*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**apiWorksGet**](#apiworksget) | **GET** /api/works | 作品一覧取得|
|[**apiWorksIdGet**](#apiworksidget) | **GET** /api/works/{id} | 作品詳細取得|
|[**apiWorksIdVotePost**](#apiworksidvotepost) | **POST** /api/works/{id}/vote | 作品に投票/投票解除|
|[**apiWorksPost**](#apiworkspost) | **POST** /api/works | 作品投稿|

# **apiWorksGet**
> ApiWorksGet200Response apiWorksGet()

投稿された作品の一覧を取得します

### Example

```typescript
import {
    WorksApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new WorksApi(configuration);

let page: number; //ページ番号 (optional) (default to 1)
let limit: number; //1ページあたりの件数 (optional) (default to 20)

const { status, data } = await apiInstance.apiWorksGet(
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

**ApiWorksGet200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 作品一覧取得成功 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiWorksIdGet**
> ApiWorksIdGet200Response apiWorksIdGet()

指定された作品の詳細情報を取得します

### Example

```typescript
import {
    WorksApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new WorksApi(configuration);

let id: number; //作品ID (default to undefined)

const { status, data } = await apiInstance.apiWorksIdGet(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] | 作品ID | defaults to undefined|


### Return type

**ApiWorksIdGet200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 作品詳細取得成功 |  -  |
|**404** | リソースが見つかりません |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiWorksIdVotePost**
> ApiWorksIdVotePost200Response apiWorksIdVotePost()

指定された作品に投票または投票解除を行います

### Example

```typescript
import {
    WorksApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new WorksApi(configuration);

let id: number; //作品ID (default to undefined)

const { status, data } = await apiInstance.apiWorksIdVotePost(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] | 作品ID | defaults to undefined|


### Return type

**ApiWorksIdVotePost200Response**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 投票処理成功 |  -  |
|**401** | 認証が必要です |  -  |
|**404** | リソースが見つかりません |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiWorksPost**
> ApiWorksPost201Response apiWorksPost(apiWorksPostRequest)

新しい作品を投稿します

### Example

```typescript
import {
    WorksApi,
    Configuration,
    ApiWorksPostRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new WorksApi(configuration);

let apiWorksPostRequest: ApiWorksPostRequest; //

const { status, data } = await apiInstance.apiWorksPost(
    apiWorksPostRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **apiWorksPostRequest** | **ApiWorksPostRequest**|  | |


### Return type

**ApiWorksPost201Response**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | 作品投稿成功 |  -  |
|**400** | リクエストが不正です |  -  |
|**401** | 認証が必要です |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

