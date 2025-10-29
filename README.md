# jQuery Partial Modal Plugin

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![GitHub release](https://img.shields.io/github/release/gpaol/jquery-partial-modal.svg)](https://github.com/gpaol/jquery-partial-modal/releases)

A jQuery plugin to seamlessly load Bootstrap modals with ASP.NET Core partial views. Supports both programmatic and declarative approaches with built-in form submission handling and validation.

## ✨ Features

- ✅ **Dual Mode Support**: Programmatic (JavaScript) and Declarative (data attributes)
- ✅ **Form Handling**: Automatic form submission with AJAX and validation error display
- ✅ **Bootstrap 5 Compatible**: Works seamlessly with Bootstrap 5 modals
- ✅ **Event System**: Rich event system for lifecycle management
- ✅ **Callback Support**: Global functions and jQuery event handlers
- ✅ **Single Modal Instance**: Efficient DOM management with one reusable modal
- ✅ **Validation Integration**: Built-in jQuery validation support
- ✅ **Customizable**: Flexible configuration options

## 📦 Installation

### Via CDN

```html
<script src="https://cdn.jsdelivr.net/gh/gpaol/jquery-partial-modal@main/dist/jquery-partial-modal.min.js"></script>
```

### Via Download

Download the latest release from the [releases page](https://github.com/gpaol/jquery-partial-modal/releases) and include it in your project:

```html
<script src="path/to/jquery-partial-modal.min.js"></script>
```

### Prerequisites

Make sure you have jQuery and Bootstrap 5 included:

```html
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
```

## 🚀 Quick Start

### Programmatic Mode

```javascript
$('#myButton').on('click', function() {
    $(this).loadPartialModal({
        url: '/Home/UserDetails',
        method: 'POST',
        data: { id: 123 },
        title: 'User Profile',
        size: 'modal-lg'
    });
});
```

### Declarative Mode

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

## 📚 Documentation

- [Getting Started](docs/getting-started.md)
- [API Reference](docs/api-reference.md)
- [Examples](docs/examples.md)
- [ASP.NET Core Integration](docs/aspnetcore-integration.md)

## 💡 Examples

Check out the [examples folder](examples/) for complete working examples:

- [ASP.NET Core Example](examples/aspnetcore-example/) - Full ASP.NET Core MVC application

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Paolo Gaetano**

- GitHub: [@gpaol](https://github.com/gpaol)

## 🙏 Acknowledgments

Created for ASP.NET Core + Bootstrap 5 + jQuery projects.

## 📝 Changelog

See [CHANGELOG.md](CHANGELOG.md) for a list of changes.

## 🐛 Issues

Found a bug? Please [open an issue](https://github.com/gpaol/jquery-partial-modal/issues/new) with a detailed description and steps to reproduce.

## ⭐ Show Your Support

Give a ⭐️ if this project helped you!
