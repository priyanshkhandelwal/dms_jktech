import {
  Controller,
  Post,
  Get,
  Delete,
  Patch,
  Param,
  Body,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
  HttpException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiConsumes,
  ApiBearerAuth,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import { DocumentService } from './document.service';
import { UploadDocumentDto } from './dto/upload.dto';
import { UpdateDocumentDto } from './dto/update.dto';
import { diskStorage } from 'multer';
import { AdminGuard } from 'src/guards/admin.guard';
import { EditorGuard } from 'src/guards/editor.guard';
import { ViewerGuard } from 'src/guards/viewer.guard';

@ApiTags('Document') // Swagger group tag
@Controller('document')
@ApiBearerAuth('Authorization') // Secures all endpoints
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  /**
   * POST endpoint to upload a document. Only accessible by admins and editors.
   */
  @Post('upload')
  @UseGuards(AdminGuard, EditorGuard) // Only admins and editors can upload documents
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('document', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          callback(null, `${Date.now()}-${file.originalname}`);
        },
      }),
    }),
  )
  async uploadDocument(
    @Body() uploadDocumentDto: UploadDocumentDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ) {
    return this.documentService.uploadDocument(uploadDocumentDto, file, req);
  }

  /**
   * GET endpoint to list all documents. Accessible by admins, editors, and viewers.
   */
  @Get()
  @UseGuards(AdminGuard, EditorGuard, ViewerGuard) // Accessible by admins, editors, and viewers
  @ApiResponse({ status: 200, description: 'List of documents.' })
  async getDocuments() {
    return this.documentService.getDocuments();
  }

  /**
   * GET endpoint to download a document by its ID. Accessible by admins and editors.
   */
  @Get('download/:id')
  @UseGuards(AdminGuard, EditorGuard) // Only admins and editors can download documents
  @ApiParam({ name: 'id', description: 'ID of the document to download' })
  async downloadDocument(@Param('id') id: string, @Res() res: Response) {
    const file = await this.documentService.downloadDocument(id);
    if (!file) {
      throw new HttpException('Document not found', HttpStatus.NOT_FOUND);
    }
    res.download(file[0]?.filePath, file[0]?.fileName);
  }

  /**
   * DELETE endpoint to remove a document by its ID. Only accessible by admins.
   */
  @Delete(':id')
  @UseGuards(AdminGuard, EditorGuard) // Only admins can delete documents
  @ApiParam({ name: 'id', description: 'ID of the document to delete' })
  async deleteDocument(@Param('id') id: string) {
    return this.documentService.deleteDocument(id);
  }

  /**
   * PATCH endpoint to rename a document by its ID. Only accessible by admins and editors.
   */
  @Patch('rename/:id')
  @UseGuards(AdminGuard, EditorGuard) // Only admins and editors can rename documents
  @ApiParam({ name: 'id', description: 'ID of the document to rename' })
  async renameDocument(
    @Param('id') id: string,
    @Body() updateDocumentDto: UpdateDocumentDto,
  ) {
    return this.documentService.renameDocument(id, updateDocumentDto);
  }
}
