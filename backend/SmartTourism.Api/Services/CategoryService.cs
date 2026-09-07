using Microsoft.EntityFrameworkCore;
using SmartTourism.Api.DTOs.Catalog;
using SmartTourism.Api.Exceptions;
using SmartTourism.Api.Models.Catalog;
using SmartTourism.Api.Repositories;
using SmartTourism.Api.Services.Interfaces;

namespace SmartTourism.Api.Services;

public class CategoryService : ICategoryService
{
    private readonly IUnitOfWork _unitOfWork;

    public CategoryService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<IReadOnlyList<CategoryDto>> GetAllAsync(CancellationToken ct = default)
    {
        return await _unitOfWork.Categories.Query()
            .Where(c => c.IsActive)
            .OrderBy(c => c.Label)
            .Select(c => new CategoryDto(c.Id, c.Slug, c.Label, c.Icon))
            .ToListAsync(ct);
    }

    public async Task<CategoryDto> GetByIdAsync(int id, CancellationToken ct = default)
    {
        var category = await _unitOfWork.Categories.GetByIdAsync(id, ct)
            ?? throw new NotFoundException("Category", id);

        return new CategoryDto(category.Id, category.Slug, category.Label, category.Icon);
    }

    public async Task<CategoryDto> CreateAsync(CategoryCreateDto dto, CancellationToken ct = default)
    {
        var slug = dto.Slug.Trim();
        if (await _unitOfWork.Categories.AnyAsync(c => c.Slug == slug, ct))
        {
            throw new ConflictException($"A category with slug '{slug}' already exists.");
        }

        var category = new Category
        {
            Slug = slug,
            Label = dto.Label.Trim(),
            Icon = dto.Icon,
            IsActive = true
        };

        await _unitOfWork.Categories.AddAsync(category, ct);
        await _unitOfWork.SaveChangesAsync(ct);

        return new CategoryDto(category.Id, category.Slug, category.Label, category.Icon);
    }

    public async Task<CategoryDto> UpdateAsync(int id, CategoryUpdateDto dto, CancellationToken ct = default)
    {
        var category = await _unitOfWork.Categories.Query(asNoTracking: false).FirstOrDefaultAsync(c => c.Id == id, ct)
            ?? throw new NotFoundException("Category", id);

        category.Label = dto.Label.Trim();
        category.Icon = dto.Icon;
        category.IsActive = dto.IsActive;

        await _unitOfWork.SaveChangesAsync(ct);

        return new CategoryDto(category.Id, category.Slug, category.Label, category.Icon);
    }

    public async Task DeleteAsync(int id, CancellationToken ct = default)
    {
        var category = await _unitOfWork.Categories.Query(asNoTracking: false).FirstOrDefaultAsync(c => c.Id == id, ct)
            ?? throw new NotFoundException("Category", id);

        category.IsActive = false;
        await _unitOfWork.SaveChangesAsync(ct);
    }
}
