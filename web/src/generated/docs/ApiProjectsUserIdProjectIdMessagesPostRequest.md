# ApiProjectsUserIdProjectIdMessagesPostRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**message** | **string** |  | [default to undefined]
**message_type** | **string** |  | [optional] [default to MessageTypeEnum_Public]
**recipients** | **Array&lt;number&gt;** | プライベートメッセージの受信者ID（message_type&#x3D;privateの場合） | [optional] [default to undefined]

## Example

```typescript
import { ApiProjectsUserIdProjectIdMessagesPostRequest } from './api';

const instance: ApiProjectsUserIdProjectIdMessagesPostRequest = {
    message,
    message_type,
    recipients,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
