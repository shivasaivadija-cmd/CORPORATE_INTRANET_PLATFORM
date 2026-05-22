import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { BullModule } from '@nestjs/bull';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-ioredis-yet';
import { DatabaseModule } from '@database/database.module';
import { AuthModule } from '@modules/auth/auth.module';
import { UsersModule } from '@modules/users/users.module';
import { FeedModule } from '@modules/feed/feed.module';
import { AnnouncementsModule } from '@modules/announcements/announcements.module';
import { KnowledgeModule } from '@modules/knowledge/knowledge.module';
import { DocumentsModule } from '@modules/documents/documents.module';
import { RecognitionModule } from '@modules/recognition/recognition.module';
import { EventsModule } from '@modules/events/events.module';
import { SearchModule } from '@modules/search/search.module';
import { NotificationsModule } from '@modules/notifications/notifications.module';
import { AdminModule } from '@modules/admin/admin.module';
import { AiModule } from '@modules/ai/ai.module';
import { DepartmentsModule } from '@modules/departments/departments.module';
import { WebsocketModule } from '@modules/websocket/websocket.module';
import { HealthModule } from './health/health.module';
import appConfig from '@config/app.config';
import authConfig from '@config/auth.config';
import storageConfig from '@config/storage.config';
import aiConfig from '@config/ai.config';

@Module({
  imports: [
    // Config
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, authConfig, storageConfig, aiConfig],
      envFilePath: ['.env.local', '.env'],
    }),

    // Rate limiting
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        { name: 'short', ttl: 1000, limit: 20 },
        { name: 'medium', ttl: 10000, limit: 100 },
        { name: 'long', ttl: 60000, limit: 500 },
      ],
    }),

    // Cache (Redis)
    CacheModule.registerAsync({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        store: await redisStore({
          host: config.get('REDIS_HOST', 'localhost'),
          port: config.get<number>('REDIS_PORT', 6379),
          password: config.get('REDIS_PASSWORD'),
          ttl: 300,
        }),
      }),
    }),

    // Queue (BullMQ)
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        redis: {
          host: config.get('REDIS_HOST', 'localhost'),
          port: config.get<number>('REDIS_PORT', 6379),
          password: config.get('REDIS_PASSWORD'),
        },
      }),
    }),

    // Core modules
    DatabaseModule,
    HealthModule,

    // Feature modules
    AuthModule,
    UsersModule,
    DepartmentsModule,
    FeedModule,
    AnnouncementsModule,
    KnowledgeModule,
    DocumentsModule,
    RecognitionModule,
    EventsModule,
    SearchModule,
    NotificationsModule,
    AdminModule,
    AiModule,
    WebsocketModule,
  ],
})
export class AppModule {}
