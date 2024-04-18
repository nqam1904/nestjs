import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class TaskService {
  private readonly logger = new Logger('CornJob');
  constructor() {}
  // @Cron('45 * * * * *')
  // handleCron() {
  //   this.logger.log('Called when the current second is 45');
  // }

  // @Cron(CronExpression.EVERY_10_SECONDS)
  handleCronEveryTimes() {
    this.logger.debug('Called every 10 seconds');
  }
}
