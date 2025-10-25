import { Module } from '@nestjs/common';
import { InfraModule } from '@infra/infra.module';
import { ApplicationModule } from '@application/application.module';
import { HealthModule } from '@kryuk/ddd-kit/transport/health/health.module';
import { TransactionsController } from '@transport/http/controllers/transactions.controller';

@Module({
  imports: [InfraModule, ApplicationModule, HealthModule],
  controllers: [TransactionsController],
  exports: [],
})
export class TransportModule {}
