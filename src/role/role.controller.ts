import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from 'src/guards/admin.guard';
import { ViewerGuard } from 'src/guards/viewer.guard';
import { EditorGuard } from 'src/guards/editor.guard';

// Define Swagger metadata for the Roles API
@ApiTags('Roles') // Specify the tag for grouping the roles-related endpoints in Swagger UI
@Controller('role') // Define the base route for the controller
@ApiBearerAuth('Authorization') // Indicate that bearer authentication is required for these routes
export class RoleController {
  // Inject the RoleService to interact with the role data
  constructor(private readonly roleService: RoleService) {}

  /**
   * POST endpoint to create a new role. Only accessible by admins.
   */
  @Post()
  @UseGuards(AdminGuard) // Only admins can create roles
  create(@Body() createRoleDto: CreateRoleDto, @Req() req: Request) {
    return this.roleService.create(createRoleDto, req); // Delegate the creation logic to the service
  }

  /**
   * GET endpoint to fetch all roles. Only accessible by admins.
   */
  @Get()
  @UseGuards(AdminGuard, ViewerGuard, EditorGuard) // Only admins can fetch all roles
  findAll() {
    return this.roleService.findAll(); // Call the service to fetch all roles
  }

  /**
   * GET endpoint to fetch a role by its ID. Accessible by admins, editors, or viewers if necessary.
   */
  @Get(':id')
  @UseGuards(AdminGuard, EditorGuard, ViewerGuard) // Accessible to admins, editors, or specific role-based viewers
  findOne(@Param('id') id: string) {
    return this.roleService.findOne(id); // Fetch the specific role by ID
  }

  /**
   * PATCH endpoint to update a role by its ID. Only accessible by admins.
   */
  @Patch(':id')
  @UseGuards(AdminGuard) // Only admins can update roles
  update(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
    @Req() req: Request,
  ) {
    return this.roleService.update(id, updateRoleDto, req); // Delegate the update logic to the service
  }

  /**
   * DELETE endpoint to remove a role by its ID. Only accessible by admins.
   */
  @Delete(':id')
  @UseGuards(AdminGuard) // Only admins can delete roles
  remove(@Param('id') id: string) {
    return this.roleService.remove(id); // Delegate the removal logic to the service
  }
}
