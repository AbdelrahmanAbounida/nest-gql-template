import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly entityManager: EntityManager,
  ) {}

  async create(createUserInput: CreateUserInput) {
    try {
      const user = this.userRepository.create(createUserInput);
      await this.entityManager.transaction(
        async (transactionalEntityManager) => {
          await transactionalEntityManager.save(user);
        },
      );
      return user;
    } catch (e) {
      console.log(e);
      throw new Error('Error creating user');
    }
  }

  async findAll() {
    return this.userRepository.find();
  }

  async findById(id: number) {
    return this.userRepository.findOneBy({ id });
  }

  async findByEmail(email: string) {
    return this.userRepository.findOneBy({ email });
  }

  async update(id: number, updateUserInput: UpdateUserInput) {
    // check if user exists
    const user = await this.findById(id);
    if (!user) {
      throw new Error('User not found');
    }

    // const updatedUser = Object.assign(user, updateUserInput);
    await this.entityManager.transaction(async (transactionalEntityManager) => {
      await transactionalEntityManager.update(User, id, updateUserInput);
    });
    return;
  }

  async remove(id: number) {
    // check if user exists
    const user = await this.findById(id);
    if (!user) {
      throw new Error('User not found');
    }

    // this.userRepository.delete(id)
    // this.entityManager.delete(User, id)
    // this.entityManager.remove(user)

    await this.entityManager.transaction(async (transactionalEntityManager) => {
      await transactionalEntityManager.delete(User, id);
    });
    return;
  }
}
