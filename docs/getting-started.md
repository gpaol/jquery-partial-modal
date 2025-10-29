# Getting Started

## Installation

### Step 1: Include Dependencies

First, make sure you have jQuery and Bootstrap 5 in your project:

```html
<!-- jQuery -->
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>

<!-- Bootstrap 5 CSS -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">

<!-- Bootstrap 5 JS -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
```

### Step 2: Include the Plugin

Add the jQuery Partial Modal plugin after jQuery and Bootstrap:

```html
<script src="https://cdn.jsdelivr.net/gh/gpaol/jquery-partial-modal@main/dist/jquery-partial-modal.min.js"></script>
```

Or download and host it locally:

```html
<script src="path/to/jquery-partial-modal.min.js"></script>
```

## Basic Usage

### Programmatic Mode

The simplest way to use the plugin is programmatically:

```html
<button id="showUserBtn" class="btn btn-primary">Show User Details</button>

<script>
$('#showUserBtn').on('click', function() {
    $(this).loadPartialModal({
        url: '/Home/UserDetails',
        method: 'POST',
        data: { id: 123 },
        title: 'User Profile',
        size: 'modal-lg'
    });
});
</script>
```

### Declarative Mode

For simpler scenarios, use data attributes:

```html
<button class="btn btn-primary modal-trigger" 
        data-modal-url="/Home/UserDetails"
        data-modal-method="POST"
        data-modal-title="User Profile"
        data-modal-size="modal-lg"
        data-modal-data='{"id": 123}'>
    Show User Details
</button>

<script>
$(document).ready(function() {
    $('.modal-trigger').loadPartialModal();
});
</script>
```

## ASP.NET Core Setup

### Controller

Create a controller action that returns a partial view:

```csharp
using Microsoft.AspNetCore.Mvc;

public class HomeController : Controller
{
    [HttpPost]
    public IActionResult UserDetails(int id)
    {
        var user = new UserViewModel 
        { 
            Id = id, 
            Name = "John Doe", 
            Email = "john@example.com" 
        };
        
        return PartialView("_UserDetailsPartial", user);
    }
}
```

### Partial View

Create a partial view (e.g., `_UserDetailsPartial.cshtml`):

```html
@model UserViewModel

<div class="row g-3">
    <div class="col-md-6">
        <strong>User ID:</strong> @Model.Id
    </div>
    <div class="col-md-6">
        <strong>Name:</strong> @Model.Name
    </div>
    <div class="col-md-12">
        <strong>Email:</strong> @Model.Email
    </div>

    <!-- Footer buttons (optional) -->
    <div class="modal-footer-content d-none">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
    </div>
</div>
```

## Form Handling

### Controller with Form

```csharp
[HttpGet]
public IActionResult CreateProductForm()
{
    return PartialView("_CreateProductPartial", new ProductViewModel());
}

[HttpPost]
public IActionResult CreateProduct(ProductViewModel model)
{
    if (!ModelState.IsValid)
    {
        return PartialView("_CreateProductPartial", model);
    }

    // Save to database
    _productService.Create(model);

    return Json(new { success = true, message = "Product created successfully" });
}
```

### Form Partial View

```html
@model ProductViewModel

<form asp-action="CreateProduct" method="post">
    <div class="mb-3">
        <label asp-for="Name" class="form-label"></label>
        <input asp-for="Name" class="form-control" />
        <span asp-validation-for="Name" class="text-danger"></span>
    </div>

    <div class="modal-footer-content d-none">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
        <button type="submit" class="btn btn-primary">Create</button>
    </div>
</form>
```

### JavaScript

```html
<button id="createBtn" class="btn btn-success">Create Product</button>

<script>
$('#createBtn').on('click', function() {
    $(this).loadPartialModal({
        url: '/Home/CreateProductForm',
        method: 'GET',
        title: 'Create Product',
        onSubmit: function(formData, callback) {
            $.ajax({
                url: '/Home/CreateProduct',
                method: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function(result) {
                    callback(result);
                    if (result.success) {
                        $('#partialModal').one('hidden.bs.modal', function() {
                            alert(result.message);
                        });
                    }
                },
                error: function(xhr) {
                    if (xhr.status === 200 && xhr.responseText) {
                        callback({ success: false, html: xhr.responseText });
                    }
                }
            });
        }
    });
});
</script>
```

## Next Steps

- Read the [API Reference](api-reference.md) for all available options
- Check out [Examples](examples.md) for more use cases
- Learn about [ASP.NET Core Integration](aspnetcore-integration.md) best practices
