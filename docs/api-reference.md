# API Reference

## Methods

### `loadPartialModal(options)`

Loads a Bootstrap modal with content from a partial view.

**Parameters:**

- `options` (Object): Configuration object (see Options below)

**Returns:** jQuery object (chainable)

## Options

### Programmatic Mode Options

| Option | Type | Default | Required | Description |
|--------|------|---------|----------|-------------|
| `url` | string | `''` | Yes | URL to load the partial view |
| `method` | string | `'POST'` | No | HTTP method (GET/POST) |
| `data` | object | `{}` | No | Data to send to the server |
| `title` | string | `'Modal'` | No | Modal header title |
| `size` | string | `''` | No | Bootstrap modal size class (`modal-sm`, `modal-lg`, `modal-xl`) |
| `loadingText` | string | `'Loading...'` | No | Text shown while loading |
| `errorText` | string | `'Failed to load...'` | No | Error message text |
| `onLoaded` | function | `function() {}` | No | Callback after content is loaded |
| `onSubmit` | function | `null` | No | Callback for form submission |
| `onSuccess` | function | `null` | No | Callback after successful submission |
| `onError` | function | `null` | No | Callback on error |

### Data Attributes (Declarative Mode)

| Attribute | Type | Required | Description |
|-----------|------|----------|-------------|
| `data-modal-url` | string | Yes | URL to load the partial view |
| `data-modal-method` | string | No | HTTP method (default: POST) |
| `data-modal-title` | string | No | Modal header title |
| `data-modal-size` | string | No | Bootstrap size class |
| `data-modal-data` | JSON string | No | Data to send (must be valid JSON) |
| `data-modal-submit-url` | string | No | URL for form submission |
| `data-modal-on-loaded` | string | No | Name of global callback function |
| `data-modal-on-success` | string | No | Name of global callback function |
| `data-modal-on-error` | string | No | Name of global callback function |
| `data-modal-loading-text` | string | No | Custom loading text |
| `data-modal-error-text` | string | No | Custom error message |

## Callbacks

### onLoaded(modal)

Called after the partial content is successfully loaded into the modal.

**Parameters:**

- `modal` (jQuery object): The modal element

**Example:**

```javascript
onLoaded: function(modal) {
    console.log('Modal loaded:', modal);
    // Perform additional initialization
}
```

### onSubmit(formData, callback)

Called when a form inside the modal is submitted.

**Parameters:**

- `formData` (FormData): The form data
- `callback` (function): Callback to call with the result

**Example:**

```javascript
onSubmit: function(formData, callback) {
    $.ajax({
        url: '/Home/CreateProduct',
        method: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function(result) {
            callback(result);
        },
        error: function(xhr) {
            callback({ success: false, message: "Error" });
        }
    });
}
```

**Callback Parameter:**

- Object with `{ success: true, message: "..." }` for success
- Object with `{ success: false, html: "..." }` for validation errors (replaces form)
- Object with `{ success: false, message: "..." }` for errors

### onSuccess(result)

Called after successful form submission, after the modal is hidden.

**Parameters:**

- `result` (object): The server response

**Example:**

```javascript
onSuccess: function(result) {
    console.log('Success:', result.message);
    // Refresh data, redirect, etc.
}
```

### onError(errorData)

Called when an error occurs (loading or submission).

**Parameters:**

- `errorData` (object): Error information

**Example:**

```javascript
onError: function(errorData) {
    console.error('Error:', errorData);
    alert('An error occurred: ' + errorData.message);
}
```

## Events

The plugin triggers custom jQuery events that can be listened to.

### Event List

| Event Name | When Triggered | Parameters | Cancelable |
|------------|----------------|------------|------------|
| `beforeLoad.partialModal` | Before modal loading starts | `event`, `settings` | Yes |
| `loaded.partialModal` | After content is loaded | `event`, `modal` | No |
| `success.partialModal` | After successful submission | `event`, `result` | No |
| `error.partialModal` | On error | `event`, `errorData` | No |

### beforeLoad.partialModal

Triggered before the modal starts loading. Can be prevented.

**Example:**

```javascript
$('#myBtn').on('beforeLoad.partialModal', function(event, settings) {
    console.log('About to load:', settings);
    
    if (!confirm('Load modal?')) {
        event.preventDefault(); // Cancel loading
    }
});
```

### loaded.partialModal

Triggered after the partial content is loaded.

**Example:**

```javascript
$('#myBtn').on('loaded.partialModal', function(event, modal) {
    console.log('Modal loaded:', modal);
    // Initialize components, etc.
});
```

### success.partialModal

Triggered after successful form submission (after modal is hidden).

**Example:**

```javascript
$('#myBtn').on('success.partialModal', function(event, result) {
    console.log('Success:', result);
    // Show notification, reload data, etc.
});
```

### error.partialModal

Triggered on error (load or submit).

**Example:**

```javascript
$('#myBtn').on('error.partialModal', function(event, errorData) {
    console.error('Error:', errorData);
});
```

## Modal Sizes

Bootstrap 5 provides several modal sizes:

| Class | Size |
|-------|------|
| (none) | Default (500px max-width) |
| `modal-sm` | Small (300px max-width) |
| `modal-lg` | Large (800px max-width) |
| `modal-xl` | Extra large (1140px max-width) |
| `modal-fullscreen` | Fullscreen |

**Example:**

```javascript
$(this).loadPartialModal({
    url: '/Home/Details',
    size: 'modal-xl'  // Extra large modal
});
```

## Server Response Format

### Success Response

For successful form submissions, return JSON:

```csharp
return Json(new { 
    success = true, 
    message = "Operation completed successfully" 
});
```

### Validation Error Response

For validation errors, return the partial view with the model:

```csharp
return PartialView("_FormPartial", model);
```

The plugin will detect HTML response and replace the modal content.

### Error Response

For errors, return JSON:

```csharp
return Json(new { 
    success = false, 
    message = "An error occurred" 
});
```

## Footer Content

Use the `.modal-footer-content` class with `d-none` to define footer buttons:

```html
<div class="modal-footer-content d-none">
    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
    <button type="submit" class="btn btn-primary">Submit</button>
</div>
```

The plugin automatically moves this content to the modal footer.

## Best Practices

1. **Always return JSON for success**, HTML for validation errors
2. **Use data-bs-dismiss="modal"** for cancel buttons
3. **Include validation spans** in forms for error display
4. **Use the modal-footer-content pattern** for footer buttons
5. **Handle both success and error cases** in onSubmit
6. **Use events for decoupled code** instead of global callbacks when possible
