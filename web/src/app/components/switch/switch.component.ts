import {
  ElementRef,
  ViewChild,
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  Input,
  forwardRef,
} from '@angular/core';
import { MDCSwitch } from '@material/switch';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

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
  checked: boolean = false;
  @Input()
  label: string;
  value: string;
  @Input()
  formControlName: string;
  @Input()
  defaultValue: boolean;

  writeValue(obj: any): void {
    this.value = obj;
  }
  registerOnChange(fn: any): void {
    this.propagateChange = fn;
    fn(this.defaultValue);
  }
  registerOnTouched(fn: any): void {}
  setDisabledState?(isDisabled: boolean): void {}

  private propagateChange: (string) => void;

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
