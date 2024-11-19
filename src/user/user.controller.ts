import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserByAdminDto, CreateUserDto } from './dto/create-user.dto';
import { AssignRoleDto, UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/decorators/public.decorator';
import { AdminGuard } from 'src/guards/admin.guard';
import { LoginDto } from './dto/login.dto';

@ApiTags('Users') // Tags for Swagger documentation
@Controller('user') // Route prefix for all user-related routes
@ApiBearerAuth('Authorization') // Enforces Authorization header for all routes
export class UserController {
  // Injecting the UserService to handle business logic
  constructor(private readonly userService: UserService) {}

  /**
   * Registers a new user.
   * @param createUserDto - The data to create a user.
   * @param req - Request object to access additional request details.
   * @returns Response from the userService create method.
   */
  @Post('register')
  @Public() // Marks this route as publicly accessible
  register(@Body() createUserDto: CreateUserDto, @Req() req: Request) {
    return this.userService.create(createUserDto, req);
  }

  /**
   * Creates a new user by an admin.
   * @param createUserByAdminDto - The data to create a user by admin.
   * @param req - Request object to access additional request details.
   * @returns Response from the userService createUserByAdmin method.
   */
  @Post('admin')
  @UseGuards(AdminGuard) // Restricts this route to admins only
  createUser(
    @Body() createUserByAdminDto: CreateUserByAdminDto,
    @Req() req: Request,
  ) {
    return this.userService.createUserByAdmin(createUserByAdminDto, req);
  }

  /**
   * Logs in a user and generates authentication token.
   * @param loginDto - The login credentials.
   * @returns Response from the userService login method.
   */
  @Public() // Marks this route as publicly accessible
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.userService.login(loginDto);
  }

  /**
   * Assigns a role to an existing user.
   * @param id - The user ID.
   * @param assignRoleDto - Data for the role assignment.
   * @param req - Request object to access additional request details.
   * @returns Response from the userService assignRole method.
   */
  @Patch('role/assign/:id')
  @UseGuards(AdminGuard) // Restricts this route to admins only
  assignRole(
    @Param('id') id: string,
    @Body() assignRoleDto: AssignRoleDto,
    @Req() req: Request,
  ) {
    return this.userService.assignRole(id, assignRoleDto, req);
  }

  /**
   * Fetches all users. This should be accessible to admins only.
   * @returns Response from the userService findAll method.
   */
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  /**
   * Fetches a single user by ID. This should be accessible to admins, editors, or the user themselves.
   * @param id - The user ID.
   * @returns Response from the userService findOne method.
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  /**
   * Updates user details by ID. This should be restricted to admins only.
   * @param id - The user ID.
   * @param updateUserDto - The data to update the user.
   * @param req - Request object to access additional request details.
   * @returns Response from the userService update method.
   */
  @Patch(':id')
  @UseGuards(AdminGuard) // Restricts this route to admins only
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: Request,
  ) {
    return this.userService.update(id, updateUserDto, req);
  }

  /**
   * Removes a user by ID. This should be restricted to admins only.
   * @param id - The user ID.
   * @returns Response from the userService remove method.
   */
  @Delete(':id')
  @UseGuards(AdminGuard) // Restricts this route to admins only
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
