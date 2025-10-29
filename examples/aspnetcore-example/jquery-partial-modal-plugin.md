# jQuery Partial Modal Plugin

A jQuery plugin to seamlessly load Bootstrap modals with ASP.NET Core partial views. Supports both programmatic and declarative approaches with built-in form submission handling and validation.

## Features

- ✅ **Dual Mode Support**: Programmatic (JavaScript) and Declarative (data attributes)
- ✅ **Form Handling**: Automatic form submission with AJAX and validation error display
- ✅ **Bootstrap 5 Compatible**: Works seamlessly with Bootstrap 5 modals
- ✅ **Event System**: Rich event system for lifecycle management
- ✅ **Callback Support**: Global functions and jQuery event handlers
- ✅ **Single Modal Instance**: Efficient DOM management with one reusable modal
- ✅ **Validation Integration**: Built-in jQuery validation support
- ✅ **Customizable**: Flexible configuration options

## Installation

1. Include jQuery and Bootstrap 5:

```html
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
```

2. Include the plugin:

```html
<script src="path/to/jquery-partial-modal.js"></script>
```

## Usage

### Programmatic Mode

#### Simple View Loading

Load a partial view without form submission:

```javascript
$('#myButton').on('click', function() {
    $(this).loadPartialModal({
        url: '/Home/UserDetails',
        method: 'POST',
        data: { id: 123 },
        title: 'User Profile',
        size: 'modal-lg',
        onLoaded: function(modal) {
            console.log('Modal loaded successfully');
        }
    });
});
```

#### Form with Submission

Load a form and handle submission:

```javascript
$('#createBtn').on('click', function() {
    $(this).loadPartialModal({
        url: '/Home/CreateProductForm',
        method: 'GET',
        title: 'Create Product',
        size: 'modal-md',
        onSubmit: function(formData, callback) {
            $.ajax({
                url: '/Home/CreateProduct',
                method: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                dataType: 'json',
                success: function(result) {
                    callback(result);
                    if (result.success) {
                        $('#partialModal').one('hidden.bs.modal', function() {
                            alert(result.message);
                            // Optional: reload page or update data
                            // location.reload();
                        });
                    }
                },
                error: function(xhr) {
                    if (xhr.status === 200 && xhr.responseText) {
                        // Validation errors - server returns HTML
                        callback({ success: false, html: xhr.responseText });
                    } else {
                        callback({ success: false, message: "Submission failed" });
                    }
                }
            });
        }
    });
});
```

### Declarative Mode

#### Basic Usage

Define modals directly in HTML with data attributes:

```html
<button class="modal-trigger" 
        data-modal-url="/Home/UserDetails"
        data-modal-method="POST"
        data-modal-title="User Profile"
        data-modal-size="modal-lg"
        data-modal-data='{"id": 123}'>
    Show User Details
</button>

<script>
    $('.modal-trigger').loadPartialModal();
</script>
```

#### With Global Callbacks

Use global JavaScript functions for callbacks:

```html
<button class="modal-trigger" 
        data-modal-url="/Home/CreateProductForm"
        data-modal-method="GET"
        data-modal-title="Create Product"
        data-modal-size="modal-md"
        data-modal-submit-url="/Home/CreateProduct"
        data-modal-on-loaded="onFormLoaded"
        data-modal-on-success="onProductCreated"
        data-modal-on-error="onProductError">
    Create Product
</button>

<script>
    function onFormLoaded(modal) {
        console.log('Form loaded');
    }

    function onProductCreated(result) {
        alert('✓ Product created: ' + result.message);
    }

    function onProductError(errorData) {
        alert('✗ Error: ' + errorData.message);
    }

    $('.modal-trigger').loadPartialModal();
</script>
```

#### With jQuery Events

Use jQuery event handlers for more flexibility:

```html
<button id="myBtn" class="modal-trigger" 
        data-modal-url="/Home/CreateProductForm"
        data-modal-submit-url="/Home/CreateProduct">
    Create Product
</button>

<script>
    $('#myBtn')
        .data('hasSuccessHandler', true)  // Prevent default alert
        .on('loaded.partialModal', function(event, modal) {
            console.log('Form loaded');
        })
        .on('success.partialModal', function(event, result) {
            alert('✓ Success: ' + result.message);
        })
        .on('error.partialModal', function(event, errorData) {
            alert('✗ Error: ' + errorData.message);
        });

    $('.modal-trigger').loadPartialModal();
</script>
```

## Configuration Options

### Programmatic Mode Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `url` | string | `''` | **Required.** URL to load the partial view |
| `method` | string | `'POST'` | HTTP method (GET/POST) |
| `data` | object | `{}` | Data to send to the server |
| `title` | string | `'Modal'` | Modal header title |
| `size` | string | `''` | Bootstrap modal size class (`modal-sm`, `modal-lg`, `modal-xl`) |
| `loadingText` | string | `'Loading...'` | Text shown while loading |
| `errorText` | string | `'Failed to load...'` | Error message text |
| `onLoaded` | function | `function() {}` | Callback after content is loaded |
| `onSubmit` | function | `null` | Callback for form submission |
| `onSuccess` | function | `null` | Callback after successful submission |
| `onError` | function | `null` | Callback on error |

### Data Attributes (Declarative Mode)

| Attribute | Description |
|-----------|-------------|
| `data-modal-url` | **Required.** URL to load the partial view |
| `data-modal-method` | HTTP method (default: POST) |
| `data-modal-title` | Modal header title |
| `data-modal-size` | Bootstrap size class (`modal-sm`, `modal-lg`, `modal-xl`) |
| `data-modal-data` | JSON string with data to send |
| `data-modal-submit-url` | URL for form submission (enables form handling) |
| `data-modal-on-loaded` | Name of global callback function for onLoaded |
| `data-modal-on-success` | Name of global callback function for onSuccess |
| `data-modal-on-error` | Name of global callback function for onError |
| `data-modal-loading-text` | Custom loading text |
| `data-modal-error-text` | Custom error message text |

## Events

The plugin triggers custom jQuery events that you can listen to:

### Event List

| Event | When Triggered | Parameters |
|-------|----------------|------------|
| `beforeLoad.partialModal` | Before modal starts loading (cancelable) | `settings` object |
| `loaded.partialModal` | After partial content is loaded | `modal` element |
| `success.partialModal` | After successful form submission (after modal is hidden) | `result` object |
| `error.partialModal` | On error (load or submit) | `errorData` object |

### Event Usage Examples

```javascript
// Before load - can be canceled
$('#myBtn').on('beforeLoad.partialModal', function(event) {
    if (!confirm('Load modal?')) {
        event.preventDefault(); // Cancel loading
    }
});

// After load
$('#myBtn').on('loaded.partialModal', function(event, modal) {
    console.log('Modal loaded:', modal);
});

// Success (after modal is hidden)
$('#myBtn').on('success.partialModal', function(event, result) {
    console.log('Success:', result);
});

// Error
$('#myBtn').on('error.partialModal', function(event, errorData) {
    console.error('Error:', errorData);
});
```

## ASP.NET Core Integration

### Controller Example

```csharp
public class HomeController : Controller
{
    // Load partial view (GET or POST)
    [HttpPost]
    public IActionResult UserDetails(int id)
    {
        var user = _userService.GetUser(id);
        return PartialView("_UserDetailsPartial", user);
    }

    // Load form
    [HttpGet]
    public IActionResult CreateProductForm()
    {
        return PartialView("_CreateProductPartial", new ProductViewModel());
    }

    // Handle form submission
    [HttpPost]
    public IActionResult CreateProduct(ProductViewModel model)
    {
        if (!ModelState.IsValid)
        {
            // Return partial with validation errors
            return PartialView("_CreateProductPartial", model);
        }

        // Save to database
        _productService.Create(model);

        // Return JSON success
        return Json(new { success = true, message = "Product created successfully" });
    }
}
```

### Partial View Example

```html
@model ProductViewModel

<form asp-action="CreateProduct" method="post">
    <div class="mb-3">
        <label asp-for="Name" class="form-label"></label>
        <input asp-for="Name" class="form-control" />
        <span asp-validation-for="Name" class="text-danger"></span>
    </div>
    
    <div class="mb-3">
        <label asp-for="Price" class="form-label"></label>
        <input asp-for="Price" type="number" step="0.01" class="form-control" />
        <span asp-validation-for="Price" class="text-danger"></span>
    </div>

    <!-- Footer content (will be moved to modal footer by plugin) -->
    <div class="modal-footer-content d-none">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
        <button type="submit" class="btn btn-primary">Create Product</button>
    </div>
</form>
```

**Note:** The `modal-footer-content` div with `d-none` class will be automatically moved to the modal footer by the plugin.

## Advanced Features

### Validation Handling

The plugin automatically handles server-side validation errors:

1. Controller returns PartialView with validation errors
2. Plugin detects HTML response (instead of JSON)
3. Modal content is updated with error messages
4. jQuery validation is re-initialized
5. Form handlers are re-attached

### Custom Success Handler

Prevent the default alert by providing a custom handler:

```javascript
// With global function
<button data-modal-on-success="myHandler">...</button>

// With jQuery event + data flag
$('#btn').data('hasSuccessHandler', true)
    .on('success.partialModal', function(event, result) {
        // Custom handling
    });
```

### Modal Lifecycle

1. **Click trigger** → `beforeLoad.partialModal` event
2. **Loading starts** → Spinner shown
3. **Content loaded** → `loaded.partialModal` event + `onLoaded` callback
4. **Form validation** → jQuery validation initialized
5. **Form submit** → AJAX call to server
6. **Success** → Modal hides → `success.partialModal` event + `onSuccess` callback
7. **Validation errors** → Form reloaded with errors
8. **Modal close** → Cleanup and dispose

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Dependencies

- jQuery 3.x
- Bootstrap 5.x
- jQuery Validation (optional, for client-side validation)
- jQuery Validation Unobtrusive (optional, for ASP.NET Core integration)

## Tips and Best Practices

### 1. Form Footer Placement

Use the `.modal-footer-content` class to define footer buttons inside your form:

```html
<div class="modal-footer-content d-none">
    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
    <button type="submit" class="btn btn-primary">Submit</button>
</div>
```

The plugin will automatically move this content to the modal footer.

### 2. Validation Integration

Ensure jQuery validation scripts are loaded for client-side validation:

```html
<script src="~/lib/jquery-validation/dist/jquery.validate.min.js"></script>
<script src="~/lib/jquery-validation-unobtrusive/jquery.validate.unobtrusive.min.js"></script>
```

### 3. Success Response Format

For successful form submissions, return JSON with this format:

```csharp
return Json(new { success = true, message = "Operation completed" });
```

For validation errors, return the partial view with the model:

```csharp
return PartialView("_FormPartial", model);
```

### 4. Event Delegation

For dynamically added elements, use event delegation:

```javascript
$(document).on('click', '.modal-trigger', function() {
    $(this).loadPartialModal();
});
```

Or initialize after adding elements:

```javascript
$('.dynamic-content').append('<button class="modal-trigger" ...>');
$('.modal-trigger').loadPartialModal();
```

## Troubleshooting

### Modal doesn't open

- Check console for JavaScript errors
- Verify URL is correct and returns HTML
- Ensure Bootstrap JS is loaded

### Form submission doesn't work

- Verify `data-modal-submit-url` is set (declarative mode)
- Check `onSubmit` callback is defined (programmatic mode)
- Ensure form has `asp-action` attribute

### Validation errors not showing

- Include jQuery validation scripts
- Return PartialView (not JSON) for validation errors
- Ensure model has validation attributes

### Double alerts on success

- Use `data('hasSuccessHandler', true)` when using jQuery events
- Or use global callback function instead

## License

MIT License - feel free to use in your projects!

## Author

**Paolo Gaetano**

- GitHub: [@gpaol](https://github.com/gpaol)

Created for ASP.NET Core + Bootstrap 5 + jQuery projects.

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.
