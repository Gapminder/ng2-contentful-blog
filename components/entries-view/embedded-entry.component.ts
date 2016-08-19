import { Component, Input, OnInit, ViewChild, ElementRef, Renderer, OnDestroy, AfterViewInit } from '@angular/core';
import { SafeResourceUrl, DomSanitizationService } from '@angular/platform-browser';
import { AbstractEntry } from './abstract-entry.component';
import { ContentfulEmbeddedBlock } from '../contentful/aliases.structures';

@Component({
  selector: 'gm-embedded-entry',
  styles: [require('./video-entry.css')],
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
export class EmbeddedEntryComponent extends AbstractEntry implements OnInit, AfterViewInit, OnDestroy {
  protected url: SafeResourceUrl;
  @Input() protected entry: ContentfulEmbeddedBlock;
  @ViewChild('iframe') private iframe: ElementRef;
  @ViewChild('loader') private loader: ElementRef;
  @ViewChild('backgroundOwner') private backgroundOwner: ElementRef;

  private sanitationService: DomSanitizationService;
  private disposeIframeOnLoadListener: Function;

  public constructor(sanitationService: DomSanitizationService,
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
    if (this.entry.fields.link) {
      this.url = this.sanitationService.bypassSecurityTrustResourceUrl(this.entry.fields.link);
    }
  }

  public ngOnDestroy(): void {
    this.disposeIframeOnLoadListener();
  }
}
