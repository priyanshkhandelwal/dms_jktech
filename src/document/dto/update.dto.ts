import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateDocumentDto {
  /**
   * New fileName for the document.
   * Example: "updated-document-name.pdf"
   */
  @ApiProperty({
    description: 'New fileName for the document',
    example: 'updated-document-name.pdf',
  })
  @IsString()
  fileName: string;
}
