﻿using ECondo.Application.Repositories;
using ECondo.Application.Services;
using ECondo.Domain.Shared;
using Microsoft.EntityFrameworkCore;

namespace ECondo.Application.Commands.Payment.ConnectStripeAccount;

internal sealed class ConnectStripeAccountCommandHandler
    (IApplicationDbContext dbContext, IStripeService stripeService)
    : ICommandHandler<ConnectStripeAccountCommand, string>
{
    public async Task<Result<string, Error>> Handle(
        ConnectStripeAccountCommand request, 
        CancellationToken cancellationToken)
    {
        var entrance = await dbContext
            .Entrances
            .FirstAsync(e => 
                e.BuildingId == request.BuildingId && 
                e.Number == request.EntranceNumber, 
                cancellationToken: cancellationToken);

        string accountId = await stripeService.CreateExpressAccount();
        entrance.StripeAccountId = accountId;
        dbContext.Entrances.Update(entrance);
        await dbContext.SaveChangesAsync(cancellationToken);
        
        string accountLinkUrl = await stripeService.CreateOnboardingAccountLink(
            accountId, request.ReturnUri);
        
        return Result<string, Error>.Ok(accountLinkUrl);
    }
}