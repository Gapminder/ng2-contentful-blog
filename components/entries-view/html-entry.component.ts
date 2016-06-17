import {Component, ViewEncapsulation, Input} from '@angular/core';
import {MarkdownPipe} from '../pipes/markdown.pipe';

@Component({
  selector: 'gm-html-entry',
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="block-entry" [innerHTML]="entry.fields.content | gmMarkdown"></div>
  `,
  styles: [require('./entries-html.css') as string],
  pipes: [MarkdownPipe]
})
export class HtmlEntryComponent {
  /* tslint:disable:no-unused-variable */
  @Input() private entry: any;
  /* tslint:enable:no-unused-variable */
}
