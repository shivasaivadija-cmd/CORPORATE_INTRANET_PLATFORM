import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { PresenceService } from './presence.service';

@WebSocketGateway({
  cors: { origin: '*', credentials: true },
  namespace: '/',
  transports: ['websocket', 'polling'],
})
export class IntranetGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(IntranetGateway.name);

  constructor(
    private jwt: JwtService,
    private config: ConfigService,
    private presenceService: PresenceService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token =
        client.handshake.auth?.token ||
        client.handshake.headers?.authorization?.split(' ')[1];

      if (!token) { client.disconnect(); return; }

      const payload = this.jwt.verify(token, { secret: this.config.get('auth.jwtSecret') });
      client.data.userId = payload.sub;
      client.data.tenantId = payload.tenantId;

      // Join tenant room
      client.join(`tenant:${payload.tenantId}`);

      // Update presence
      await this.presenceService.setOnline(payload.sub, client.id);
      this.server.to(`tenant:${payload.tenantId}`).emit('presence:update', {
        userId: payload.sub,
        status: 'ONLINE',
        lastSeenAt: new Date().toISOString(),
      });

      this.logger.log(`Client connected: ${payload.sub}`);
    } catch {
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    if (!client.data.userId) return;

    await this.presenceService.setOffline(client.data.userId);
    this.server.to(`tenant:${client.data.tenantId}`).emit('presence:update', {
      userId: client.data.userId,
      status: 'OFFLINE',
      lastSeenAt: new Date().toISOString(),
    });

    this.logger.log(`Client disconnected: ${client.data.userId}`);
  }

  @SubscribeMessage('join:department')
  handleJoinDepartment(
    @ConnectedSocket() client: Socket,
    @MessageBody() departmentId: string,
  ) {
    client.join(`dept:${departmentId}`);
    return { event: 'joined', data: departmentId };
  }

  @SubscribeMessage('typing:start')
  handleTypingStart(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { postId: string },
  ) {
    client.to(`tenant:${client.data.tenantId}`).emit('typing:start', {
      userId: client.data.userId,
      postId: data.postId,
    });
  }

  @SubscribeMessage('typing:stop')
  handleTypingStop(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { postId: string },
  ) {
    client.to(`tenant:${client.data.tenantId}`).emit('typing:stop', {
      userId: client.data.userId,
      postId: data.postId,
    });
  }

  @SubscribeMessage('presence:ping')
  async handlePresencePing(@ConnectedSocket() client: Socket) {
    if (client.data.userId) {
      await this.presenceService.refreshPresence(client.data.userId);
    }
    return { event: 'presence:pong' };
  }

  // Emit helpers used by other services
  emitToTenant(tenantId: string, event: string, data: unknown) {
    this.server.to(`tenant:${tenantId}`).emit(event, data);
  }

  emitToUser(userId: string, event: string, data: unknown) {
    this.server.to(`user:${userId}`).emit(event, data);
  }

  emitToDepartment(departmentId: string, event: string, data: unknown) {
    this.server.to(`dept:${departmentId}`).emit(event, data);
  }
}
