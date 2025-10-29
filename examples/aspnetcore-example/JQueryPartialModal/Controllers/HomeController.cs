using System.Diagnostics;
using JQueryPartialModal.Models;
using Microsoft.AspNetCore.Mvc;

namespace JQueryPartialModal.Controllers;

/// <summary>
/// Main controller that handles home page requests and modal-related operations
/// for the jQuery Partial Modal plugin demonstration.
/// </summary>
public class HomeController : Controller
{
    private readonly ILogger<HomeController> _logger;

    /// <summary>
    /// Initializes a new instance of the <see cref="HomeController"/> class.
    /// </summary>
    /// <param name="logger">The logger instance for logging operations.</param>
    public HomeController(ILogger<HomeController> logger)
    {
        _logger = logger;
    }

    /// <summary>
    /// Displays the main home page with examples of the jQuery Partial Modal plugin.
    /// </summary>
    /// <returns>The Index view.</returns>
    public IActionResult Index()
    {
        return View();
    }

    /// <summary>
    /// Displays the privacy policy page.
    /// </summary>
    /// <returns>The Privacy view.</returns>
    public IActionResult Privacy()
    {
        return View();
    }

    /// <summary>
    /// Displays the error page with request tracking information.
    /// </summary>
    /// <returns>The Error view with error details.</returns>
    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }

    /// <summary>
    /// Returns a partial view containing user details for display in a modal.
    /// </summary>
    /// <param name="model">The user view model containing the user ID to display details for.</param>
    /// <returns>A PartialViewResult containing the user details partial view with populated user data.</returns>
    [HttpPost]
    public IActionResult UserDetailsPartial(UserViewModel model)
    {
        // In production: Fetch data from database using model.Id
        var user = new UserViewModel
        {
            Id = model.Id,
            Name = "John Doe",
            Email = "john.doe@example.com"
        };

        return PartialView("_UserDetailsPartial", user);
    }

    /// <summary>
    /// Returns an empty product creation form for display in a modal.
    /// </summary>
    /// <returns>A PartialViewResult containing the product creation form with an empty ProductViewModel.</returns>
    [HttpGet]
    public IActionResult CreateProductPartial()
    {
        return PartialView("_CreateProductPartial", new ProductViewModel());
    }

    /// <summary>
    /// Handles the submission of the product creation form.
    /// </summary>
    /// <param name="model">The product view model containing the form data to be processed.</param>
    /// <returns>
    /// If the model is invalid, returns the partial view with validation errors.
    /// If the model is valid, returns a JSON result indicating success with the created product details.
    /// </returns>
    [HttpPost]
    public IActionResult CreateProduct(ProductViewModel model)
    {
        if (!ModelState.IsValid)
        {
            // Return partial with validation errors
            return PartialView("_CreateProductPartial", model);
        }

        // In production: Save to database
        model.Id = new Random().Next(1000, 9999); // Simulate DB-generated Id
        return Json(new { success = true, message = $"Product '{model.Name}' created successfully\nId: {model.Id}" });
    }

}
