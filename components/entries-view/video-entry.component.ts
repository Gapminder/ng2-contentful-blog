import { Component, Input, OnInit, AfterViewInit, ElementRef, Renderer, ViewChild } from '@angular/core';
import { SafeResourceUrl, DomSanitizationService } from '@angular/platform-browser';
import { AbstractEntry } from './abstract-entry.component';
import { ContentfulVideoBlock } from '../contentful/aliases.structures';

@Component({
  selector: 'gm-video-entry',
  styles: [require('./video-entry.css') as string],
  template: `
    <div class="wrap-block" #backgroundOwner>
      <div class="video-wrapper" *ngIf="url">
        <iframe
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

export class VideoEntryComponent extends AbstractEntry implements OnInit, AfterViewInit {
  // TODO: Substitute VideoEntryComponent with EmbeddedEntryComponent (later is more generic and allows to embed various types of content)
  protected url: SafeResourceUrl;
  @Input() protected entry: ContentfulVideoBlock;
  @ViewChild('backgroundOwner') private backgroundOwner: ElementRef;

  private sanitationService: DomSanitizationService;

  public constructor(sanitationService: DomSanitizationService,
                     renderer: Renderer,
                     elementRef: ElementRef) {
    super(renderer, elementRef);
    this.sanitationService = sanitationService;
  }

  public ngAfterViewInit(): void {
    this.renderBackground(this.backgroundOwner);
  }

  public ngOnInit(): void {
    if (this.entry.fields.youtube || this.entry.fields.vimeo) {
      this.url = this.sanitationService.bypassSecurityTrustResourceUrl(this.entry.fields.youtube || this.entry.fields.vimeo);
    }
  }

}
