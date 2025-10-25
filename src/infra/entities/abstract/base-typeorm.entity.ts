import { BaseEntity } from 'typeorm';
import { instanceToPlain } from 'class-transformer';
import { ITypeOrmEntity } from '@kryuk/ddd-kit/domain/interfaces/entity/type-orm-entity.interface';

export abstract class BaseTypeOrmEntity
  extends BaseEntity
  implements ITypeOrmEntity
{
  toJSON(): Record<string, any> {
    return instanceToPlain(this, { exposeUnsetFields: false });
  }

  abstract toDomain(): any;
}
