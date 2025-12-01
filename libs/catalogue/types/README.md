# catalogue-types

This library was generated with [Nx](https://nx.dev).

These types are used in the shared/ui-product-card as well. According to the module boundary rules, these types should be moved in the scope:shared.

Otherwise we get the error:
/Users/profanis/projects/temp/angular.love/workshop/libs/shared/ui/ui-product-card/src/lib/product-card.component.ts
12:1 error A project tagged with "scope:shared" can only depend on libs tagged with "scope:shared" @nx/enforce-module-boundaries

Solution A: Define the scope:shared in this library (not recommended)
Solution B: Move this library in shared library (recommended)
