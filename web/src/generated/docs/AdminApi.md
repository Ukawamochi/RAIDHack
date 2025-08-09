# AdminApi

All URIs are relative to *https://raidhack-api.ukawamochi5.workers.dev*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**apiAdminStatsGet**](#apiadminstatsget) | **GET** /api/admin/stats | 統計情報取得|

# **apiAdminStatsGet**
> ApiAdminStatsGet200Response apiAdminStatsGet()

プラットフォーム全体の統計情報を取得します（管理者のみ）

### Example

```typescript
import {
    AdminApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminApi(configuration);

const { status, data } = await apiInstance.apiAdminStatsGet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**ApiAdminStatsGet200Response**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 統計情報取得成功 |  -  |
|**401** | 認証が必要です |  -  |
|**403** | アクセス権限がありません |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

