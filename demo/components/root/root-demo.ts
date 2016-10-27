import { Component } from '@angular/core';

@Component({
  templateUrl: './root-demo.html'
})

export class RootDemoComponent {
  private date: any;
  private markdown: string;

  public constructor() {
    this.date = Date();
    this.markdown = '### ABOUT THIS VIDEO In this short video Professor Hans Rosling used. ' +
      '[You can download this video here!](https://drive.google.com/a/gapminder.org/folderview?id=0B72viFTZK-hySjJ6alRFTHh2aUU&usp=drive\_web)';

  }
}
