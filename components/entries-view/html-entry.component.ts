import {
  Component, ViewEncapsulation, Input, ViewChild, ElementRef, AfterViewInit, Renderer,
  OnInit, Inject
} from '@angular/core';
import { AbstractEntry } from './abstract-entry.component';
import { ContentfulHtmlBlock } from '../contentful/aliases.structures';
import * as _ from 'lodash';

@Component({
  selector: 'gm-html-entry',
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="block-entry" #backgroundOwner  [ngStyle]="{'color': fontColor}" [innerHTML]="entry.fields.content | gmMarkdown"></div>
  `,
  styleUrls: ['./entries-html.css']
})

export class HtmlEntryComponent extends AbstractEntry implements AfterViewInit, OnInit {
  @Input() protected entry: ContentfulHtmlBlock;
  @ViewChild('backgroundOwner') private backgroundOwner: ElementRef;
  private fontColor: string;
  private constants: any;

  public constructor(renderer: Renderer,
                     elementRef: ElementRef,
                     @Inject('Constants') constants: any) {
    super(renderer, elementRef);
    this.constants = constants;
  }

  public ngOnInit(): void {
    if (_.isEmpty(this.entry.fields.content)) {
      this.entry.fields.content = '';
    }

    this.fontColor = this.entry.fields.fontColor || this.constants.DEFAULT_FONT_COLOR;
  }

  public ngAfterViewInit(): void {
    this.renderBackground(this.backgroundOwner);
  }
}
