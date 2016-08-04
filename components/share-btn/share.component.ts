import { Component, OnInit } from '@angular/core';
import { Angulartics2On } from 'angulartics2';
import { ROUTER_DIRECTIVES } from '@angular/router';

@Component({
  selector: 'gm-share',
  template: require('./share.html') as string,
  directives: [Angulartics2On, ROUTER_DIRECTIVES],
  styles: [require('./share.css') as string]
})
export class ShareComponent implements OnInit {
  private twitter: string;
  private facebook: string;
  private linkedin: string;
  private googlePlus: string;

  public ngOnInit(): void {
    const location = this.getLocation();
    /* eslint-disable max-len */
    this.facebook = `https://www.facebook.com/sharer/sharer.php?u=${location}`;
    this.linkedin = `https://www.linkedin.com/shareArticle?mini=true&url=${location}`;
    this.googlePlus = `https://plus.google.com/share?url=${location}`;
    this.twitter = `https://twitter.com/intent/tweet?original_referer=http%3A%2F%2Fwww.gapminder.org&amp;related=Gapminder&amp;text=Gapminder&amp;tw_p=tweetbutton&amp;url=${location}`;
    /* eslint-enable max-len */

  }

  private getLocation(): string {
    return typeof window !== 'undefined' ? window.location.href : '';
  }
}
