import { Injectable } from '@angular/core';

import { FilterState } from '@workshop/catalogue-types';

import { injectQueryParamsAdapter } from '@workshop/shared-util-router';

@Injectable()
export class CatalogueFiltersState {
  queryParams = injectQueryParamsAdapter<FilterState>({
    lightRequirements: 'array',
    plantProperty: 'string',
    plantType: 'string',
  });
}
