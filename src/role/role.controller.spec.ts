import { Test, TestingModule } from '@nestjs/testing';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Request } from 'express';

describe('RoleController', () => {
  let controller: RoleController;
  let roleService: RoleService;

  beforeEach(async () => {
    const roleServiceMock = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoleController],
      providers: [
        {
          provide: RoleService,
          useValue: roleServiceMock,
        },
      ],
    }).compile();

    controller = module.get<RoleController>(RoleController);
    roleService = module.get<RoleService>(RoleService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should successfully create a role', async () => {
      const createRoleDto: CreateRoleDto = {
        roleName: 'USER',
      } as any;
      const request: Request = {} as Request as any;
      const result = { id: '123', roleName: 'USER' };

      jest.spyOn(roleService, 'create').mockResolvedValue(result as any);

      expect(await controller.create(createRoleDto, request as any)).toBe(
        result,
      );
      expect(roleService.create).toHaveBeenCalledWith(createRoleDto, request);
    });
  });

  describe('findAll', () => {
    it('should return an array of roles', async () => {
      const result = [
        { id: '1', roleName: 'USER' },
        { id: '2', roleName: 'ADMIN' },
      ];

      jest.spyOn(roleService, 'findAll').mockResolvedValue(result);

      expect(await controller.findAll()).toBe(result);
      expect(roleService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a role by id', async () => {
      const result = { id: '1', roleName: 'USER' };

      jest.spyOn(roleService, 'findOne').mockResolvedValue(result as any);

      expect(await controller.findOne('1')).toBe(result);
      expect(roleService.findOne).toHaveBeenCalledWith('1');
    });

    it('should throw an error if role is not found', async () => {
      jest.spyOn(roleService, 'findOne').mockResolvedValue(null);

      try {
        await controller.findOne('999');
      } catch (error) {
        expect(error).toBeDefined();
        expect(error.status).toBe(404); // Assuming 404 for not found
      }
    });
  });

  describe('update', () => {
    it('should successfully update a role', async () => {
      const updateRoleDto: UpdateRoleDto = {
        roleName: 'SUPERADMIN',
      } as any;
      const request: Request = {} as Request;
      const result = { id: '1', roleName: 'SUPERADMIN' } as any;

      jest.spyOn(roleService, 'update').mockResolvedValue(result as any);

      expect(await controller.update('1', updateRoleDto, request as any)).toBe(
        result,
      );
      expect(roleService.update).toHaveBeenCalledWith(
        '1',
        updateRoleDto,
        request,
      );
    });
  });

  describe('remove', () => {
    it('should successfully delete a role', async () => {
      const result = { id: '1', roleName: 'USER' };

      jest.spyOn(roleService, 'remove').mockResolvedValue(result as any);

      expect(await controller.remove('1')).toBe(result);
      expect(roleService.remove).toHaveBeenCalledWith('1');
    });

    it('should throw an error if role is not found', async () => {
      jest.spyOn(roleService, 'remove').mockResolvedValue(null);

      try {
        await controller.remove('999');
      } catch (error) {
        expect(error).toBeDefined();
        expect(error.status).toBe(404); // Assuming 404 for not found
      }
    });
  });
});
