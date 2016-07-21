import {Component, OnInit, Inject} from '@angular/core';
import {RouterLink} from '@angular/router-deprecated';
import {AsyncPipe} from '@angular/common';
import {Angulartics2On} from 'angulartics2/index';
import {ContenfulContent} from '../../contentfulService/contentful-content.service';
import {RoutesGatewayService} from '../../routesGateway/routes-gateway.service';
import {Menu} from '../../contentfulService/content-type.structures';
import {ContentfulMenu} from '../../contentfulService/aliases.structures';

@Component({
  selector: 'gm-footer-menu',
  template: require('./footer.html') as string,
  directives: [RouterLink, Angulartics2On],
  styles: [require('./footer.css') as string],
  pipes: [AsyncPipe]
})
export class FooterMenuComponent implements OnInit {
  private menus: Menu[];
  private contentfulContentService: ContenfulContent;
  private routesGatewayService: RoutesGatewayService;
  private contentfulTypeIds: any;

  public constructor(@Inject(ContenfulContent) contentfulContentService: ContenfulContent,
                     @Inject('ContentfulTypeIds') contentfulTypeIds: any,
                     @Inject(RoutesGatewayService) routesGatewayService: RoutesGatewayService) {
    this.contentfulContentService = contentfulContentService;
    this.routesGatewayService = routesGatewayService;
    this.contentfulTypeIds = contentfulTypeIds;
  }

  public ngOnInit(): void {
    this.contentfulContentService
      .getMenu(this.contentfulTypeIds.FOOTER_TYPE_ID)
      .subscribe((response: ContentfulMenu[]) => {
        this.menus = response[0].fields.entries;
        for (let menu of this.menus) {
          if (menu.fields.entryPoint) {
            this.routesGatewayService.addRoute(menu.fields.entryPoint.fields.slug, {name: menu.fields.entryPoint.fields.title});
          }
        }
      });
  }
}
