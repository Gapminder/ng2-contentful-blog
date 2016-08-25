import { Injectable, Inject } from '@angular/core';
import * as _ from 'lodash';
import {
  ContentfulTagPage,
  ContentfulMenu,
  ContentfulFooterHeader,
  ContentfulSocial
} from '../contentful/aliases.structures';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/from';
import { ContenfulContent } from '../contentful/contentful-content.service';
import { Menu, FooterMenu } from '../contentful/content-type.structures';
import { RoutesManagerService } from '../routes-gateway/routes-manager.service';

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

        return {menus, social, description};
      });
  }

  private getContentfulMenus(menuType: string): Observable<ContentfulFooterHeader> {
    return this.contentfulContentService
      .getTagsBySlug(this.constants.PROJECT_TAG)
      .map((tags: ContentfulTagPage[]) => _.first(_.map(tags, 'sys.id')))
      .mergeMap((tagSysId: string) => this.contentfulContentService.getMenuByTag(menuType, tagSysId))
      .map((menus: ContentfulFooterHeader[]) => _.first(menus));
  }
}
