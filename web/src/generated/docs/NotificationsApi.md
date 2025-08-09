# NotificationsApi

All URIs are relative to *https://raidhack-api.ukawamochi5.workers.dev*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**apiNotificationsGet**](#apinotificationsget) | **GET** /api/notifications | 通知一覧取得|
|[**apiNotificationsIdDelete**](#apinotificationsiddelete) | **DELETE** /api/notifications/{id} | 通知削除|
|[**apiNotificationsIdReadPut**](#apinotificationsidreadput) | **PUT** /api/notifications/{id}/read | 通知既読マーク|
|[**apiNotificationsReadAllPut**](#apinotificationsreadallput) | **PUT** /api/notifications/read-all | 全通知既読マーク|
|[**apiNotificationsUnreadCountGet**](#apinotificationsunreadcountget) | **GET** /api/notifications/unread-count | 未読通知数取得|

# **apiNotificationsGet**
> ApiNotificationsGet200Response apiNotificationsGet()

認証済みユーザーの通知一覧を取得します

### Example

```typescript
import {
    NotificationsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new NotificationsApi(configuration);

let page: number; //ページ番号 (optional) (default to 1)
let limit: number; //1ページあたりの件数 (optional) (default to 20)
let unreadOnly: boolean; //未読のみ取得 (optional) (default to false)

const { status, data } = await apiInstance.apiNotificationsGet(
    page,
    limit,
    unreadOnly
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **page** | [**number**] | ページ番号 | (optional) defaults to 1|
| **limit** | [**number**] | 1ページあたりの件数 | (optional) defaults to 20|
| **unreadOnly** | [**boolean**] | 未読のみ取得 | (optional) defaults to false|


### Return type

**ApiNotificationsGet200Response**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 通知一覧取得成功 |  -  |
|**401** | 認証が必要です |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiNotificationsIdDelete**
> SuccessResponse apiNotificationsIdDelete()

指定された通知を削除します

### Example

```typescript
import {
    NotificationsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new NotificationsApi(configuration);

let id: number; //通知ID (default to undefined)

const { status, data } = await apiInstance.apiNotificationsIdDelete(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] | 通知ID | defaults to undefined|


### Return type

**SuccessResponse**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 通知削除成功 |  -  |
|**401** | 認証が必要です |  -  |
|**404** | リソースが見つかりません |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiNotificationsIdReadPut**
> SuccessResponse apiNotificationsIdReadPut()

指定された通知を既読にします

### Example

```typescript
import {
    NotificationsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new NotificationsApi(configuration);

let id: number; //通知ID (default to undefined)

const { status, data } = await apiInstance.apiNotificationsIdReadPut(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] | 通知ID | defaults to undefined|


### Return type

**SuccessResponse**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 既読処理成功 |  -  |
|**401** | 認証が必要です |  -  |
|**404** | リソースが見つかりません |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiNotificationsReadAllPut**
> SuccessResponse apiNotificationsReadAllPut()

認証済みユーザーの全ての通知を既読にします

### Example

```typescript
import {
    NotificationsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new NotificationsApi(configuration);

const { status, data } = await apiInstance.apiNotificationsReadAllPut();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**SuccessResponse**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 全既読処理成功 |  -  |
|**401** | 認証が必要です |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiNotificationsUnreadCountGet**
> ApiNotificationsUnreadCountGet200Response apiNotificationsUnreadCountGet()

認証済みユーザーの未読通知数を取得します

### Example

```typescript
import {
    NotificationsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new NotificationsApi(configuration);

const { status, data } = await apiInstance.apiNotificationsUnreadCountGet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**ApiNotificationsUnreadCountGet200Response**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 未読通知数取得成功 |  -  |
|**401** | 認証が必要です |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

