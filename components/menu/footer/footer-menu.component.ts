import { Component, Input } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { Angulartics2On } from 'angulartics2';
import { Menu } from '../../contentful/content-type.structures';
import { RoutesManagerService } from '../../routes-gateway/routes-manager.service';

@Component({
  selector: 'gm-footer-menu',
  template: require('./footer-menu.html') as string,
  directives: [ROUTER_DIRECTIVES, Angulartics2On],
  styles: [require('./footer-menu.css') as string],
  pipes: [AsyncPipe]
})
export class FooterMenuComponent {
  /* tslint:disable:no-unused-variable */
  @Input() private menus: Menu[];
  /* tslint:enable:no-unused-variable */
  private routesManager: RoutesManagerService;

  public constructor(routesManager: RoutesManagerService) {
    this.routesManager = routesManager;
  }
}
