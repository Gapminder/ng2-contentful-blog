import { Component, Input, OnInit, ViewChild, ElementRef, AfterViewInit, Renderer, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AbstractEntry } from './abstract-entry.component';
import { ContentfulVizabiBlock } from '../contentful/aliases.structures';

@Component({
  selector: 'gm-vizabi-entry',
  styleUrls: ['./video-entry.css'],
  template: `
    <div class="wrap-block" #backgroundOwner>
      <div class="video-wrapper">
        <div class="loader" #loader></div>
        <iframe #iframe
          *ngIf="url"
          [src]="url"
          frameborder="0" 
          webkitallowfullscreen="" 
          mozallowfullscreen="" 
          allowfullscreen="">
        </iframe>
      </div>
    </div>
  `
})
export class VizabiEntryComponent extends AbstractEntry implements OnInit, AfterViewInit, OnDestroy {
  protected url: SafeResourceUrl;
  @Input() protected entry: ContentfulVizabiBlock;
  @ViewChild('iframe') private iframe: ElementRef;
  @ViewChild('loader') private loader: ElementRef;
  @ViewChild('backgroundOwner') private backgroundOwner: ElementRef;

  private sanitationService: DomSanitizer;
  private disposeIframeOnLoadListener: Function;

  public constructor(sanitationService: DomSanitizer,
                     renderer: Renderer,
                     elementRef: ElementRef) {
    super(renderer, elementRef);
    this.sanitationService = sanitationService;
  }

  public ngAfterViewInit(): void {
    this.renderBackground(this.backgroundOwner);
    this.hideIframe();
    this.disposeIframeOnLoadListener = this.renderer.listen(this.iframe.nativeElement, 'load', () => this.showIframe());
  }

  public hideIframe(): void {
    this.setStyles('hidden', 'block');
  }

  public showIframe(): void {
    this.setStyles('visible', 'none');
  }

  public setStyles(iframeStyles: string, loaderStyles: string): void {
    this.renderer.setElementStyle(this.iframe.nativeElement, 'visibility', iframeStyles);
    this.renderer.setElementStyle(this.loader.nativeElement, 'display', loaderStyles);
  }

  public ngOnInit(): void {
    if (this.entry.fields.state) {
      const staticState: string = '//www.gapminder.org/tools/?embedded=true';
      this.url = this.sanitationService.bypassSecurityTrustResourceUrl(staticState + this.entry.fields.state);
    }
  }

  public ngOnDestroy(): any {
    this.disposeIframeOnLoadListener();
  }

}
