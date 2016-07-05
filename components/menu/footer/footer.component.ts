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
  styles: [require('./footer.styl') as string],
  pipes: [AsyncPipe]
})
export class FooterMenuComponent implements OnInit {
  private menuType: string = 'footerMenu';
  private menu: Menu[];
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
          if (item.fields.entryPoint) {
            this.routesGatewayService.addRoute(item.fields.entryPoint.fields.slug, {name: item.fields.entryPoint.fields.title});
          }
        }
      });
  }
}
