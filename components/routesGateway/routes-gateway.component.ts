import {Component} from '@angular/core';
import {CanActivate, ComponentInstruction, Router} from '@angular/router-deprecated';
import {appInjector} from '../contentfulService/app-injector.tool';
import {ContenfulContent} from '../contentfulService/contentful-content.service';
import {RoutesGatewayService} from './routes-gateway.service';
import {ContentfulNodePage} from '../contentfulService/aliases.structures';
import {NodePageContent} from '../contentfulService/content-type.structures';

import * as _ from 'lodash';

@Component({})
@CanActivate(checkRoute)
export class RoutesGatewayComponent {
}

function checkRoute(next: ComponentInstruction): boolean {
  const injector = appInjector();
  const router: Router = injector.get(Router);
  const routesGatewayService: RoutesGatewayService = injector.get(RoutesGatewayService);
  const contentfulContent: ContenfulContent = injector.get(ContenfulContent);

  const paths: string[] = next.urlPath.split('/');
  const firstPath: string = _.first(paths);
  const lastPath: string = _.last(paths);

  parentOf(lastPath, paths.length - 1, paths, new Map<string, string>());
  return false;

  function parentOf(lastSlug: string, lastSlugIndex: number, slugs: string[], titles: Map<string, string>): void {
    if (!slugs.length) {
      registerRoutes(collectAllPossiblePaths(slugs), titles);
      return;
    }

    contentfulContent
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
              if (nodePageContent.slug === firstPath) {
                router.navigate(['Root']);
                return;
              }
              return parentOf(nodePageContent.parent.fields.slug, lastSlugIndex - 1, slugs, titles);
            }

            registerRoutes(collectAllPossiblePaths(slugs), titles);
            return;
          }
          if (_.isEmpty(contentfulNodePage) || _.first(contentfulNodePage).fields.slug !== slugs.pop()) {
            router.navigate(['Root']);
            return;
          }
        });
  }

  function collectAllPossiblePaths(pathFragments: string[]): string[] {
    const collectedPaths: string[] = [];
    collectedPaths.push(_.first(pathFragments));
    pathFragments.reduce(function (a: string, b: string): string {
      collectedPaths.push(`${a}/${b}`);
      return `${a}/${b}`;
    });
    return collectedPaths;
  }

  function registerRoutes(allPossiblePaths: string[], titles: Map<string, string>): any {
    _.forEach(allPossiblePaths, (path: string) => {

      let currentTitle = path.split('/').pop();
      routesGatewayService.addRoute(path, {name: titles.get(currentTitle)});
    });
    const lastPossiblePath = _.last(allPossiblePaths);
    const name = routesGatewayService.getRouteName(lastPossiblePath);
    router.navigate([name]);
  }
}

