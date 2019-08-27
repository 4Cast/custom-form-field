import { Component, Input, OnInit, OnChanges, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core';
import Quill from 'quill';
const SELECTOR = 'rich-editor';

@Component({
   selector: SELECTOR,
   template: `<div class="text-editor-container" #container>
     <div id="editor" (click)="onTouched()" [ngStyle]="{'height': 
      '200px'}"></div>
   </div>`,
  styles: [`img {
      position: relative;
    }`]
})

export class RichEditorComponent implements OnInit, OnChanges{

@ViewChild('container', { read: ElementRef, static: true }) container: ElementRef;
@Input() value: any;
@Output() changed: EventEmitter<any> = new EventEmitter();

// this one is important, otherwise 'Quill' is undefined
quill: any = Quill;
editor: any;

constructor(public elementRef: ElementRef) {}

ngOnInit(): void {
   const editor = this.container.nativeElement.
                 querySelector('#editor')
   this.editor = new Quill(editor, {theme: 'snow'});
   this.editor.on('editor-change', (eventName, ...args) => {
      this.changed.emit(this.editor.getContents());
   });
}

ngOnChanges() {
    if (this.editor) {
      this.editor.setContents(this.value);
    }
  }

  onTouched() {

  }

}
