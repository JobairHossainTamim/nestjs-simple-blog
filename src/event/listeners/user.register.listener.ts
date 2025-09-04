import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import type { UserRegisteredEvent } from '../event.service';

@Injectable()
export class UserRegisteredListener {
  private readonly logger = new Logger(UserRegisteredListener.name);

  @OnEvent('user.registered')
  handleUserRegisteredEvent(event: UserRegisteredEvent): void {
    const { user, timestamp } = event;
    this.logger.log(
      `User Registered Event: ID=${user.id}, Email=${user.email}, Name=${user.name}, Timestamp=${timestamp}`,
    );
  }
}
