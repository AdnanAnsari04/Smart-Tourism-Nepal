using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using SmartTourism.Api.Data;
using SmartTourism.Api.Repositories.Interfaces;

namespace SmartTourism.Api.Repositories;

public class Repository<TEntity> : IRepository<TEntity> where TEntity : class
{
    private readonly ApplicationDbContext _context;
    private readonly DbSet<TEntity> _dbSet;

    public Repository(ApplicationDbContext context)
    {
        _context = context;
        _dbSet = context.Set<TEntity>();
    }

    public IQueryable<TEntity> Query(bool asNoTracking = true)
        => asNoTracking ? _dbSet.AsNoTracking() : _dbSet;

    public async Task<TEntity?> GetByIdAsync(object id, CancellationToken cancellationToken = default)
        => await _dbSet.FindAsync(new[] { id }, cancellationToken);

    public async Task<TEntity?> FirstOrDefaultAsync(Expression<Func<TEntity, bool>> predicate, CancellationToken cancellationToken = default)
        => await _dbSet.FirstOrDefaultAsync(predicate, cancellationToken);

    public async Task<bool> AnyAsync(Expression<Func<TEntity, bool>> predicate, CancellationToken cancellationToken = default)
        => await _dbSet.AnyAsync(predicate, cancellationToken);

    public async Task AddAsync(TEntity entity, CancellationToken cancellationToken = default)
        => await _dbSet.AddAsync(entity, cancellationToken);

    public void Update(TEntity entity) => _dbSet.Update(entity);

    public void Remove(TEntity entity) => _dbSet.Remove(entity);
}
