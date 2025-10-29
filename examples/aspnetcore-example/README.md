# ASP.NET Core Example - jQuery Partial Modal Plugin

This is a complete ASP.NET Core MVC example application demonstrating the jQuery Partial Modal plugin.

## Features Demonstrated

- ✅ Programmatic mode for loading user details
- ✅ Declarative mode with data attributes
- ✅ Form submission with AJAX
- ✅ Server-side validation handling
- ✅ Global callback functions
- ✅ jQuery event handlers
- ✅ Bootstrap 5 integration
- ✅ Responsive design

## Requirements

- .NET 9.0 SDK or later
- Modern web browser

## Running the Example

### Option 1: Visual Studio

1. Open `JQueryPartilaModalSolution.sln` in Visual Studio
2. Press F5 or click "Run"
3. The application will start at `https://localhost:5057`

### Option 2: Command Line

```bash
cd JQueryPartialModal
dotnet run
```

Then navigate to `https://localhost:5057` in your browser.

### Option 3: dotnet watch (Hot Reload)

```bash
cd JQueryPartialModal
dotnet watch run
```

This will enable hot reload for development.

## Project Structure

```
JQueryPartialModal/
├── Controllers/
│   └── HomeController.cs          # Main controller with modal actions
├── Models/
│   ├── UserViewModel.cs           # User model
│   ├── ProductViewModel.cs        # Product model with validation
│   └── ErrorViewModel.cs          # Error model
├── Views/
│   ├── Home/
│   │   ├── Index.cshtml           # Main page with examples
│   │   ├── Privacy.cshtml         # Privacy page
│   │   ├── _UserDetailsPartial.cshtml      # User details partial view
│   │   └── _CreateProductPartial.cshtml    # Product form partial view
│   └── Shared/
│       ├── _Layout.cshtml         # Main layout
│       └── _ValidationScriptsPartial.cshtml
└── wwwroot/
    ├── js/
    │   ├── jquery-partial-modal.js     # Plugin source
    │   └── jquery-partial-modal.min.js # Plugin minified
    ├── css/
    │   └── site.css               # Custom styles
    └── lib/                       # Client libraries (Bootstrap, jQuery, etc.)
```

## Examples in the Application

### 1. Programmatic Mode - Show User Details

Click "Show User Details" button to see a programmatic modal loading user data.

**JavaScript:**

```javascript
$('#showUserBtn').on('click', function () {
    $(this).loadPartialModal({
        url: '/Home/UserDetailsPartial',
        method: 'POST',
        data: { Id: 123 },
        title: 'User Profile',
        size: 'modal-lg'
    });
});
```

### 2. Programmatic Mode - Create Product

Click "Create New Product" to see a form with validation and AJAX submission.

**JavaScript:**

```javascript
$('#showProductBtn').on('click', function () {
    $(this).loadPartialModal({
        url: '/Home/CreateProductPartial',
        method: 'GET',
        title: 'Create Product',
        size: 'modal-md',
        onSubmit: function (formData, callback) {
            $.ajax({
                url: '/Home/CreateProduct',
                method: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                dataType: 'json',
                success: function (result) {
                    callback(result);
                    if (result.success) {
                        $('#partialModal').one('hidden.bs.modal', function () {
                            alert(result.message);
                        });
                    }
                },
                error: function (xhr) {
                    if (xhr.status === 200 && xhr.responseText) {
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

### 3. Declarative Mode - With Global Callbacks

Uses data attributes and global JavaScript functions.

**HTML:**

```html
<button class="btn btn-info modal-trigger" 
        data-modal-url="/Home/UserDetailsPartial"
        data-modal-method="POST"
        data-modal-title="User Profile (Declarative)"
        data-modal-size="modal-lg"
        data-modal-data='{"Id": 222}'
        data-modal-on-loaded="myUserLoadedCallback">
    Show User Details 2
</button>
```

### 4. Declarative Mode - With jQuery Events

Uses jQuery events instead of global callbacks for better code organization.

**HTML:**

```html
<button id="userBtn3" class="modal-trigger" 
        data-modal-url="/Home/UserDetailsPartial"
        data-modal-method="POST"
        data-modal-title="User Profile (Event)"
        data-modal-size="modal-lg"
        data-modal-data='{"Id": 333}'>
    Show User Details 3
</button>
```

**JavaScript:**

```javascript
$('#userBtn3').on('loaded.partialModal', function(event, modal) {
    console.log("User loaded via jQuery event!");
});
```

## Controller Actions

### UserDetailsPartial

Returns a partial view with user information.

```csharp
[HttpPost]
public IActionResult UserDetailsPartial(UserViewModel model)
{
    model.Name = $"User #{model.Id}";
    model.Email = $"user{model.Id}@example.com";
    return PartialView("_UserDetailsPartial", model);
}
```

### CreateProductPartial

Returns an empty form for creating a product.

```csharp
[HttpGet]
public IActionResult CreateProductPartial()
{
    return PartialView("_CreateProductPartial", new ProductViewModel());
}
```

### CreateProduct

Handles form submission with validation.

```csharp
[HttpPost]
public IActionResult CreateProduct(ProductViewModel model)
{
    if (!ModelState.IsValid)
    {
        // Return partial with validation errors
        return PartialView("_CreateProductPartial", model);
    }

    // Success - return JSON
    return Json(new { 
        success = true, 
        message = $"Product '{model.Name}' created successfully!" 
    });
}
```

## Customization

### Changing Port

Edit `Properties/launchSettings.json` to change the port:

```json
"applicationUrl": "https://localhost:YOUR_PORT;http://localhost:YOUR_PORT"
```

### Adding More Examples

1. Create a new partial view in `Views/Home/`
2. Add a controller action in `HomeController.cs`
3. Add a button in `Index.cshtml` with the modal trigger

## Troubleshooting

### Port Already in Use

If you get a port conflict error:

- Change the port in `launchSettings.json`
- Or stop the process using the port

### Plugin Not Loading

Make sure the plugin files are in `wwwroot/js/`:

- `jquery-partial-modal.js`
- `jquery-partial-modal.min.js`

### Validation Not Working

Ensure these scripts are loaded in `_Layout.cshtml`:

```html
<script src="~/lib/jquery-validation/jquery.validate.min.js"></script>
<script src="~/lib/jquery-validation-unobtrusive/jquery.validate.unobtrusive.min.js"></script>
```

## Learn More

- [Plugin Documentation](../../README.md)
- [API Reference](../../docs/api-reference.md)
- [Getting Started Guide](../../docs/getting-started.md)

## License

MIT License - see [LICENSE](../../LICENSE) for details
