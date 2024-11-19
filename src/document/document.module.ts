import { Module } from '@nestjs/common';
import { DocumentService } from './document.service';
import { DocumentController } from './document.controller';
import { drizzleProvider } from 'src/drizzle/drizzle.provider';

@Module({
  controllers: [DocumentController],
  providers: [DocumentService, drizzleProvider],
})
export class DocumentModule {}
