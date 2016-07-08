import {Component, Input, Inject, OnInit} from '@angular/core';
import {SafeResourceUrl, DomSanitizationService} from '@angular/platform-browser';

@Component({
  selector: 'gm-video-entry',
  styles: [require('./video-entry.css') as string],
  template: `
    <div class="video-wrapper" *ngIf="url">
      <iframe
        [src]="url"
        frameborder="0" 
        webkitallowfullscreen="" 
        mozallowfullscreen="" 
        allowfullscreen="">
      </iframe>
    </div>
  `
})

export class VideoEntryComponent implements OnInit {
  // TODO: Substitute VideoEntryComponent with EmbeddedEntryComponent (later is more generic and allows to embed various types of content)
  protected url: SafeResourceUrl;

  /* tslint:disable:no-unused-variable */
  @Input() private entry: any;
  /* tslint:enable:no-unused-variable */

  private sanitationService: DomSanitizationService;

  public constructor(@Inject(DomSanitizationService) sanitationService: DomSanitizationService) {
    this.sanitationService = sanitationService;
  }

  public ngOnInit(): void {
    if (this.entry.fields.youtube || this.entry.fields.vimeo) {
      this.url = this.sanitationService.bypassSecurityTrustResourceUrl(this.entry.fields.youtube || this.entry.fields.vimeo);
    }
  }

}
