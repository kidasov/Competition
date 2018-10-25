import {
  Component,
  forwardRef,
  Input,
  OnInit,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
})
export class InputComponent implements OnInit, ControlValueAccessor {
  value: string;
  @Input()
  defaultValue: string;
  @Input()
  placeholder = 'Placeholder';
  @Input()
  formControlName: string;
  @Input()
  type = 'text';

  private propagateChange: (string) => void;

  writeValue(obj: any): void {
    this.value = obj;
  }
  registerOnChange(fn: any): void {
    this.propagateChange = fn;
    fn(this.defaultValue);
  }
  registerOnTouched(fn: any): void {}
  setDisabledState?(isDisabled: boolean): void {}

  public onChange(event: Event) {
    this.propagateChange((event.target as HTMLInputElement).value);
  }

  constructor() {}

  ngOnInit() {}
}
