import { Component, OnInit, Inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { FooterMenuComponent } from '../menu/footer/footer-menu.component';
import { ContenfulContent } from '../contentful/contentful-content.service';
import { ContentfulImage } from '../contentful/aliases.structures';
import { MenuService } from '../menu/menu.service';
import { Menu, FooterMenu, Social } from '../contentful/content-type.structures';
import * as _ from 'lodash';

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

  public constructor(contentfulContentService: ContenfulContent,
                     menuService: MenuService,
                     @Inject('Constants') constants: any) {
    this.contentfulContentService = contentfulContentService;
    this.constants = constants;
    this.menuService = menuService;
  }

  public ngOnInit(): void {

    this.menuService
      .getFooterMenus()
      .subscribe((footerMenu: FooterMenu) => {
        const social: Social = footerMenu.social.fields;
        this.socials = _.chain(social)
          .keys()
          .map((socialTitle: string) => {
            return {link: social[socialTitle], iconCssClass: socialTitle};
          })
          .value();

        this.description = footerMenu.description;
        this.menus = footerMenu.menus;
        this.menuService.addRoutes(this.menus);
      });

    this.contentfulContentService.getImagesByTitle(this.constants.FOOTER_LOGO_TITLE)
      .subscribe((images: ContentfulImage[]) => {
        this.footerLogo = _.first(images);
      });
  }
}

interface ViewSocial {
  link: string;
  iconCssClass: string;
}
