const { S3Client, PutObjectCommand, ListObjectsV2Command, DeleteObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const StorageInterface = require('../interfaces/storage.interface');
const config = require('../config/env');

class S3StorageService extends StorageInterface {
  constructor() {
    super();
    this.client = new S3Client({
      region: config.aws.region,
      credentials: {
        accessKeyId: config.aws.accessKeyId,
        secretAccessKey: config.aws.secretAccessKey,
      },
    });
    this.bucketName = config.aws.bucketName;
  }

  async generateUploadUrl(key, contentType) {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      ContentType: contentType,
    });

    // Valid for 5 minutes (300 seconds)
    return await getSignedUrl(this.client, command, { expiresIn: 300 });
  }

  async listFiles(prefix) {
    const command = new ListObjectsV2Command({
      Bucket: this.bucketName,
      Prefix: prefix,
    });

    const response = await this.client.send(command);
    const contents = response.Contents || [];

    return await Promise.all(
      contents.map(async (item) => {
        const getCommand = new GetObjectCommand({
          Bucket: this.bucketName,
          Key: item.Key,
        });

        // Valid for 15 minutes (900 seconds)
        const url = await getSignedUrl(this.client, getCommand, { expiresIn: 900 });

        return {
          key: item.Key,
          size: item.Size,
          lastModified: item.LastModified,
          url,
        };
      })
    );
  }

  async deleteFile(key) {
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    await this.client.send(command);
  }
}

module.exports = S3StorageService;
