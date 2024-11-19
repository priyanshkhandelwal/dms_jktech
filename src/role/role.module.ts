import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { drizzleProvider } from 'src/drizzle/drizzle.provider';

@Module({
  controllers: [RoleController],
  providers: [RoleService, drizzleProvider],
})
export class RoleModule {}
