import { Component, OnInit, Inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { Angulartics2On } from 'angulartics2';
import { ContenfulContent } from '../../contentful/contentful-content.service';
import { Menu } from '../../contentful/content-type.structures';
import { ContentfulMenu } from '../../contentful/aliases.structures';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { RoutesManagerService } from '../../routes-gateway/routes-manager.service';
import * as _ from 'lodash';

@Component({
  selector: 'gm-footer-menu',
  template: require('./footer.html') as string,
  directives: [ROUTER_DIRECTIVES, Angulartics2On],
  styles: [require('./footer.css') as string],
  pipes: [AsyncPipe]
})
export class FooterMenuComponent implements OnInit {
  private menus: Menu[];
  private contentfulContentService: ContenfulContent;
  private routesManager: RoutesManagerService;
  private contentfulTypeIds: any;

  public constructor(contentfulContentService: ContenfulContent,
                     @Inject('ContentfulTypeIds') contentfulTypeIds: any,
                     routesManager: RoutesManagerService) {
    this.contentfulContentService = contentfulContentService;
    this.routesManager = routesManager;
    this.contentfulTypeIds = contentfulTypeIds;
  }

  public ngOnInit(): void {
    this.contentfulContentService
      .getMenu(this.contentfulTypeIds.FOOTER_TYPE_ID)
      .subscribe((menus: ContentfulMenu[]) => {
        if (!_.isEmpty(menus)) {
          this.menus = menus[0].fields.entries;
          for (let menu of this.menus) {
            if (menu.fields.entryPoint) {
              this.routesManager.addRoute(menu.fields.entryPoint.fields.slug, {name: menu.fields.entryPoint.fields.title});
            }
          }
        }
      });
  }
}
