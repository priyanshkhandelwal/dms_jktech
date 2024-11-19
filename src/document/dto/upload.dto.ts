import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UploadDocumentDto {
  /**
   * Title of the document.
   * This field is required and should be a string.
   * Example: "Project Proposal Document"
   */
  @ApiProperty({
    description: 'Title of the document being uploaded',
    example: 'Project Proposal Document',
  })
  @IsString()
  title: string; // Metadata for the file (optional)
}
