namespace JQueryPartialModal.Models;

/// <summary>
/// Represents a user view model used for displaying and managing user information.
/// </summary>
public class UserViewModel
{
    /// <summary>
    /// Gets or sets the unique identifier for the user.
    /// </summary>
    /// <value>The user ID as an integer.</value>
    public int Id { get; set; }

    /// <summary>
    /// Gets or sets the full name of the user.
    /// </summary>
    /// <value>The user's name as a string. Defaults to empty string.</value>
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the email address of the user.
    /// </summary>
    /// <value>The user's email address as a string. Defaults to empty string.</value>
    public string Email { get; set; } = string.Empty;
}
