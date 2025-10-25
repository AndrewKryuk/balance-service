import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseTypeOrmRepository } from '@kryuk/ddd-kit/infra/base/base-type-orm.repository';
import { UserEntity } from '@infra/entities/user.entity';
import { User } from '@domain/entities/user';
import { UserRepositoryAbstract } from '@domain/abstract/repositories/user-repository.abstract';
import { Nullable } from '@kryuk/ddd-kit/domain/types/nullable';

@Injectable()
export class UserRepository
  extends BaseTypeOrmRepository<UserEntity, User>
  implements UserRepositoryAbstract
{
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {
    super(userRepository);
  }

  async findOneByIdWithLock(id: string): Promise<Nullable<User>> {
    const userEntity = await this.userRepository.findOne({
      where: { id },
      lock: { mode: 'pessimistic_write' },
    });

    return userEntity?.toDomain() ?? null;
  }
}
