# Contributing to jQuery Partial Modal Plugin

First off, thank you for considering contributing to jQuery Partial Modal Plugin! It's people like you that make this plugin better for everyone.

## Code of Conduct

This project and everyone participating in it is governed by our commitment to providing a welcoming and inspiring community for all.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples**
- **Describe the behavior you observed and what you expected**
- **Include screenshots if possible**
- **Specify your browser and version**
- **Include jQuery and Bootstrap versions**

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

- **Use a clear and descriptive title**
- **Provide a detailed description of the suggested enhancement**
- **Provide specific examples to demonstrate the steps**
- **Describe the current behavior and explain the expected behavior**
- **Explain why this enhancement would be useful**

### Pull Requests

- Fill in the required template
- Do not include issue numbers in the PR title
- Include screenshots and animated GIFs in your pull request whenever possible
- Follow the JavaScript coding style
- Document new code
- End all files with a newline

## Development Setup

1. Fork the repository
2. Clone your fork:

   ```bash
   git clone https://github.com/your-username/jquery-partial-modal.git
   cd jquery-partial-modal
   ```

3. Create a branch for your feature or fix:

   ```bash
   git checkout -b feature/your-feature-name
   ```

4. Make your changes in the `src` directory

5. Test your changes with the example project in `examples/aspnetcore-example`

6. If you modify the source, update the `dist` files:
   - Update `dist/jquery-partial-modal.js`
   - Minify to `dist/jquery-partial-modal.min.js`

7. Commit your changes:

   ```bash
   git add .
   git commit -m "Add your descriptive commit message"
   ```

8. Push to your fork:

   ```bash
   git push origin feature/your-feature-name
   ```

9. Create a Pull Request from your fork to our `main` branch

## Coding Style

- Use 4 spaces for indentation
- Use camelCase for variable and function names
- Add comments for complex logic
- Keep functions focused and small
- Follow jQuery plugin best practices

## Testing

Before submitting a pull request:

1. Test with the ASP.NET Core example application
2. Test both programmatic and declarative modes
3. Test form submission and validation
4. Test all callback and event scenarios
5. Test on different browsers (Chrome, Firefox, Safari, Edge)

## Documentation

- Update README.md if needed
- Update API documentation in `docs/` if you change the API
- Add examples for new features
- Update CHANGELOG.md

## Questions?

Feel free to open an issue with your question or reach out to the maintainers.

## Recognition

Contributors will be recognized in the project README.

Thank you for contributing! 🎉
