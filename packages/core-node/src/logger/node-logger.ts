import { Injectable, Autowired } from '@ali/common-di';
import {
  ILogServiceManage,
  SupportLogNamespace,
  ILogService,
  LogLevel,
} from '@ali/ide-core-common';

// tslint:disable-next-line:no-empty-interface
export interface INodeLogger extends ILogService {}
export const INodeLogger = Symbol('INodeLogger');

@Injectable()
export class NodeLogger implements INodeLogger {

  @Autowired(ILogServiceManage)
  loggerMange: ILogServiceManage;
  logger: ILogService = this.loggerMange.getLogger(SupportLogNamespace.Node);

  error(...args) {
    return this.logger.error();
  }

  warn(...args) {
    return this.logger.warn(...args);
  }

  log(...args) {
    return this.logger.log(...args);
  }
  debug(...args) {
    return this.logger.debug(...args);
  }

  verbose(...args) {
    return this.logger.verbose(...args);
  }

  critical(...args) {
    return this.logger.critical(...args);
  }

  dispose() {
    return this.logger.dispose();
  }

  setOptions(options) {
    return this.setOptions(options);
  }

  sendLog(level: LogLevel, message: string) {
    return this.sendLog(level, message);
  }

  drop() {
    return this.drop();
  }

  getLevel() {
    return this.getLevel();
  }

  setLevel(level: LogLevel) {
    return this.logger.setLevel(level);
  }
}
