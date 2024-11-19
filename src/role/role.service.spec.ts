import { Test, TestingModule } from '@nestjs/testing';
import { RoleService } from './role.service';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '../drizzle/schema';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

describe('RoleService', () => {
  let service: RoleService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let db: PostgresJsDatabase<typeof schema>;

  const mockDb = {
    insert: jest.fn(),
    select: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoleService,
        {
          provide: 'drizzleProvider',
          useValue: mockDb,
        },
      ],
    }).compile();

    service = module.get<RoleService>(RoleService);
    db = module.get<PostgresJsDatabase<typeof schema>>('drizzleProvider');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new role', async () => {
      const createRoleDto: CreateRoleDto = { roleName: 'USER' } as any;
      const req: any = { user: { id: '123' } };
      const result = { id: '123', roleName: 'USER' };

      mockDb.insert.mockResolvedValue(result);

      const response = await service.create(createRoleDto, req);

      expect(response).toBe(result);
      expect(mockDb.insert).toHaveBeenCalledWith(schema.role);
      expect(mockDb.insert).toHaveBeenCalledWith({
        ...createRoleDto,
        createdBy: req.user.id,
      });
    });
  });

  describe('findAll', () => {
    it('should return all roles', async () => {
      const result = [
        { id: '1', roleName: 'USER' },
        { id: '2', roleName: 'ADMIN' },
      ];

      mockDb.select.mockResolvedValue(result);

      const response = await service.findAll();

      expect(response).toBe(result);
      expect(mockDb.select).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a role by id', async () => {
      const result = { id: '1', roleName: 'USER' };

      mockDb.select.mockResolvedValue([result]);

      const response = await service.findOne('1');

      expect(response).toBe(result);
      expect(mockDb.select).toHaveBeenCalledWith({});
      expect(mockDb.select).toHaveBeenCalledWith({
        from: schema.role,
        where: { id: '1' },
      });
    });

    it('should return null if the role is not found', async () => {
      mockDb.select.mockResolvedValue(null);

      const response = await service.findOne('999');

      expect(response).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a role', async () => {
      const updateRoleDto: UpdateRoleDto = { roleName: 'SUPERADMIN' } as any;
      const req: any = { user: { id: '123' } };
      const result = { id: '1', roleName: 'SUPERADMIN' };

      mockDb.update.mockResolvedValue(result);

      const response = await service.update('1', updateRoleDto, req);

      expect(response).toBe(result);
      expect(mockDb.update).toHaveBeenCalledWith(schema.role);
      expect(mockDb.update).toHaveBeenCalledWith({
        ...updateRoleDto,
        updatedAt: expect.any(Date),
        updatedBy: req.user.id,
      });
    });
  });

  describe('remove', () => {
    it('should remove a role', async () => {
      const result = { id: '1', roleName: 'USER' };

      mockDb.delete.mockResolvedValue(result);

      const response = await service.remove('1');

      expect(response).toBe(result);
      expect(mockDb.delete).toHaveBeenCalledWith(schema.role);
      expect(mockDb.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('should return null if the role to delete is not found', async () => {
      mockDb.delete.mockResolvedValue(null);

      const response = await service.remove('999');

      expect(response).toBeNull();
    });
  });
});
