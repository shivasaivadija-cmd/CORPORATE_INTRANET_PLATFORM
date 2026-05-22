import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { IntranetGateway } from './intranet.gateway';
import { PresenceService } from './presence.service';

@Module({
  imports: [JwtModule],
  providers: [IntranetGateway, PresenceService],
  exports: [IntranetGateway, PresenceService],
})
export class WebsocketModule {}
