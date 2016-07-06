import {Component, OnInit, Inject} from '@angular/core';
import {RouterLink} from '@angular/router-deprecated';
import {CollapseDirective, DROPDOWN_DIRECTIVES} from 'ng2-bootstrap';
import {Angulartics2On} from 'angulartics2/index';
import {ContenfulContent} from '../../contentfulService/contentful-content.service';
import {RoutesGatewayService} from '../../routesGateway/routes-gateway.service';
import {Menu} from '../../contentfulService/content-type.structures';
import {ContentfulMenu} from '../../contentfulService/aliases.structures';

@Component({
  selector: 'gm-header-menu',
  template: require('./header.html') as string,
  styles: [require('./header.css') as string],
  directives: [CollapseDirective, DROPDOWN_DIRECTIVES, RouterLink, Angulartics2On]
})
export class HeaderMenuComponent implements OnInit {
  private collapsed: boolean = true;
  private menu: Menu[];
  private menuType: string = 'header';
  private contentfulContentService: ContenfulContent;
  private routesGatewayService: RoutesGatewayService;

  public constructor(@Inject(ContenfulContent) contentfulContentService: ContenfulContent,
                     @Inject(RoutesGatewayService) routesGatewayService: RoutesGatewayService) {

    this.contentfulContentService = contentfulContentService;
    this.routesGatewayService = routesGatewayService;

  }

  public ngOnInit(): void {
    this.contentfulContentService
      .getMenu(this.menuType)
      .subscribe((response: ContentfulMenu[]) => {
        this.menu = response[0].fields.entries;
        for (let item of this.menu) {
          if (item.fields.entryPoint && !item.fields.submenus) {
            this.routesGatewayService.addRoute(item.fields.entryPoint.fields.slug, {name: item.fields.entryPoint.fields.title});
          }
          if (item.fields.submenus && item.fields.entryPoint || item.fields.submenus) {
            for (let submenu of item.fields.submenus) {
              this.routesGatewayService.addRoute(submenu.fields.entryPoint.fields.slug, {name: submenu.fields.entryPoint.fields.title});
            }

          }

        }

      });
  }

  public toggle(collapsed: boolean): void {
    this.collapsed = collapsed;
  }
}
