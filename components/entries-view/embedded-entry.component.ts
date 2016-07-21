import {Component, Input, Inject, OnInit} from '@angular/core';
import {SafeResourceUrl, DomSanitizationService} from '@angular/platform-browser';

@Component({
  selector: 'gm-embedded-entry',
  styles: [require('./video-entry.css')],
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
export class EmbeddedEntryComponent implements OnInit {
  protected url: SafeResourceUrl;

  /* tslint:disable:no-unused-variable */
  @Input() private entry: any;
  /* tslint:enable:no-unused-variable */

  private sanitationService: DomSanitizationService;

  public constructor(@Inject(DomSanitizationService) sanitationService: DomSanitizationService) {
    this.sanitationService = sanitationService;
  }

  public ngOnInit(): void {
    if (this.entry.fields.link) {
      this.url = this.sanitationService.bypassSecurityTrustResourceUrl(this.entry.fields.link);
    }
  }
}
