import { Component, 
          Input, 
          OnInit, 
          OnDestroy, 
          DoCheck, 
          ElementRef, 
          ViewChild, 
          Output, 
          EventEmitter, 
          forwardRef,
          HostBinding,
          Injector } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';
import { FocusMonitor } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Subject } from 'rxjs';
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
    }`],
    providers: [{
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RichEditorComponent),
      multi: true
   },
   {
    provide: MatFormFieldControl,
    useExisting: RichEditorComponent
  }],
})

export class RichEditorComponent implements OnInit, DoCheck, OnDestroy, ControlValueAccessor, MatFormFieldControl<any>{

  static nextId = 0;
  @HostBinding() id = `rich-editor-input-${RichEditorComponent.nextId++}`;
  // @HostBinding('id')  id;

@ViewChild('container', { read: ElementRef, static: true }) container: ElementRef;
// @Input() value: any;
@Output() changed: EventEmitter<any> = new EventEmitter();
@Input()
get placeholder() {
   return this.localPlaceholder;
}
set placeholder(plh) {
   this.localPlaceholder = plh;
   this.stateChanges.next();
}
public localPlaceholder: string;


// this one is important, otherwise 'Quill' is undefined
quill: any = Quill;
editor: any;
touched: boolean;
_value: any;
stateChanges = new Subject<void>();
ngControl: NgControl;
controlType = 'richeditor';
errorState = false;
focused = false;

get value(): any {
  return this._value;
}
set value(value) {
  this._value = value;
  this.editor.setContents(this._value);
  this.onChange(value);
  this.stateChanges.next();
}

@Input()
get required() {
   return this._required;
}
set required(req) {
   this._required = coerceBooleanProperty(req);
   this.stateChanges.next();
}
public _required = false;

@Input()
get disabled() {
   return this._disabled;
}
set disabled(dis) {
   this._disabled = coerceBooleanProperty(dis);
   this.stateChanges.next();
}
public _disabled = false;

get empty() {
  const commentText = this.editor.getText().trim();
  return commentText ? false : true;
}

@HostBinding('class.floating')
get shouldLabelFloat() {
  return this.focused || !this.empty;
}

@HostBinding('attr.aria-describedby') describedBy = '';
setDescribedByIds(ids: string[]) {
   this.describedBy = ids.join(' ');
}







constructor(public elementRef: ElementRef,
            public injector: Injector,
            public fm: FocusMonitor ) {
              fm.monitor(elementRef.nativeElement, true).subscribe(origin => {
                this.focused = !!origin;
                this.stateChanges.next();
              });
            }

ngOnInit(): void {
   const editor = this.container.nativeElement.
                 querySelector('#editor');
   this.ngControl = this.injector.get(NgControl);
   if (this.ngControl != null) { this.ngControl.valueAccessor = this; }
   this.editor = new Quill(editor, {theme: 'snow'});
   this.editor.on('editor-change', (eventName, ...args) => {
      console.log('Editor onChange', this.editor.getContents());
      this.onChange(this.editor.getContents());
      this.changed.emit(this.editor.getContents());
   });
}

onChange = (delta: any) => {};

onTouched = () => {
   this.touched = true;
}


// ngOnChanges() {
//     if (this.editor) {
//       this.editor.setContents(this.value);
//     }
// }

  writeValue(delta: any): void {
    this.editor.setContents(delta);
    this._value = delta;
 }

 registerOnChange(fn: (v: any) => void): void {
    this.onChange = fn;
 }

 registerOnTouched(fn: () => void): void {
   this.onTouched = fn;
 }


ngOnDestroy() {
  this.stateChanges.complete();
  this.fm.stopMonitoring(this.elementRef.nativeElement);
}

ngDoCheck(): void {
  if(this.ngControl) {
     this.errorState = this.ngControl.invalid && this.ngControl.touched;
     this.stateChanges.next();
  }
}

onContainerClick(event: MouseEvent) {
  if ((event.target as Element).tagName.toLowerCase() != 'div') {
     this.container.nativeElement.querySelector('div').focus();
  }
}

}
