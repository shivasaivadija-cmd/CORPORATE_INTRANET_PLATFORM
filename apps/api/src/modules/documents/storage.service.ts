import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private s3: S3Client;
  private bucket: string;
  private cdnUrl: string;

  constructor(private config: ConfigService) {
    this.bucket = config.get('storage.s3Bucket', 'intranet-uploads');
    this.cdnUrl = config.get('storage.cdnUrl', '');

    this.s3 = new S3Client({
      region: config.get('storage.awsRegion', 'us-east-1'),
      credentials: {
        accessKeyId: config.get('storage.awsAccessKeyId', ''),
        secretAccessKey: config.get('storage.awsSecretAccessKey', ''),
      },
    });
  }

  async upload(file: Express.Multer.File, folder = 'uploads'): Promise<{ key: string; url: string }> {
    const ext = file.originalname.split('.').pop();
    const key = `${folder}/${uuidv4()}.${ext}`;

    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        ContentDisposition: 'inline',
      }),
    );

    const url = this.cdnUrl
      ? `${this.cdnUrl}/${key}`
      : `https://${this.bucket}.s3.amazonaws.com/${key}`;

    return { key, url };
  }

  async getPresignedUrl(key: string, expiresIn = 3600): Promise<string> {
    return getSignedUrl(
      this.s3,
      new GetObjectCommand({ Bucket: this.bucket, Key: key }),
      { expiresIn },
    );
  }

  async delete(key: string): Promise<void> {
    await this.s3.send(new DeleteObjectCommand({ Bucket: this.bucket, Key: key }));
  }
}
