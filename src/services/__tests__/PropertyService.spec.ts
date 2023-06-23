import AppDataSource, { seedDb } from '../../dataSource';
import { PropertyService }       from '../PropertyService';
import { PropertyFilter }        from '../PropertyFilter';
import { Property }              from '../../entities';

describe('propertyRoutes', () => {
  beforeAll(async () => {
    await AppDataSource.initialize();
    await seedDb();
  });

  let service: PropertyService;
  beforeEach(() => {
    service = new PropertyService(AppDataSource);
  });

  describe('findMany', () => {
    it('should return matching objects', async () => {
      const filter            = new PropertyFilter();
      filter.address          = 'west';
      filter.price            = 10_000_000;
      filter.priceOperand     = '<=';
      filter.bedrooms         = 4;
      filter.bedroomsOperand  = '=';
      filter.bathrooms        = 5;
      filter.bathroomsOperand = '>';
      filter.type             = 'Condominium';
      const properties        = await service.findMany(filter);

      expect(properties.length).toEqual(3);
      for (const property of properties) {
        expect(property.address).toMatch(/west/i);
        expect(property.price).toBeLessThanOrEqual(10_000_000);
        expect(property.bedrooms).toEqual(4);
        expect(property.bathrooms).toBeGreaterThan(5);
        expect(property.type).toEqual('Condominium');
      }
    });
  });

  describe('findById', () => {
    it('should call findOneOrFail and return the result', async () => {
      // I wanted to show another way to test db queries if the db was not seeded
      const property = 'MockProperty' as unknown as Property;
      jest.spyOn(service.dataSource.manager, 'findOneOrFail').mockResolvedValueOnce(property);

      const result = await service.findById(42);
      expect(service.dataSource.manager.findOneOrFail).toHaveBeenCalledWith(Property, { where: { id: 42 } });
      expect(result).toEqual(property);
    });
  });

  // Todo: running out of time, would have to implements remaining tests in similar fashion
  // Test cases are very similar as the ones in propertyRoutes.spec.ts
});