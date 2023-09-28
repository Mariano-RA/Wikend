import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FileService {
  async uploadPublicFile(dataBuffer: Buffer, filename: string) {
    try {
      const s3 = new S3();
      const uploadResult = await s3
        .upload({
          Bucket: 'equipo6-wikend',
          Body: dataBuffer,
          Key: `${uuidv4()}-${filename}`,
          ACL: 'public-read',
        })
        .promise();

      return {
        key: uploadResult.Key,
        url: uploadResult.Location,
      };
    } catch (err) {
      console.log(err);
      return { key: 'error', url: err.message };
    }
  }

  async deleteS3File(key: string) {
    try {
      const s3 = new S3();

      const params = {
        Bucket: 'equipo6-wikend', // Reemplaza con tu nombre de bucket
        Key: key,
      };

      await s3.deleteObject(params).promise();
      return `Archivo ${key} eliminado con éxito.`;
    } catch (err) {
      console.error(`Error al eliminar el archivo ${key}: ${err.message}`);
      throw err;
    }
  }
}
