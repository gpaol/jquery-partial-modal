using System.Diagnostics;
using JQueryPartialModal.Models;
using Microsoft.AspNetCore.Mvc;

namespace JQueryPartialModal.Controllers;

public class HomeController : Controller
{
    private readonly ILogger<HomeController> _logger;

    public HomeController(ILogger<HomeController> logger)
    {
        _logger = logger;
    }

    public IActionResult Index()
    {
        return View();
    }

    public IActionResult Privacy()
    {
        return View();
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }

    // Returns user details partial (with populated model)
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

    // Returns empty product creation form
    [HttpGet]
    public IActionResult CreateProductPartial()
    {
        return PartialView("_CreateProductPartial", new ProductViewModel());
    }

    // Handles product form submission
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
