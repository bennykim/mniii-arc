import { BaseEntity } from '@/entities/base';

export interface Group<T extends BaseEntity = BaseEntity> extends BaseEntity {
  items: T[];
}
