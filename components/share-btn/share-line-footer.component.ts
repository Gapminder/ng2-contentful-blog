import { Component, Input } from '@angular/core';
import { Angulartics2On } from 'angulartics2';
import { ShareComponent } from './share.component';
import { ROUTER_DIRECTIVES } from '@angular/router';

@Component({
  selector: 'gm-share-line-footer',
  template: require('./share-footer-line.html') as string,
  directives: [Angulartics2On, ShareComponent, ROUTER_DIRECTIVES],
  styles: [require('./share-footer.css') as string]
})
export class ShareFooterLineComponent {
  /* tslint:disable:no-unused-variable */
  @Input()
  private logoId: string;
  /* tslint:enable:no-unused-variable */

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
