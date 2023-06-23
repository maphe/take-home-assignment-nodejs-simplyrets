import { Property }         from '../entities';
import AppDataSource        from '../dataSource';
import { DataSource }       from 'typeorm';
import { PropertyFilter }   from './PropertyFilter';
import { validateOrReject } from 'class-validator';

type NumberFilter = {
  op: '>' | '>=' | '<' | '<=',
  val: number
};

export interface PropertyListOptions {
  filters?: {
    address?: string,
    price?: NumberFilter,
    bedrooms?: NumberFilter,
    bathrooms?: NumberFilter,
    type?: string,
  };
  page?: number,
  perPage?: number,
}

export class PropertyService {

  constructor(public readonly dataSource: DataSource = AppDataSource) {
  }

  async findMany(options: PropertyFilter) {
    await validateOrReject(options);

    const qb = this.dataSource.getRepository(Property)
      .createQueryBuilder('p');

    if (options?.address) {
      qb.andWhere('lower(p.address) like :address', { address: `%${options.address.toLowerCase()}%` });
    }
    if (options?.price) {
      qb.andWhere(`p.price ${options.priceOperand} :price`, { price: options.price });
    }
    if (options?.bedrooms) {
      qb.andWhere(`p.bedrooms ${options.bedroomsOperand} :bedrooms`, { bedrooms: options.bedrooms });
    }
    if (options?.bathrooms) {
      qb.andWhere(`p.bathrooms ${options.bathroomsOperand} :bathrooms`, { bathrooms: options.bathrooms });
    }
    if (options?.type) {
      qb.andWhere(`p.type = :type`, { type: options.type });
    }

    const page    = options?.page ?? 1;
    const perPage = options?.pageSize ?? 10;

    qb.limit(perPage).offset(page * perPage - perPage);

    return qb.getMany();
  }

  async findById(id: number): Promise<Property> {
    return this.dataSource.manager.findOneOrFail(Property, { where: { id } });
  }

  async createProperty(property: Property) {
    await validateOrReject(property, { groups: ['create'] });
    return await this.dataSource.manager.save(Property, property);
  }

  async updateProperty(id: number, property: Property): Promise<Property> {
    await validateOrReject(property, { groups: ['update'] });
    await this.dataSource.manager.update(Property, { id }, property);
    return this.dataSource.manager.findOneOrFail(Property, { where: { id } });
  }

  async deleteById(id: number) {
    await this.dataSource.manager.delete(Property, { id });
  }
}
