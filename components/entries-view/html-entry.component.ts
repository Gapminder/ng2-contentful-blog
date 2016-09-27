import {
  Component, ViewEncapsulation, Input, ViewChild, ElementRef, AfterViewInit, Renderer,
  OnInit
} from '@angular/core';
import { AbstractEntry } from './abstract-entry.component';
import { ContentfulHtmlBlock } from '../contentful/aliases.structures';
import * as _ from 'lodash';

@Component({
  selector: 'gm-html-entry',
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="block-entry" #backgroundOwner [innerHTML]="entry.fields.content | gmMarkdown"></div>
  `,
  styles: [require('./entries-html.css') as string]
})

export class HtmlEntryComponent extends AbstractEntry implements AfterViewInit, OnInit {
  @Input() protected entry: ContentfulHtmlBlock;
  @ViewChild('backgroundOwner') private backgroundOwner: ElementRef;

  public constructor(renderer: Renderer,
                     elementRef: ElementRef) {
    super(renderer, elementRef);
  }

  public ngOnInit(): void {
    if (_.isEmpty(this.entry.fields.content)) {
      this.entry.fields.content = '';
    }
  }

  public ngAfterViewInit(): void {
    this.renderBackground(this.backgroundOwner);
  }
}
