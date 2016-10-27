import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { RoutesManagerService } from '../routes-gateway/routes-manager.service';
import { CoverService, CoverEvent } from './cover.service';
import { HtmlBlock } from '../contentful/content-type.structures';
import * as _ from 'lodash';

@Component({
  selector: 'gm-cover',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './cover-image.html',
  styleUrls: ['./cover-image.css']
})
export class CoverImageComponent implements OnInit {

  private router: Router;
  private routesManager: RoutesManagerService;
  private coverService: CoverService;
  private html: HtmlBlock;
  private imageSysId: string;
  private flagForMobile: boolean;
  private backgroundColor: string;
  private fontColor: string;
  private showCover: boolean;
  private constants: any;

  public constructor(router: Router,
                     coverService: CoverService,
                     @Inject('Constants') constants: any,
                     routesManager: RoutesManagerService) {
    this.router = router;
    this.coverService = coverService;
    this.constants = constants;
    this.routesManager = routesManager;
  }

  public ngOnInit(): void {
    this.coverService.cover$.subscribe((event: CoverEvent)=> {
      this.showCover = event.show && !_.isEmpty(event.cover);
      if (!_.isEmpty(event.cover)) {
        const cover = event.cover.fields;
        const backgroundSysId = _.get(cover, 'background.sys.id') as string || '';
        this.html = _.get(cover, 'html.fields') as HtmlBlock;
        if (this.html) {
          this.flagForMobile = true;
          this.fontColor = this.html.fontColor || this.constants.DEFAULT_FONT_COLOR;
          this.backgroundColor = this.html.backgroundColor || '';
          this.imageSysId = _.get(this.html.backgroundImage, 'sys.id') as string || backgroundSysId;
        } else {
          this.imageSysId = backgroundSysId;
        }
      }
    });
  }
}

interface RouteData {
  name?: string;
  cover?: string;
}
