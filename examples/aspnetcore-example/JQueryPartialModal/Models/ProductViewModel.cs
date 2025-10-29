using System.ComponentModel.DataAnnotations;
namespace JQueryPartialModal.Models;

public class ProductViewModel
{
    public int Id { get; set; }
    
    [Required(ErrorMessage = "Product name is required")]
    public string Name { get; set; } = string.Empty;

    [Range(0.01, double.MaxValue, ErrorMessage = "Price must be positive")]
    public decimal Price { get; set; }
}