using System.ComponentModel.DataAnnotations;
namespace JQueryPartialModal.Models;

/// <summary>
/// Represents a product view model used for product creation and display operations.
/// </summary>
public class ProductViewModel
{
    /// <summary>
    /// Gets or sets the unique identifier for the product.
    /// </summary>
    /// <value>The product ID as an integer.</value>
    public int Id { get; set; }

    /// <summary>
    /// Gets or sets the name of the product.
    /// </summary>
    /// <value>The product name. Cannot be null or empty.</value>
    [Required(ErrorMessage = "Product name is required")]
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the price of the product.
    /// </summary>
    /// <value>The product price as a decimal. Must be greater than 0.01.</value>
    [Range(0.01, double.MaxValue, ErrorMessage = "Price must be positive")]
    public decimal Price { get; set; }
}