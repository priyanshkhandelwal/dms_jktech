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

// Define Swagger metadata for the Roles API
@ApiTags('Roles') // Specify the tag for grouping the roles-related endpoints in Swagger UI
@Controller('role') // Define the base route for the controller
@ApiBearerAuth('Authorization') // Indicate that bearer authentication is required for these routes
@UseGuards(AdminGuard) // Apply the AdminGuard to ensure only users with 'ADMIN' role can access these endpoints
export class RoleController {
  // Inject the RoleService to interact with the role data
  constructor(private readonly roleService: RoleService) {}

  // POST endpoint to create a new role
  @Post()
  create(@Body() createRoleDto: CreateRoleDto, @Req() req: Request) {
    return this.roleService.create(createRoleDto, req); // Delegate the creation logic to the service
  }

  // GET endpoint to fetch all roles
  @Get()
  findAll() {
    return this.roleService.findAll(); // Call the service to fetch all roles
  }

  // GET endpoint to fetch a role by its ID
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roleService.findOne(id); // Convert the ID to a number and fetch the specific role
  }

  // PATCH endpoint to update a role by its ID
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
    @Req() req: Request,
  ) {
    return this.roleService.update(id, updateRoleDto, req); // Delegate the update logic to the service
  }

  // DELETE endpoint to remove a role by its ID
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roleService.remove(id); // Delegate the removal logic to the service
  }
}
