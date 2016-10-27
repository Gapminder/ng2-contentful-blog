import { Component, OnInit, Inject } from '@angular/core';
import { Menu } from '../../contentful/content-type.structures';
import { MenuService } from '../menu.service';
import { RoutesManagerService } from '../../routes-gateway/routes-manager.service';

@Component({
  selector: 'gm-header-menu',
  templateUrl: './header-menu.html',
  styleUrls: ['./header-menu.css']
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
        this.routesManager.addRoutesFromMenus(... menus);
        this.menus = menus;
      });
  }
}
