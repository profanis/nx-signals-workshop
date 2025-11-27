# Workshop

1. Install workspace

   > npx create-nx-workspace@latest

   TODO: add the terminal steps. What to select, what to type, etc
   TODO: have the app as zone-less

2. Install Angular Material

   > npm install @angular/material@20 @angular/cdk@20
   > npx nx g @angular/material:ng-add --project=workshop

3. configure MCP agents

   > npx nx configure-ai-agents
   > configure the copilot instructions based on this https://angular.dev/ai/develop-with-ai

4. Create the ui-hero library

5. Create the ui-product-card library

6. Create the feature-home library
  > npx nx g @nx/angular:library --name=feature-home --directory=libs/feature-home --importPath=@workspace/feature-home --no-interactive

7. Create the feature-catalogue library
  > npx nx g @nx/angular:library --name=feature-catalogue --directory=libs/feature-catalogue --importPath=@workspace/feature-catalogue --no-interactive

8. Create the ui-header library
  > npx nx g @nx/angular:library --name=ui-header --directory=libs/shared/ui/header --importPath=@workspace/shared/ui/ui-header --no-interactive
