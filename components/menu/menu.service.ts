import { Injectable, Inject } from '@angular/core';
import * as _ from 'lodash';
import {
  ContentfulTagPage, ContentfulMenu, ContentfulNodePage,
  ContentfulSubmenu
} from '../contentful/aliases.structures';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/from';
import { ContenfulContent } from '../contentful/contentful-content.service';
import { Menu } from '../contentful/content-type.structures';
import { RoutesManagerService } from '../routes-gateway/routes-manager.service';
import { RawRoute } from '../routes-gateway/routes-manager.service';

@Injectable()
export class MenuService {
  private routesManager: RoutesManagerService;
  private contentfulContentService: ContenfulContent;
  private projectTag: string;

  public constructor(contentfulContentService: ContenfulContent,
                     @Inject('ProjectTag') projectTag: string,
                     routesManager: RoutesManagerService) {
    this.routesManager = routesManager;
    this.contentfulContentService = contentfulContentService;
    this.projectTag = projectTag;
  }

  public getMenus(menuType: string): Observable<any[]> {
    return this.contentfulContentService
      .getTagsBySlug(this.projectTag)
      .map((tags: ContentfulTagPage[]) => _.map(tags, 'sys.id'))
      .mergeMap((tagSysIds: any) => this.contentfulContentService.getMenuByTag(menuType, tagSysIds))
      .map((menus: ContentfulMenu[]) => _.first(menus))
      .mergeMap((menu: ContentfulMenu) => Observable.from(menu.fields.entries))
      .filter((menu: ContentfulMenu) => !!menu)
      .toArray()
      .map((menus: ContentfulMenu[]) => _.map(menus, 'fields'));
  }

  public addRoutes(menus: Menu[]): void {
    const rawRoutes: RawRoute[] = [];
    _.forEach(menus, (menu: Menu) => {
      const article: ContentfulNodePage = menu.entryPoint;
      if (article) {
        rawRoutes.push({path: article.fields.slug, data: {name: menu.title}});
      }

      _.forEach(menu.submenus, (submenu: ContentfulSubmenu) => {
        rawRoutes.push({
          path: submenu.fields.entryPoint.fields.slug,
          data: {name: submenu.fields.entryPoint.fields.title}
        });
      });
    });
    this.routesManager.addRoutes(rawRoutes);
  }
}
