import { Renderer, ElementRef } from '@angular/core';
import { Block } from '../contentful/content-type.structures';
import { ContentfulBlock } from '../contentful/aliases.structures';

export abstract class AbstractEntry {
  protected renderer: Renderer;
  protected elementRef: ElementRef;

  protected entry: ContentfulBlock;

  public constructor(renderer: Renderer,
                     elementRef: ElementRef) {
    this.renderer = renderer;
    this.elementRef = elementRef;
  }

  protected renderBackground(backgroundOwner: ElementRef): void {
    const entryFields: Block = this.entry.fields;
    if (entryFields.backgroundImage) {
      this.renderer.setElementStyle(backgroundOwner.nativeElement, 'background-image', `url(${entryFields.backgroundImage.fields.file.url})`);
    }
    if (entryFields.backgroundColor) {
      this.renderer.setElementStyle(backgroundOwner.nativeElement, 'background-color', entryFields.backgroundColor);
    }
  }
}
