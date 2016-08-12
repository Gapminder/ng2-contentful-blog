import { Component, OnInit, Inject } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { CollapseDirective, DROPDOWN_DIRECTIVES } from 'ng2-bootstrap';
import { Menu } from '../../contentful/content-type.structures';
import { MenuService } from '../menu.service';
import { RoutesManagerService } from '../../routes-gateway/routes-manager.service';

@Component({
  selector: 'gm-header-menu',
  template: require('./header-menu.html') as string,
  styles: [require('./header-menu.css') as string],
  directives: [CollapseDirective, DROPDOWN_DIRECTIVES, ROUTER_DIRECTIVES]
})
export class HeaderMenuComponent implements OnInit {
  private menus: Menu[];
  private contentfulTypeIds: any;
  private menuService: MenuService;
  private routesManager: RoutesManagerService;

  public constructor(@Inject('ContentfulTypeIds') contentfulTypeIds: any,
                     menuService: MenuService,
                     routesManager: RoutesManagerService) {
    this.contentfulTypeIds = contentfulTypeIds;
    this.menuService = menuService;
    this.routesManager = routesManager;
  }

  public ngOnInit(): void {
    this.menuService
      .getHeaderMenus()
      .subscribe((menus: Menu[]) => {
        this.menuService.addRoutes(menus);
        this.menus = menus;
      });
  }
}
