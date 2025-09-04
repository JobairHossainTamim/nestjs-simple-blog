import { Module } from '@nestjs/common';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { UserRegisteredListener } from './listeners/user.register.listener';

@Module({
  imports: [
    EventEmitterModule.forRoot({
      global: true,
      wildcard: false,
      maxListeners: 20,
      verboseMemoryLeak: true,
    }),
  ],
  controllers: [EventController],
  providers: [EventService, UserRegisteredListener],
  exports: [EventService],
})
export class EventModule {}
