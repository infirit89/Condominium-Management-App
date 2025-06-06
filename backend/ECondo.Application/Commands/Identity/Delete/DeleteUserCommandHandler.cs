﻿using ECondo.Application.Repositories;
using ECondo.Domain.Shared;
using ECondo.Domain.Users;
using Microsoft.EntityFrameworkCore;

namespace ECondo.Application.Commands.Identity.Delete;

internal sealed class DeleteUserCommandHandler
    (IApplicationDbContext dbContext)
    : ICommandHandler<DeleteUserCommand>
{
    public async Task<Result<EmptySuccess, Error>> Handle(
        DeleteUserCommand request, 
        CancellationToken cancellationToken)
    {
        var user = await dbContext
            .Users
            .FirstOrDefaultAsync(u => u.Email == request.Email, 
                cancellationToken: cancellationToken);
        
        if(user is null)
            return Result<EmptySuccess, Error>.Fail(UserErrors.InvalidUser(request.Email));

        dbContext.Users.Remove(user);
        await dbContext.SaveChangesAsync(cancellationToken);
        
        return Result<EmptySuccess, Error>.Ok();
    }
}