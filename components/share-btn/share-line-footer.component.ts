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

  protected scrollTop(e: Event): void {
    e.preventDefault();

    this.animateScroll('goTo', 20, 1000, () => {
      console.log('Scroll has done');
    });
  };

  private animateScroll(id: string, inc: number, duration: number, scrollCompleted: any): any {
    let elem = document.getElementById(id);
    let startScroll = document.body.scrollTop;
    let endScroll = elem.offsetTop;
    let step = (endScroll - startScroll) / duration * inc;

    requestAnimationFrame(this.goToScroll(step, duration, inc, scrollCompleted));
  }

  private goToScroll(step: number, duration: number, inc: number, scrollCompleted: any): any {
    return () => {
      let currentDuration = duration - inc;
      document.body.scrollTop += step;
      if (currentDuration < inc) {
        return scrollCompleted();
      }
      requestAnimationFrame(this.goToScroll(step, currentDuration, inc, scrollCompleted));
    };
  }
}
