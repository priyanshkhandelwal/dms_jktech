import { Inject, Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UploadDocumentDto } from './dto/upload.dto';
import { UpdateDocumentDto } from './dto/update.dto';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '../drizzle/schema';
import * as fs from 'fs';
import * as path from 'path';
import { eq } from 'drizzle-orm';

@Injectable()
export class DocumentService {
  constructor(
    @Inject('drizzleProvider') private db: PostgresJsDatabase<typeof schema>,
  ) {}

  /**
   * Handles document upload logic.
   */
  async uploadDocument(
    uploadDocumentDto: UploadDocumentDto,
    file: Express.Multer.File,
    req: any,
  ) {
    return await this.db.insert(schema.document).values({
      title: uploadDocumentDto.title,
      fileName: file.filename,
      filePath: `./uploads/${file.filename}`,
      createdBy: req['user']?.id,
    });
  }

  /**
   * Retrieves all documents.
   */
  async getDocuments() {
    return await this.db.select().from(schema.document);
  }

  /**
   * Finds a document by ID and returns its details.
   */
  async downloadDocument(id: string) {
    const document = await this.db
      .select({})
      .from(schema.document)
      .where(eq(schema.document.id, id));
    if (!document) {
      throw new HttpException('Document not found', HttpStatus.NOT_FOUND);
    }
    return document[0];
  }

  /**
   * Deletes a document by ID.
   */
  async deleteDocument(id: string) {
    const document = await this.downloadDocument(id);
    if (document) {
      fs.unlinkSync(document[0]?.filePath); // Delete the file from the file system
    }
    return await this.db
      .delete(schema.document)
      .where(eq(schema.document.id, id));
  }

  /**
   * Renames a document fileName.
   */
  async renameDocument(id: string, updateDocumentDto: UpdateDocumentDto) {
    const document = await this.downloadDocument(id);
    if (!document) {
      throw new HttpException('Document not found', HttpStatus.NOT_FOUND);
    }
    const newFilePath = path.join(
      path.dirname(document[0]?.filePath),
      updateDocumentDto.fileName,
    );
    fs.renameSync(document[0]?.filePath, newFilePath); // Rename the file
    return await this.db
      .update(schema.document)
      .set({
        fileName: updateDocumentDto.fileName,
        filePath: newFilePath,
      })
      .where(eq(schema.document.id, id));
  }
}
