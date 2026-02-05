import { Injectable } from '@angular/core';
import imageCompression from 'browser-image-compression';

export interface CompressionOptions {
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
  useWebWorker?: boolean;
  quality?: number;
}

export interface CompressionResult {
  success: boolean;
  file?: File;
  originalSize: number;
  compressedSize: number;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ImageCompressionService {

  async compressImage(
    file: File, 
    targetSizeKB: number = 50,
    options?: CompressionOptions
  ): Promise<CompressionResult> {
    
    const originalSize = file.size;
    
    try {
      // Configuración por defecto
      const defaultOptions: CompressionOptions = {
        maxSizeMB: targetSizeKB / 1024, // Convertir KB a MB
        maxWidthOrHeight: 800,
        useWebWorker: true,
        quality: 0.8,
        ...options
      };

      console.log(`🖼️ Comprimiendo imagen: ${file.name}`);
      console.log(`📏 Tamaño original: ${(originalSize / 1024).toFixed(2)} KB`);
      console.log(`🎯 Objetivo: ${targetSizeKB} KB`);

      let compressedFile = await imageCompression(file, defaultOptions);
      let attempts = 1;
      const maxAttempts = 3;

      // Si aún es muy grande, intentar con configuraciones más agresivas
      while (compressedFile.size > targetSizeKB * 1024 && attempts < maxAttempts) {
        attempts++;
        console.log(`🔄 Intento ${attempts}: Tamaño actual ${(compressedFile.size / 1024).toFixed(2)} KB`);
        
        const aggressiveOptions: CompressionOptions = {
          maxSizeMB: (targetSizeKB * 0.8) / 1024, // 80% del objetivo
          maxWidthOrHeight: Math.max(400, 800 - (attempts * 200)), // Reducir resolución
          useWebWorker: true,
          quality: Math.max(0.5, 0.8 - (attempts * 0.1)), // Reducir calidad
        };

        compressedFile = await imageCompression(file, aggressiveOptions);
      }

      const compressedSize = compressedFile.size;
      const compressionRatio = ((originalSize - compressedSize) / originalSize * 100).toFixed(1);

      console.log(`✅ Compresión completada:`);
      console.log(`📉 Tamaño final: ${(compressedSize / 1024).toFixed(2)} KB`);
      console.log(`📊 Reducción: ${compressionRatio}%`);

      return {
        success: true,
        file: compressedFile,
        originalSize,
        compressedSize
      };

    } catch (error) {
      console.error('❌ Error al comprimir imagen:', error);
      return {
        success: false,
        originalSize,
        compressedSize: originalSize,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }

  /**
   * Valida si un archivo es una imagen válida
   */
  isValidImageFile(file: File): boolean {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    return allowedTypes.includes(file.type);
  }

  /**
   * Formatea el tamaño de archivo en KB o MB
   */
  formatFileSize(bytes: number): string {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(2)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }
}