using System.Linq.Expressions;

namespace SmartTourism.Api.Repositories.Interfaces;

/// <summary>
/// Thin generic repository over EF Core's DbSet. Kept intentionally small —
/// most read-heavy, multi-join queries live directly in the relevant
/// Service using IQueryable rather than being forced through here, so this
/// interface doesn't balloon into a leaky abstraction over LINQ.
/// </summary>
public interface IRepository<TEntity> where TEntity : class
{
    IQueryable<TEntity> Query(bool asNoTracking = true);

    Task<TEntity?> GetByIdAsync(object id, CancellationToken cancellationToken = default);

    Task<TEntity?> FirstOrDefaultAsync(Expression<Func<TEntity, bool>> predicate, CancellationToken cancellationToken = default);

    Task<bool> AnyAsync(Expression<Func<TEntity, bool>> predicate, CancellationToken cancellationToken = default);

    Task AddAsync(TEntity entity, CancellationToken cancellationToken = default);

    void Update(TEntity entity);

    void Remove(TEntity entity);
}
