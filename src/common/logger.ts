import { Inject, Injectable, Logger, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.TRANSIENT })
export class AppLogger extends Logger {
  constructor(@Inject('console') private console: Console) {
    super();
  }
  error(message: any, trace?: string, context?: string): void {
    // this.console.error(new Error(message), trace, context);
    super.error(message, trace, context);
  }
  log(message: any, context?: string): void {
    // this.console.info(message, context);
    super.log(message, context);
  }
  warn(message: any, context?: string): void {
    // this.console.warn(message, context);
    super.warn(message, context);
  }
  debug(message: any, context?: string): void {
    // this.console.debug(message, context);
    super.debug(message, context);
  }
}
