import { CanActivate, ActivatedRouteSnapshot, Router, UrlSegment } from '@angular/router';
import { Injectable } from '@angular/core';
import { ContenfulContent } from '../contentful/contentful-content.service';
import { ContentfulNodePage } from '../contentful/aliases.structures';
import { NodePageContent } from '../contentful/content-type.structures';
import { RoutesManagerService } from './routes-manager.service';
import * as _ from 'lodash';
import { Http, Response } from '@angular/http';

@Injectable()
export class RoutesGatewayGuard implements CanActivate {
  private router: Router;
  private routesManager: RoutesManagerService;
  private contentfulContent: ContenfulContent;
  private http: Http;

  public constructor(router: Router,
                     http: Http,
                     routesManager: RoutesManagerService,
                     contentfulContent: ContenfulContent) {
    this.router = router;
    this.http = http;
    this.contentfulContent = contentfulContent;
    // FIXME: Using appInjector because of some kind of cyclic dependency in which RoutesManagerService is involved
    // this.routesManager = appInjector().get(RoutesManagerService);
    this.routesManager = routesManager;
  }

  public canActivate(route: ActivatedRouteSnapshot): boolean {
    const paths: string[] = route.url.map((url: UrlSegment) => url.path);
    const firstPath: string = _.first(paths);
    const lastPath: string = _.last(paths);

    // this help in debugging routes that was not registered during regular site navigation
    // console.debug('GUARD ACTIVATED:', paths.join('/'));

    this.parentOf(firstPath, lastPath, paths.length - 1, paths, new Map<string, any>());
    return false;
  }

  private parentOf(firstSlug: string, lastSlug: string, lastSlugIndex: number, slugs: string[], data: Map<string, any>): void {
    if (!slugs.length) {
      this.registerRoutes(this.collectAllPossiblePaths(slugs), data);
      return;
    }

    this.contentfulContent
      .getNodePage(lastSlug)
      .subscribe(
        (contentfulNodePage: ContentfulNodePage[]) => {
          if (!_.isEmpty(contentfulNodePage)) {
            let article: NodePageContent = _.first(contentfulNodePage).fields;

            data.set(article.slug, {name: article.title});
            if (article.parent) {

              if (!slugs[lastSlugIndex - 1]) {
                slugs.unshift(article.parent.fields.slug);
                firstSlug = article.parent.fields.slug;
              } else if (article.parent.fields.slug !== slugs[lastSlugIndex - 1]) {
                slugs[lastSlugIndex - 1] = article.parent.fields.slug;
              }

              if (article.parent.fields.slug !== slugs[lastSlugIndex - 1]) {
                slugs[lastSlugIndex - 1] = article.parent.fields.slug;
              }
              if (article.slug === firstSlug) {
                this.router.navigate(['/']);
                return;
              }
              return this.parentOf(firstSlug, article.parent.fields.slug, lastSlugIndex - 1, slugs, data);
            } else {
              slugs = this.cleanPathFromDuplicateConsequentSlugs(article.slug, slugs);
            }

            this.registerRoutes(this.collectAllPossiblePaths(slugs), data);
            return;
          }
          if (_.isEmpty(contentfulNodePage) || _.first(contentfulNodePage).fields.slug !== slugs.pop()) {
            const path = slugs.join('/');
            this.checkArchive(path);
            return;
          }
        });
  }

  private cleanPathFromDuplicateConsequentSlugs(currentSlug: string, slugs: string[]): string[] {
    return _.slice(slugs, _.findLastIndex(slugs, (slug: string) => currentSlug === slug));
  }

  private registerRoutes(allPossiblePaths: string[], data: Map<string, any>): any {
    _.forEach(allPossiblePaths, (path: string) => {

      let currentTitle = path.split('/').pop();
      this.routesManager.addRoute({path, data: data.get(currentTitle)});
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

  private checkArchive(url: string): any {
    const encodedUrl = encodeURIComponent(url);

    this.http.get(`/check-url?url=${encodedUrl}`)
      .map((res: Response) => res.json())
      .subscribe((res: ArchiveCheckResult) => {
        if (res.statusCode === 200) {
          window.location.href = `//archive.gapminder.org/${url}`;
        } else {
          this.router.navigate(['/']);
        }
      });
  }
}

interface ArchiveCheckResult {
  statusCode: number;
}
