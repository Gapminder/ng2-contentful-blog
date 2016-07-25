import { Component, OnInit, Inject } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { CollapseDirective, DROPDOWN_DIRECTIVES } from 'ng2-bootstrap';
import { Angulartics2On } from 'angulartics2';
import { ContenfulContent } from '../../contentful/contentful-content.service';
import { Menu } from '../../contentful/content-type.structures';
import { ContentfulMenu } from '../../contentful/aliases.structures';
import { RoutesManagerService } from '../../routes-gateway/routes-manager.service';
import * as _ from 'lodash';

@Component({
  selector: 'gm-header-menu',
  template: require('./header.html') as string,
  styles: [require('./header.css') as string],
  directives: [CollapseDirective, DROPDOWN_DIRECTIVES, ROUTER_DIRECTIVES, Angulartics2On]
})
export class HeaderMenuComponent implements OnInit {
  private collapsed: boolean = true;
  private menus: Menu[];
  private contentfulContentService: ContenfulContent;
  private routesManager: RoutesManagerService;
  private contentfulTypeIds: any;

  public constructor(contentfulContentService: ContenfulContent,
                     @Inject('ContentfulTypeIds') contentfulTypeIds: any,
                     routesManager: RoutesManagerService) {
    this.contentfulTypeIds = contentfulTypeIds;
    this.contentfulContentService = contentfulContentService;
    this.routesManager = routesManager;
  }

  public ngOnInit(): void {
    this.contentfulContentService
      .getMenu(this.contentfulTypeIds.HEADER_TYPE_ID)
      .subscribe((menus: ContentfulMenu[]) => {
        if (!_.isEmpty(menus)) {
          this.menus = menus[0].fields.entries;
          for (let item of this.menus) {
            if (item.fields.entryPoint && !item.fields.submenus) {
              this.routesManager.addRoute(item.fields.entryPoint.fields.slug, {name: item.fields.entryPoint.fields.title});
            }
            if (item.fields.submenus && item.fields.entryPoint || item.fields.submenus) {
              for (let submenu of item.fields.submenus) {
                this.routesManager.addRoute(submenu.fields.entryPoint.fields.slug, {name: submenu.fields.entryPoint.fields.title});
              }
            }
          }
        }
      });
  }

}
