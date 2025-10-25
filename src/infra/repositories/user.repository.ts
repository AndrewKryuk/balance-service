import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseTypeOrmRepository } from '@kryuk/ddd-kit/infra/base/base-type-orm.repository';
import { UserEntity } from '@infra/entities/user.entity';
import { User } from '@domain/entities/user';
import { UserRepositoryAbstract } from '@domain/abstract/repositories/user-repository.abstract';
import Decimal from 'decimal.js';

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

  async atomicUpdateBalance(userId: string, delta: Decimal): Promise<number> {
    const result = await this.userRepository
      .createQueryBuilder()
      .update()
      .set({ balance: () => `balance + ${delta.toString()}` })
      .where('id = :userId', { userId })
      .andWhere(`balance + ${delta.toString()} >= 0`)
      .execute();

    return result.affected ?? 0;
  }
}
