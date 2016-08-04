import { Component, OnInit, Inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { Angulartics2On } from 'angulartics2';
import { Menu } from '../../contentful/content-type.structures';
import { MenuService } from '../menu.service';
import { RoutesManagerService } from '../../routes-gateway/routes-manager.service';

@Component({
  selector: 'gm-footer-menu',
  template: require('./footer.html') as string,
  directives: [ROUTER_DIRECTIVES, Angulartics2On],
  styles: [require('./footer.css') as string],
  pipes: [AsyncPipe]
})
export class FooterMenuComponent implements OnInit {
  private menus: Menu[];
  private contentfulTypeIds: any;
  private tagSlug: string = 'gapminder-org';
  private menuService: MenuService;
  private routesManager: RoutesManagerService;

  public constructor(menuService: MenuService,
                     @Inject('ContentfulTypeIds') contentfulTypeIds: any,
                     routesManager: RoutesManagerService) {
    this.contentfulTypeIds = contentfulTypeIds;
    this.menuService = menuService;
    this.routesManager = routesManager;
  }

  public ngOnInit(): void {
    this.menuService
      .getMenus(this.contentfulTypeIds.FOOTER_TYPE_ID, this.tagSlug)
      .subscribe((menus: Menu[]) => {
        this.menuService.addRoutes(menus);
        this.menus = menus;
      });
  }
}
