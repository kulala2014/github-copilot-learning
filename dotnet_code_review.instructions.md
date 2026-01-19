---
alwaysApply: true
applyTo: "**/*.cs"
description: Code review guidelines for .NET Framework 4.7
---

# .NET Framework 4.7 Code Review Guidelines

## Naming Conventions

- Use PascalCase for class names, method names, and public properties
- Use camelCase for private fields and local variables
- Prefix private fields with underscore: `_fieldName`
- Use meaningful and descriptive names that convey purpose
- Interface names should start with 'I': `IRepository`, `IService`
- Avoid abbreviations unless they are widely understood (e.g., `Id`, `Url`)

## Code Structure

- Keep methods small and focused on a single responsibility
- Limit method length to 50 lines when possible
- Use proper access modifiers (public, private, protected, internal)
- Organize class members in this order:
  1. Fields
  2. Constructors
  3. Properties
  4. Public methods
  5. Private methods
- Use regions sparingly, only for large files

## Error Handling

- Use try-catch blocks appropriately, don't catch generic Exception
- Always log exceptions with proper context
- Use specific exception types (ArgumentNullException, InvalidOperationException)
- Provide meaningful error messages
- Clean up resources using `using` statements or try-finally blocks
- Validate input parameters and throw appropriate exceptions early

## Best Practices

- Use `async/await` for asynchronous operations (available in .NET 4.7)
- Prefer LINQ for collection operations over manual loops
- Use `StringBuilder` for string concatenation in loops
- Implement `IDisposable` for classes that use unmanaged resources
- Use dependency injection for loose coupling
- Follow SOLID principles
- Avoid nested loops when possible for better performance
- Use `ConfigureAwait(false)` in library code to avoid deadlocks

## Security

- Never hardcode credentials or sensitive data
- Use parameterized queries or ORM to prevent SQL injection
- Validate and sanitize all user inputs
- Use encryption for sensitive data storage
- Implement proper authentication and authorization
- Log security-related events without exposing sensitive information

## Comments and Documentation

- Add XML documentation comments for public APIs:
  ```csharp
  /// <summary>
  /// Brief description of method purpose
  /// </summary>
  /// <param name="paramName">Description of parameter</param>
  /// <returns>Description of return value</returns>
  ```
- Use inline comments to explain complex logic, not obvious code
- Keep comments up-to-date with code changes
- Use TODO comments for planned improvements with tickets: `// TODO [TICKET-123]: Description`

## Performance Considerations

- Use `StringBuilder` instead of string concatenation in loops
- Avoid unnecessary boxing/unboxing operations
- Use lazy initialization for expensive objects when appropriate
- Dispose of `IDisposable` objects properly to prevent memory leaks
- Consider using object pooling for frequently allocated objects
- Use appropriate collection types (List vs Array vs Dictionary)
- Avoid multiple enumeration of IEnumerable

## Testing

- Write unit tests for all public methods and business logic
- Use meaningful test method names: `MethodName_Scenario_ExpectedResult`
- Follow AAA pattern: Arrange, Act, Assert
- Mock external dependencies using interfaces
- Aim for high code coverage (80%+) but focus on critical paths
- Test edge cases and error conditions

## Code Quality

- Remove unused using statements and dead code
- Avoid magic numbers, use named constants or enums
- Keep cyclomatic complexity low (under 10 per method)
- Use early returns to reduce nesting
- Follow DRY principle (Don't Repeat Yourself)
- Run static code analysis tools and address warnings
- Ensure code compiles without warnings

## .NET Framework 4.7 Specific

- Leverage C# 7.x features when appropriate (tuples, pattern matching)
- Use `ValueTuple` for returning multiple values
- Take advantage of improved GC and performance enhancements
- Use `Span<T>` and `Memory<T>` for high-performance scenarios
- Ensure compatibility with .NET Framework 4.7 APIs
- Be aware of .NET Framework 4.7 limitations compared to .NET Core

## Example of Well-Reviewed Code

```csharp
/// <summary>
/// Calculates the area of a circle given its radius.
/// </summary>
/// <param name="radius">The radius of the circle (must be positive)</param>
/// <returns>The calculated area</returns>
/// <exception cref="ArgumentException">
/// Thrown when radius is negative
/// </exception>
public double CalculateCircleArea(double radius)
{
  if (radius < 0)
  {
    throw new ArgumentException(
      "Radius must be non-negative", 
      nameof(radius)
    );
  }

  return Math.PI * radius * radius;
}
```
