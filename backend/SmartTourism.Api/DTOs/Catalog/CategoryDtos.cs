namespace SmartTourism.Api.DTOs.Catalog;

public record CategoryDto(int Id, string Slug, string Label, string? Icon);

public record CategoryCreateDto(string Slug, string Label, string? Icon);

public record CategoryUpdateDto(string Label, string? Icon, bool IsActive);
