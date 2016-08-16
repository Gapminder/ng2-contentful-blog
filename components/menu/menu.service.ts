import { Injectable, Inject } from '@angular/core';
import * as _ from 'lodash';
import {
  ContentfulTagPage,
  ContentfulMenu,
  ContentfulNodePage,
  ContentfulSubmenu,
  ContentfulFooterHeader
} from '../contentful/aliases.structures';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/from';
import { ContenfulContent } from '../contentful/contentful-content.service';
import { Menu, FooterMenu, NodePageContent } from '../contentful/content-type.structures';
import { RoutesManagerService, RawRoute } from '../routes-gateway/routes-manager.service';
import { ContentfulSocial } from '../contentful/aliases.structures';

@Injectable()
export class MenuService {
  private routesManager: RoutesManagerService;
  private contentfulContentService: ContenfulContent;
  private constants: any;
  private contentfulTypeIds: any;

  public constructor(contentfulContentService: ContenfulContent,
                     @Inject('Constants') constants: any,
                     @Inject('ContentfulTypeIds') contentfulTypeIds: any,
                     routesManager: RoutesManagerService) {
    this.routesManager = routesManager;
    this.contentfulContentService = contentfulContentService;
    this.constants = constants;
    this.contentfulTypeIds = contentfulTypeIds;
  }

  public getHeaderMenus(): Observable<Menu[]> {
    return this.getContentfulMenus(this.contentfulTypeIds.HEADER_TYPE_ID)
      .mergeMap((menu: ContentfulFooterHeader) => Observable.from(menu.fields.entries))
      .filter((menu: ContentfulMenu) => !_.isEmpty(menu))
      .toArray()
      .map((menus: ContentfulMenu[]) => _.map(menus, 'fields') as Menu[]);
  }

  public getFooterMenus(): Observable<FooterMenu> {
    return this.getContentfulMenus(this.contentfulTypeIds.FOOTER_TYPE_ID)
      .map((menu: ContentfulFooterHeader) => {
        const menus: Menu[] = _.chain(menu.fields.entries)
          .compact()
          .map('fields')
          .value() as Menu[];

        const social: ContentfulSocial = menu.fields.social;

        const description: string = menu.fields.description;
        return {
          menus,
          social,
          description
        };
      });
  }

  public addRoutes(menus: Menu[]): void {
    const rawRoutes: RawRoute[] = [];
    _.forEach(menus, (menu: Menu) => {
      if (menu.entryPoint) {
        const article: ContentfulNodePage = menu.entryPoint;
        const cover = article.fields.cover ? article.fields.cover.sys.id : undefined;
        rawRoutes.push({path: article.fields.slug, data: {name: menu.title, cover}});
      }

      _.forEach(menu.submenus, (submenu: ContentfulSubmenu) => {
        const article: NodePageContent = submenu.fields.entryPoint.fields;
        const cover = article.cover ? article.cover.sys.id : undefined;
        rawRoutes.push({
          path: article.slug,
          data: {name: article.title, cover}
        });
      });
    });
    this.routesManager.addRoutes(rawRoutes);
  }

  private getContentfulMenus(menuType: string): Observable<ContentfulFooterHeader> {
    return this.contentfulContentService
      .getTagsBySlug(this.constants.PROJECT_TAG)
      .map((tags: ContentfulTagPage[]) => _.first(_.map(tags, 'sys.id')))
      .mergeMap((tagSysId: string) => this.contentfulContentService.getMenuByTag(menuType, tagSysId))
      .map((menus: ContentfulFooterHeader[]) => _.first(menus));
  }
}
