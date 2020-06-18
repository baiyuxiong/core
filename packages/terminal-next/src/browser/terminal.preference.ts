import { Injectable, Autowired } from '@ali/common-di';
import { PreferenceService } from '@ali/ide-core-browser';
import { Emitter } from '@ali/ide-core-common';
import { ITerminalPreference, IPreferenceValue, DefaultOptions, OptionTypeName, DefaultOptionValue } from '../common/preference';

@Injectable()
export class TerminalPreference implements ITerminalPreference {

  static defaultOptions: DefaultOptions = {
    allowTransparency: true,
    macOptionIsMeta: false,
    cursorBlink: false,
    scrollback: 2500,
    tabStopWidth: 8,
    fontSize: 12,
  };

  private _onChange = new Emitter<IPreferenceValue>();
  onChange = this._onChange.event;

  @Autowired(PreferenceService)
  service: PreferenceService;

  protected _prefToOption(pref: string): string {
    return pref.replace('terminal.', '');
  }

  protected _valid(option: string, value: any): any {
    switch (option) {
      case OptionTypeName.fontSize:
        return value > 5 ? value : 5;
      default:
        return value || DefaultOptionValue[option];
    }
  }

  constructor() {
    this.service.onPreferenceChanged(({ preferenceName, newValue, oldValue }) => {
      const name = this._prefToOption(preferenceName);
      if (newValue === oldValue) {
        return;
      }
      if (!OptionTypeName[name]) {
        return;
      }
      this._onChange.fire({
        name,
        value: this._valid(name, newValue),
      });
    });
  }

  get<T = any>(option: string): T {
    const val = this.service.get<T>(option, DefaultOptionValue[option]);
    return this._valid(option, val);
  }

  toJSON() {
    const options = {};

    Object.entries(OptionTypeName).forEach(([name]) => {
      if (!name) {
        return;
      }
      const val = this.get(name);
      if (val) {
        options[name] = val;
      }
    });

    return {
      ...TerminalPreference.defaultOptions,
      ...options,
    };
  }
}