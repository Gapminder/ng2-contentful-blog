import { Component, OnInit, Inject } from '@angular/core';
import { ShareComponent } from './share.component';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { ContenfulContent } from '../contentful/contentful-content.service';
import { ContentfulImage } from '../contentful/aliases.structures';
import * as _ from 'lodash';

@Component({
  selector: 'gm-share-line-footer',
  template: require('./share-footer-line.html') as string,
  directives: [ ShareComponent, ROUTER_DIRECTIVES],
  styles: [require('./share-footer.css') as string]
})
export class ShareFooterLineComponent implements OnInit {
  private imageInfo: ContentfulImage;
  private contentfulContentService: ContenfulContent;
  private constants: any;

  public constructor(contentfulContentService: ContenfulContent,
                     @Inject('Constants') constants: any) {
    this.contentfulContentService = contentfulContentService;
    this.constants = constants;
  }

  public ngOnInit(): void {
    this.contentfulContentService.getImagesByTitle(this.constants.SHARE_FOOTER_LINE_LOGO_TITLE)
      .subscribe((images: ContentfulImage[]) => {
        this.imageInfo = _.first(images);
      });
  }

  public scrollTop(e: MouseEvent): void {
    e.preventDefault();
    this.animateScroll('goTo', 20, 1000);
  };

  private animateScroll(id: string, inc: number, duration: number): any {
    const elem = document.getElementById(id);
    const startScroll = this.getScrollTop();
    const endScroll = elem.offsetTop;
    const step = (endScroll - startScroll) / duration * inc;
    window.requestAnimationFrame(this.goToScroll(step, duration, inc));
  }

  private goToScroll(step: number, duration: number, inc: number): any {
    return () => {
      const currentDuration = duration - inc;

      this.incScrollTop(step);

      if (currentDuration < inc) {
        return;
      }
      window.requestAnimationFrame(this.goToScroll(step, currentDuration, inc));
    };
  }

  private getScrollTop(): number {
    if (document.body.scrollTop) {
      return document.body.scrollTop;
    }

    return document.documentElement.scrollTop;
  }

  private incScrollTop(step: number): void {
    if (document.body.scrollTop) {
      document.body.scrollTop += step;
    } else {
      document.documentElement.scrollTop += step;
    }
  }
}
