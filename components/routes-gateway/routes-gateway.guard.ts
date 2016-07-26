import { CanActivate, ActivatedRouteSnapshot, Router, UrlPathWithParams } from '@angular/router';
import { Injectable } from '@angular/core';
import { ContenfulContent } from '../contentful/contentful-content.service';
import { ContentfulNodePage } from '../contentful/aliases.structures';
import { NodePageContent } from '../contentful/content-type.structures';
import { RoutesManagerService } from './routes-manager.service';
import * as _ from 'lodash';
import { appInjector } from '../contentful/app-injector.tool';

@Injectable()
export class RoutesGatewayGuard implements CanActivate {
  private router: Router;
  private routesManager: RoutesManagerService;
  private contentfulContent: ContenfulContent;

  public constructor(router: Router,
                     contentfulContent: ContenfulContent) {
    this.router = router;
    this.contentfulContent = contentfulContent;
    // FIXME: Using appInjector because of some kind of cyclic dependency in which RoutesManagerService is involved
    this.routesManager = appInjector().get(RoutesManagerService);
  }

  public canActivate(route: ActivatedRouteSnapshot): boolean {
    const paths: string[] = route.url.map((url: UrlPathWithParams) => url.path);
    const firstPath: string = _.first(paths);
    const lastPath: string = _.last(paths);

    this.parentOf(firstPath, lastPath, paths.length - 1, paths, new Map<string, string>());
    return false;
  }

  private parentOf(firstSlug: string, lastSlug: string, lastSlugIndex: number, slugs: string[], titles: Map<string, string>): void {
    if (!slugs.length) {
      this.registerRoutes(this.collectAllPossiblePaths(slugs), titles);
      return;
    }

    this.contentfulContent
      .getNodePage(lastSlug)
      .subscribe(
        (contentfulNodePage: ContentfulNodePage[]) => {
          if (!_.isEmpty(contentfulNodePage)) {
            let nodePageContent: NodePageContent = _.first(contentfulNodePage).fields;
            titles.set(nodePageContent.slug, nodePageContent.title);
            if (nodePageContent.parent) {
              if (nodePageContent.parent.fields.slug !== slugs[lastSlugIndex - 1]) {
                slugs[lastSlugIndex - 1] = nodePageContent.parent.fields.slug;
              }
              if (nodePageContent.slug === firstSlug) {
                this.router.navigate(['/']);
                return;
              }
              return this.parentOf(firstSlug, nodePageContent.parent.fields.slug, lastSlugIndex - 1, slugs, titles);
            }

            this.registerRoutes(this.collectAllPossiblePaths(slugs), titles);
            return;
          }
          if (_.isEmpty(contentfulNodePage) || _.first(contentfulNodePage).fields.slug !== slugs.pop()) {
            this.router.navigate(['/']);
            return;
          }
        });
  }

  private registerRoutes(allPossiblePaths: string[], titles: Map<string, string>): any {
    _.forEach(allPossiblePaths, (path: string) => {

      let currentTitle = path.split('/').pop();
      this.routesManager.addRoute(path, {name: titles.get(currentTitle)});
    });
    const lastPossiblePath = _.last(allPossiblePaths);
    const name = this.routesManager.getRouteName(lastPossiblePath);
    this.router.navigate([name]);
  }

  private collectAllPossiblePaths(pathFragments: string[]): string[] {
    const collectedPaths: string[] = [];
    collectedPaths.push(_.first(pathFragments));
    pathFragments.reduce(function (a: string, b: string): string {
      collectedPaths.push(`${a}/${b}`);
      return `${a}/${b}`;
    });
    return collectedPaths;
  }
}
