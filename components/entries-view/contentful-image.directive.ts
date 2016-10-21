import { Directive, Input, ElementRef, Renderer, OnChanges } from '@angular/core';
import { ContentfulService } from 'ng2-contentful';
import { URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';
import * as _ from 'lodash';

@Directive({
  selector: '[gmContentfulSrcId]'
})
export class ContentfulImageDirective implements OnChanges {
  @Input()
  private gmContentfulSrcId: string;

  @Input()
  private width: string;

  @Input()
  private height: string;

  @Input()
  private fit: string;

  @Input()
  private quality: string;

  private queryParams: URLSearchParams = new URLSearchParams();
  private element: ElementRef;
  private contentfulService: ContentfulService;
  private renderer: Renderer;

  public constructor(element: ElementRef,
                     renderer: Renderer,
                     contentfulService: ContentfulService) {
    this.element = element;
    this.renderer = renderer;
    this.contentfulService = contentfulService;
  }

  public ngOnChanges(): void {
    if (_.isEmpty(this.gmContentfulSrcId)) {
      return;
    }
    this.contentfulService
      .create()
      .getAsset(this.gmContentfulSrcId)
      .commit()
      .subscribe(
        (response: any) => {
          const tagName = this.element.nativeElement.tagName.toLowerCase();
          const imageUrl = this.imageUrl(response.fields.file.url);
          if (tagName === 'div' || tagName === 'a') {
            this.renderer.setElementStyle(this.element.nativeElement, 'background-image', `url(${imageUrl})`);
          }
          if (tagName === 'img') {
            this.renderer.setElementProperty(this.element.nativeElement, 'src', imageUrl);
          }
        });
  }

  private imageUrl(url: string): string {
    if (this.width) {
      this.queryParams.set('w', this.width);
    }
    if (this.height) {
      this.queryParams.set('h', this.height);
    }
    if (this.quality) {
      this.queryParams.set('q', this.quality);
    }
    if (this.fit) {
      this.queryParams.set('fit', this.fit);
    }
    return `${url}?${this.queryParams.toString()}`;
  }
}
