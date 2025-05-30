﻿using ECondo.Application.Data;
using ECondo.Application.Data.Property;
using ECondo.Domain.Shared;

namespace ECondo.Application.Queries.Properties.GetForUser;

public record GetPropertiesForUserQuery(int Page, int PageSize) 
    : IQuery<PagedList<PropertyOccupantResult>>;