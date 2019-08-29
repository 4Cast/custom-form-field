import { Component } from '@angular/core';
import { FormControl } from '@angular/forms'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title = 'custom-form-field';
  editorValue = '';
  newValue = '';
  ctrl = new FormControl();

  editorValueChanged(evt){
    console.log('Value changed', evt.ops[0].insert);
    this.newValue = evt.ops[0].insert;

  }
}
