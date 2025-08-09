# TeamsApi

All URIs are relative to *https://raidhack-api.ukawamochi5.workers.dev*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**apiTeamsIdDelete**](#apiteamsiddelete) | **DELETE** /api/teams/{id} | チーム解散|
|[**apiTeamsIdDiscordPut**](#apiteamsiddiscordput) | **PUT** /api/teams/{id}/discord | Discord招待URL設定|
|[**apiTeamsIdGet**](#apiteamsidget) | **GET** /api/teams/{id} | チーム詳細取得|
|[**apiTeamsMeGet**](#apiteamsmeget) | **GET** /api/teams/me | 参加チーム一覧取得|

# **apiTeamsIdDelete**
> SuccessResponse apiTeamsIdDelete()

チームリーダーがチームを解散します

### Example

```typescript
import {
    TeamsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TeamsApi(configuration);

let id: number; //チームID (default to undefined)

const { status, data } = await apiInstance.apiTeamsIdDelete(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] | チームID | defaults to undefined|


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
|**200** | チーム解散成功 |  -  |
|**401** | 認証が必要です |  -  |
|**403** | アクセス権限がありません |  -  |
|**404** | リソースが見つかりません |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiTeamsIdDiscordPut**
> ApiTeamsIdDiscordPut200Response apiTeamsIdDiscordPut(apiTeamsIdDiscordPutRequest)

チームリーダーがDiscord招待URLを設定します

### Example

```typescript
import {
    TeamsApi,
    Configuration,
    ApiTeamsIdDiscordPutRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new TeamsApi(configuration);

let id: number; //チームID (default to undefined)
let apiTeamsIdDiscordPutRequest: ApiTeamsIdDiscordPutRequest; //

const { status, data } = await apiInstance.apiTeamsIdDiscordPut(
    id,
    apiTeamsIdDiscordPutRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **apiTeamsIdDiscordPutRequest** | **ApiTeamsIdDiscordPutRequest**|  | |
| **id** | [**number**] | チームID | defaults to undefined|


### Return type

**ApiTeamsIdDiscordPut200Response**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Discord URL設定成功 |  -  |
|**400** | リクエストが不正です |  -  |
|**401** | 認証が必要です |  -  |
|**403** | アクセス権限がありません |  -  |
|**404** | リソースが見つかりません |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiTeamsIdGet**
> ApiTeamsIdGet200Response apiTeamsIdGet()

指定されたチームの詳細情報を取得します（チームメンバーのみ）

### Example

```typescript
import {
    TeamsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TeamsApi(configuration);

let id: number; //チームID (default to undefined)

const { status, data } = await apiInstance.apiTeamsIdGet(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] | チームID | defaults to undefined|


### Return type

**ApiTeamsIdGet200Response**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | チーム詳細取得成功 |  -  |
|**401** | 認証が必要です |  -  |
|**403** | アクセス権限がありません |  -  |
|**404** | リソースが見つかりません |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiTeamsMeGet**
> ApiTeamsMeGet200Response apiTeamsMeGet()

認証済みユーザーが参加しているチーム一覧を取得します

### Example

```typescript
import {
    TeamsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TeamsApi(configuration);

const { status, data } = await apiInstance.apiTeamsMeGet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**ApiTeamsMeGet200Response**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | チーム一覧取得成功 |  -  |
|**401** | 認証が必要です |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

