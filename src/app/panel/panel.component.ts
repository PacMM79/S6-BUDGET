import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-panel',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './panel.component.html',
  styleUrl: './panel.component.scss'
})
export class PanelComponent {
  @Input() pagesControl!: FormControl;
  @Input() langsControl!: FormControl;

  increment(control: FormControl) {
    control.setValue(control.value + 1);
  }

  decrement(control: FormControl) {
    if (control.value > 1) {
      control.setValue(control.value - 1);
    }
  }
}
