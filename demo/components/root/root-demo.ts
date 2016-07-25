import { Component } from '@angular/core';
import { CORE_DIRECTIVES, FORM_DIRECTIVES } from '@angular/common';
import { MarkdownPipe } from '../../../components/pipes/markdown.pipe';
import { ToDatePipe } from '../../../components/pipes/to-date.pipe';

// webpack html imports
let template = require('./root-demo.html');

@Component({
  template: template,
  directives: [CORE_DIRECTIVES, FORM_DIRECTIVES],
  pipes: [ToDatePipe, MarkdownPipe]
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
