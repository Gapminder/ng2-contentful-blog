import { Component, OnInit, Inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { FooterMenuComponent } from '../menu/footer/footer-menu.component';
import { ContenfulContent } from '../contentful/contentful-content.service';
import { ContentfulImage, ContentfulSocial } from '../contentful/aliases.structures';
import { MenuService } from '../menu/menu.service';
import { Menu, FooterMenu, Social } from '../contentful/content-type.structures';
import * as _ from 'lodash';
import { RoutesManagerService } from '../routes-gateway/routes-manager.service';

@Component({
  selector: 'gm-footer',
  template: require('./footer.html') as string,
  directives: [ROUTER_DIRECTIVES, FooterMenuComponent],
  styles: [require('./footer.css') as string],
  pipes: [AsyncPipe]
})
export class FooterComponent implements OnInit {
  private contentfulContentService: ContenfulContent;
  private constants: any;
  private footerLogo: ContentfulImage;
  private description: string;
  private menuService: MenuService;
  private menus: Menu[];
  private socials: ViewSocial[];
  private routesManager: RoutesManagerService;

  public constructor(contentfulContentService: ContenfulContent,
                     menuService: MenuService,
                     routesManager: RoutesManagerService,
                     @Inject('Constants') constants: any) {
    this.contentfulContentService = contentfulContentService;
    this.routesManager = routesManager;
    this.constants = constants;
    this.menuService = menuService;
  }

  public ngOnInit(): void {

    this.menuService
      .getFooterMenus()
      .subscribe((footerMenu: FooterMenu) => {
        this.socials = this.toViewSocials(footerMenu.social);

        this.description = footerMenu.description;
        this.menus = footerMenu.menus;
        this.routesManager.addRoutesFromMenus(... this.menus);
      });

    this.contentfulContentService.getImagesByTitle(this.constants.FOOTER_LOGO_TITLE)
      .subscribe((images: ContentfulImage[]) => {
        this.footerLogo = _.first(images);
      });
  }

  private toViewSocials(contentfulSocial: ContentfulSocial): ViewSocial[] {
    if (!contentfulSocial || !contentfulSocial.fields) {
      return [];
    }

    const social: Social = contentfulSocial.fields;
    return _.chain(social)
      .keys()
      .map((socialTitle: string) => {
        return {link: social[socialTitle], iconCssClass: socialTitle};
      })
      .value();
  }
}

interface ViewSocial {
  link: string;
  iconCssClass: string;
}
