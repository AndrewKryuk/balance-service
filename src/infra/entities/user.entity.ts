import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '@domain/entities/user';
import { Money } from '@domain/value-objects/money';
import { BaseTypeOrmEntity } from '@infra/entities/abstract/base-typeorm.entity';

@Entity('users')
export class UserEntity extends BaseTypeOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'numeric', precision: 21, scale: 2, default: '0' })
  balance: string;

  toDomain(): User {
    return User.create({
      id: this.id,
      balance: Money.fromString(this.balance),
    });
  }

  static fromDomain(user: User): UserEntity {
    const self = new UserEntity();

    self.id = user.id;
    self.balance = user.balance.toString();

    return self;
  }
}
