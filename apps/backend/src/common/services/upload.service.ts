import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as sharp from 'sharp';
import * as fs from 'fs/promises';
import * as path from 'path';

export interface UploadConfig {
  destination: string;
  maxSize: number; // en bytes
  allowedTypes: string[];
  resizeOptions?: {
    width: number;
    height: number;
    quality: number;
  };
  generateThumbnail?: {
    width: number;
    height: number;
    quality: number;
  };
}

export interface UploadResult {
  originalName: string;
  filename: string;
  path: string;
  size: number;
  mimetype: string;
  thumbnailPath?: string;
}

@Injectable()
export class UploadService {
  /**
   * Valide un fichier selon la configuration
   */
  private validateFile(file: Express.Multer.File, config: UploadConfig): void {
    // Vérifier si le fichier existe
    if (!file) {
      throw new BadRequestException('Aucun fichier fourni');
    }

    // Debug logging
    console.log('File validation debug:', {
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      allowedTypes: config.allowedTypes
    });

    // Vérifier la taille
    if (file.size > config.maxSize) {
      throw new BadRequestException(
        `Le fichier est trop volumineux. Taille maximale: ${this.formatBytes(config.maxSize)}`
      );
    }

    // Vérifier le type MIME
    if (!config.allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `Type de fichier non autorisé. Types autorisés: ${config.allowedTypes.join(', ')}`
      );
    }

    // Vérifier l'extension
    const ext = extname(file.originalname).toLowerCase();
    const allowedExtensions = config.allowedTypes.map(type => {
      switch (type) {
        case 'image/jpeg': return '.jpg';
        case 'image/jpg': return '.jpg';
        case 'image/png': return '.png';
        case 'image/webp': return '.webp';
        case 'image/gif': return '.gif';
        case 'application/pdf': return '.pdf';
        case 'application/msword': return '.doc';
        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': return '.docx';
        case 'application/vnd.ms-excel': return '.xls';
        case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': return '.xlsx';
        case 'application/vnd.ms-powerpoint': return '.ppt';
        case 'application/vnd.openxmlformats-officedocument.presentationml.presentation': return '.pptx';
        case 'text/plain': return '.txt';
        case 'text/csv': return '.csv';
        case 'application/zip': return '.zip';
        case 'application/x-rar-compressed': return '.rar';
        default: return extname(type);
      }
    });
    
    // Debug logging for extension validation
    console.log('Extension validation debug:', {
      fileExtension: ext,
      allowedExtensions: allowedExtensions,
      isValid: allowedExtensions.includes(ext)
    });
    
    if (!allowedExtensions.includes(ext)) {
      throw new BadRequestException(
        `Le fichier "${file.originalname}" n'est pas supporté. Extensions autorisées: ${allowedExtensions.join(', ')}`
      );
    }
  }

  /**
   * Génère un nom de fichier unique
   */
  private generateUniqueFilename(originalName: string): string {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const ext = extname(originalName);
    return `${timestamp}-${randomString}${ext}`;
  }

  /**
   * Compresse et redimensionne une image
   */
  private async processImage(
    buffer: Buffer,
    config: UploadConfig
  ): Promise<{ mainBuffer: Buffer; thumbnailBuffer?: Buffer }> {
    try {
      let mainImage = sharp(buffer);

      // Redimensionner l'image principale si configuré
      if (config.resizeOptions) {
        mainImage = mainImage.resize(
          config.resizeOptions.width,
          config.resizeOptions.height,
          {
            fit: 'cover',
            position: 'center'
          }
        );
      }

      // Compresser l'image principale
      const quality = config.resizeOptions?.quality || 80;
      const mainBuffer = await mainImage
        .webp({ quality })
        .toBuffer();

      // Générer une miniature si configuré
      let thumbnailBuffer: Buffer | undefined;
      if (config.generateThumbnail) {
        thumbnailBuffer = await sharp(buffer)
          .resize(
            config.generateThumbnail.width,
            config.generateThumbnail.height,
            {
              fit: 'cover',
              position: 'center'
            }
          )
          .webp({ quality: config.generateThumbnail.quality })
          .toBuffer();
      }

      return { mainBuffer, thumbnailBuffer };
    } catch (error) {
      throw new InternalServerErrorException('Erreur lors du traitement de l\'image');
    }
  }

  /**
   * Sauvegarde un fichier sur le disque
   */
  private async saveFile(
    buffer: Buffer,
    filename: string,
    destination: string
  ): Promise<string> {
    try {
      // Créer le dossier de destination s'il n'existe pas
      await fs.mkdir(destination, { recursive: true });

      const filePath = path.join(destination, filename);
      await fs.writeFile(filePath, buffer);
      
      return filePath;
    } catch (error) {
      throw new InternalServerErrorException('Erreur lors de la sauvegarde du fichier');
    }
  }

  /**
   * Supprime un fichier du disque
   */
  async deleteFile(filePath: string): Promise<void> {
    try {
      await fs.unlink(filePath);
    } catch (error) {
      // Ignorer l'erreur si le fichier n'existe pas
      if (error.code !== 'ENOENT') {
        throw new InternalServerErrorException('Erreur lors de la suppression du fichier');
      }
    }
  }

  /**
   * Upload principal avec traitement d'image
   */
  async uploadImage(file: Express.Multer.File, config: UploadConfig): Promise<UploadResult> {
    // Valider le fichier
    this.validateFile(file, config);

    // Générer un nom unique
    const filename = this.generateUniqueFilename(file.originalname);
    const thumbnailFilename = config.generateThumbnail 
      ? `thumb-${filename.replace(/\.[^/.]+$/, '.webp')}`
      : undefined;

    try {
      // Traiter l'image
      const { mainBuffer, thumbnailBuffer } = await this.processImage(file.buffer, config);

      // Sauvegarder l'image principale
      const mainPath = await this.saveFile(mainBuffer, filename, config.destination);

      // Sauvegarder la miniature si elle existe
      let thumbnailPath: string | undefined;
      if (thumbnailBuffer && thumbnailFilename) {
        thumbnailPath = await this.saveFile(thumbnailBuffer, thumbnailFilename, config.destination);
      }

      return {
        originalName: file.originalname,
        filename,
        path: mainPath,
        size: mainBuffer.length,
        mimetype: 'image/webp',
        thumbnailPath
      };
    } catch (error) {
      // Nettoyer en cas d'erreur
      if (error instanceof BadRequestException || error instanceof InternalServerErrorException) {
        throw error;
      }
      throw new InternalServerErrorException('Erreur lors de l\'upload du fichier');
    }
  }

  /**
   * Upload de fichier générique (sans traitement d'image)
   */
  async uploadFile(file: Express.Multer.File, config: UploadConfig): Promise<UploadResult> {
    // Valider le fichier
    this.validateFile(file, config);

    // Générer un nom unique
    const filename = this.generateUniqueFilename(file.originalname);

    try {
      // Sauvegarder le fichier directement
      const filePath = await this.saveFile(file.buffer, filename, config.destination);

      return {
        originalName: file.originalname,
        filename,
        path: filePath,
        size: file.size,
        mimetype: file.mimetype
      };
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof InternalServerErrorException) {
        throw error;
      }
      throw new InternalServerErrorException('Erreur lors de l\'upload du fichier');
    }
  }

  /**
   * Configuration par défaut pour les avatars
   */
  getAvatarConfig(): UploadConfig {
    return {
      destination: './uploads/avatars',
      maxSize: 5 * 1024 * 1024, // 5MB
      allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
      resizeOptions: {
        width: 400,
        height: 400,
        quality: 85
      },
      generateThumbnail: {
        width: 100,
        height: 100,
        quality: 80
      }
    };
  }

  /**
   * Configuration pour les images de projets
   */
  getProjectImageConfig(): UploadConfig {
    return {
      destination: './uploads/projects',
      maxSize: 10 * 1024 * 1024, // 10MB
      allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
      resizeOptions: {
        width: 1200,
        height: 800,
        quality: 90
      },
      generateThumbnail: {
        width: 300,
        height: 200,
        quality: 75
      }
    };
  }

  /**
   * Configuration pour les fichiers génériques
   */
  getGenericFileConfig(): UploadConfig {
    return {
      destination: './uploads/files',
      maxSize: 50 * 1024 * 1024, // 50MB
      allowedTypes: [
        'image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'text/plain',
        'text/csv',
        'application/zip',
        'application/x-rar-compressed'
      ]
    };
  }

  /**
   * Formate les bytes en format lisible
   */
  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}
