import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Users } from 'src/auth/entities/user.entity';

export interface UserRegisteredEvent {
  user: {
    id: number;
    email: string;
    name: string;
  };
  timestamp: Date;
}

@Injectable()
export class EventService {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  //   emit an event register

  emitUserRegistered(user: Users): void {
    const userRegisterEvent: UserRegisteredEvent = {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      timestamp: new Date(),
    };

    // event data
    this.eventEmitter.emit('user.registered', userRegisterEvent);
  }
}
