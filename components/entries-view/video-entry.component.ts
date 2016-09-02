import { Component, Input, OnInit, AfterViewInit, ElementRef, Renderer, ViewChild } from '@angular/core';
import { SafeResourceUrl, DomSanitizationService } from '@angular/platform-browser';
import { AbstractEntry } from './abstract-entry.component';
import { ContentfulVideoBlock } from '../contentful/aliases.structures';
import * as _ from 'lodash';
import { VideoBlock } from '../contentful/content-type.structures';

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
  private static VIMEO_URL_PART: string = 'vimeo.com/';
  private static VIMEO_URL_EMBEDDED_PART: string = 'player.vimeo.com/video/';

  private static YOUTUBE_URL_PART: string = 'youtube.com/watch?v=';
  private static YOUTUBE_URL_EMBEDDED_PART: string = 'youtube.com/embed/';

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
    const videoBlock: VideoBlock = this.entry && this.entry.fields;
    const videoUrl = this.toVideoUrl(videoBlock);
    this.url = videoUrl && this.sanitationService.bypassSecurityTrustResourceUrl(videoUrl);
  }

  private toVideoUrl(videoBlock: VideoBlock): string {
    if (videoBlock.vimeo) {
      return this.convertVimeoVideoUrlToEmbeddedUrl(videoBlock.vimeo);
    }

    if (videoBlock.youtube) {
      return this.convertYoutubeVideoUrlToEmbeddedUrl(videoBlock.youtube);
    }

    return '';
  }

  private convertYoutubeVideoUrlToEmbeddedUrl(videoUrl: string): string {
    const youtubeVideoId = this.extractEmbeddedVideoId(
      videoUrl,
      VideoEntryComponent.YOUTUBE_URL_PART,
      VideoEntryComponent.YOUTUBE_URL_EMBEDDED_PART
    );
    return videoUrl ? `//${VideoEntryComponent.YOUTUBE_URL_EMBEDDED_PART}${youtubeVideoId}` : '';
  }

  private convertVimeoVideoUrlToEmbeddedUrl(videoUrl: string): string {
    const vimeoVideoId = this.extractEmbeddedVideoId(
      videoUrl,
      VideoEntryComponent.VIMEO_URL_PART,
      VideoEntryComponent.VIMEO_URL_EMBEDDED_PART
    );
    return videoUrl ? `//${VideoEntryComponent.VIMEO_URL_EMBEDDED_PART}${vimeoVideoId}` : '';
  }

  private extractEmbeddedVideoId(videoUrl: string, externalVideoUrlPart: string, externalEmbeddedVideoUrlPart: string): string {
    let urlSplitToken;
    if (_.includes(videoUrl, externalEmbeddedVideoUrlPart)) {
      urlSplitToken = externalEmbeddedVideoUrlPart;
    } else if (_.includes(videoUrl, externalVideoUrlPart)) {
      urlSplitToken = externalVideoUrlPart;
    }

    return String(_.chain(videoUrl).split(urlSplitToken).last().value() || videoUrl);
  }
}
