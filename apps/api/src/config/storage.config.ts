import { registerAs } from '@nestjs/config';

export default registerAs('storage', () => ({
  provider: process.env.STORAGE_PROVIDER || 's3',
  awsRegion: process.env.AWS_REGION || 'us-east-1',
  awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
  awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  s3Bucket: process.env.S3_BUCKET_NAME || 'intranet-uploads',
  cdnUrl: process.env.CDN_URL || '',
  maxFileSizeMB: parseInt(process.env.MAX_FILE_SIZE_MB || '50', 10),
  allowedMimeTypes: (
    process.env.ALLOWED_MIME_TYPES ||
    'image/jpeg,image/png,image/gif,image/webp,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,video/mp4'
  ).split(','),
}));
