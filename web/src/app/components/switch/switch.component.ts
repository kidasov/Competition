import {
  AfterViewInit,
  Component,
  ElementRef,
  forwardRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MDCSwitch } from '@material/switch';

@Component({
  selector: 'app-switch',
  templateUrl: './switch.component.html',
  styleUrls: [
    './switch.component.css',
    '../../../../node_modules/@material/switch/dist/mdc.switch.css',
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SwitchComponent),
      multi: true,
    },
  ],
})
export class SwitchComponent
  implements OnInit, OnDestroy, AfterViewInit, ControlValueAccessor {
  constructor() {}
  @ViewChild('switch')
  ref: ElementRef;
  switchControl: MDCSwitch;
  @Input()
  checked = false;
  @Input()
  label: string;
  value: string;
  @Input()
  formControlName: string;
  @Input()
  defaultValue: boolean;

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
    this.propagateChange((event.target as HTMLInputElement).checked);
  }

  ngAfterViewInit() {
    this.switchControl = new MDCSwitch(this.ref.nativeElement);
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.switchControl.destroy();
  }
}
