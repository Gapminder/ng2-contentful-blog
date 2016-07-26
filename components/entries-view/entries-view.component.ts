import { Component, Input, OnInit, Inject } from '@angular/core';
import { VideoEntryComponent } from './video-entry.component';
import { HtmlEntryComponent } from './html-entry.component';
import { EmbeddedEntryComponent } from './embedded-entry.component';
import { VizabiEntryComponent } from './vizabi-entry.component';

@Component({
  selector: 'gm-entries-view',
  template: `
    <div *ngFor="let entry of entries">
      <gm-video-entry *ngIf="entry.isVideo" [entry]="entry"></gm-video-entry>
      <gm-html-entry *ngIf="entry.isHtml" [entry]="entry"></gm-html-entry>
      <gm-embedded-entry *ngIf="entry.isEmbedded" [entry]="entry"></gm-embedded-entry>
      <gm-vizabi-entry *ngIf="entry.isVizabi" [entry]="entry"></gm-vizabi-entry>
    </div>
  `,
  directives: [VideoEntryComponent, HtmlEntryComponent, EmbeddedEntryComponent, VizabiEntryComponent]
})
export class EntriesViewComponent implements OnInit {
  @Input()
  private entries: any[];
  private contentfulTypeIds: any;

  public constructor(@Inject('ContentfulTypeIds') contentfulTypeIds: any) {
    this.contentfulTypeIds = contentfulTypeIds;
  }

  public ngOnInit(): void {
    for (let entry of this.entries) {
      entry.isVideo = this.resolveType(entry, this.contentfulTypeIds.VIDEO_TYPE_ID);
      entry.isEmbedded = this.resolveType(entry, this.contentfulTypeIds.EMBEDDED_TYPE_ID);
      entry.isHtml = this.resolveType(entry, this.contentfulTypeIds.HTML_TYPE_ID);
      entry.isVizabi = this.resolveType(entry, this.contentfulTypeIds.VIZABI_TYPE_ID);
    }
    return;
  }

  // TODO not optimal solution
  public resolveType(entry: any, id: string): boolean {
    return entry.sys.contentType.sys.id === id;
  }
}
