import { Component, Input } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { Menu } from '../../contentful/content-type.structures';
import { RoutesManagerService } from '../../routes-gateway/routes-manager.service';
import { ViewSocial } from '../../footer/footer.component';

@Component({
  selector: 'gm-footer-menu',
  template: require('./footer-menu.html') as string,
  directives: [ROUTER_DIRECTIVES],
  styles: [require('./footer-menu.css') as string],
  pipes: [AsyncPipe]
})
export class FooterMenuComponent {
  /* tslint:disable:no-unused-variable */
  @Input() private menus: Menu[];
  @Input() private socials: ViewSocial[];
  /* tslint:enable:no-unused-variable */
  private routesManager: RoutesManagerService;

  public constructor(routesManager: RoutesManagerService) {
    this.routesManager = routesManager;
  }
}
