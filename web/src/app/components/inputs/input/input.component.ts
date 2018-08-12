import {
  Component,
  Input,
  OnInit,
  ViewChild,
  ElementRef,
  forwardRef,
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

  writeValue(obj: any): void {
    this.value = obj;
  }
  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }
  registerOnTouched(fn: any): void {}
  setDisabledState?(isDisabled: boolean): void {}

  private propagateChange: (string) => void;

  public onChange(event: Event) {
    this.propagateChange((event.target as HTMLInputElement).value);
  }

  constructor() {}

  ngOnInit() {}
}
