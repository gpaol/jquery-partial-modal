namespace JQueryPartialModal.Models;

/// <summary>
/// Represents an error view model used to display error information in the application.
/// </summary>
public class ErrorViewModel
{
    /// <summary>
    /// Gets or sets the unique request identifier associated with the error.
    /// </summary>
    /// <value>The request ID string, or null if not available.</value>
    public string? RequestId { get; set; }

    /// <summary>
    /// Gets a value indicating whether the request ID should be displayed.
    /// </summary>
    /// <value>True if the RequestId is not null or empty; otherwise, false.</value>
    public bool ShowRequestId => !string.IsNullOrEmpty(RequestId);
}
