import {Directive, Input, OnInit, ElementRef} from '@angular/core';
import {ContentfulService} from 'ng2-contentful';
import {URLSearchParams, Response} from '@angular/http';

@Directive({
  selector: '[gmContentfulSrcId]',
  providers: [ContentfulService]
})
export class ContentfulImageDirective implements OnInit {
  @Input()
  private gmContentfulSrcId: string;
  @Input()
  private width: string;
  @Input()
  private height: string;
  @Input()
  private fit: string;
  private queryParams: URLSearchParams = new URLSearchParams();
  private element: ElementRef;
  private contentfulService: ContentfulService;

  public constructor(element: ElementRef,
                     contentfulService: ContentfulService) {
    this.element = element;
    this.contentfulService = contentfulService;
  }

  public ngOnInit(): void {
    this.contentfulService
      .create()
      .getAsset(this.gmContentfulSrcId)
      .commit()
      .map((response: Response) => response.json())
      .subscribe(
        (response: any) => {
          this.element.nativeElement.src =
            this.imageUrl(response.fields.file.url);
        }
      );
  }

  private imageUrl(url: string): string {
    if (this.width) {
      this.queryParams.set('w', this.width);
    }
    if (this.height) {
      this.queryParams.set('h', this.height);
    }
    if (this.fit) {
      this.queryParams.set('fit', this.fit);
    }
    return `${url}?${this.queryParams.toString()}`;
  }
}

