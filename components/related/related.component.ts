import { Component, Input, OnInit } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { RoutesManagerService } from '../routes-gateway/routes-manager.service';
import { ContenfulContent } from '../contentful/contentful-content.service';
import { ToDatePipe } from '../pipes/to-date.pipe';

@Component({
  selector: 'gm-related',
  template: require('./related.html') as string,
  styles: [require('./related.css') as string],
  directives: [ROUTER_DIRECTIVES],
  pipes: [ToDatePipe]
})
export class RelatedComponent implements OnInit {
  @Input()
  private relatedItems: Array<any> = [];
  /* tslint:disable:no-unused-variable */
  @Input() private relatedLocation: boolean = false;
  @Input() private contentSlug: string;
  /* tslint:enable:no-unused-variable */

  private routesManager: RoutesManagerService;
  private contentfulContentService: ContenfulContent;

  public constructor(routesManager: RoutesManagerService,
                     contentfulContentService: ContenfulContent) {
    this.routesManager = routesManager;
    this.contentfulContentService = contentfulContentService;
  }

  public ngOnInit(): void {
    if (this.relatedItems) {
      for (let item of this.relatedItems) {
        this.contentfulContentService.getArticleParentSlug(item.sys.id, (url: string) => {
          item.fields.url = this.routesManager.addRoute({path: url, data: {name: item.fields.title}});
        });
      }
    }
  }
}
