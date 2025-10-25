import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { repositoriesProviders } from '@infra/repositories/repositories.providers';
import { UserEntity } from '@infra/entities/user.entity';
import { TransactionEntity } from '@infra/entities/transaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, TransactionEntity])],
  providers: repositoriesProviders,
  exports: repositoriesProviders,
})
export class RepositoriesModule {}
