import request, { Response }     from 'supertest';
import app                       from '../../app';
import AppDataSource, { seedDb } from '../../dataSource';
import { Property }              from '../../entities';

describe('propertyRoutes', () => {
  beforeAll(async () => {
    await AppDataSource.initialize();
    await seedDb();
  });

  describe('GET /properties', () => {
    it('should return all properties', async () => {
      const response: Response = await request(app).get('/properties?pageSize=500');
      const data: Property[]   = response.body;

      expect(data.length).toEqual(126);
    });

    it('should a list of properties with expected attributes', async () => {
      const response: Response = await request(app).get('/properties');
      const data: Property[]   = response.body;

      expect(data.length).toBeGreaterThan(0);

      // Objects are sorted by id in the response
      expect(data[0]).toMatchObject(<Property>{
        id: 1,
        address: '74434 East Sweet Bottom Br #18393',
        price: 20714261,
        bedrooms: 2,
        bathrooms: 5,
        type: null,
      });
    });

    describe('pagination', () => {
      it('should default to page 1 of size 10', async () => {
        const response: Response = await request(app).get('/properties');
        const data: Property[]   = response.body;

        expect(data.length).toEqual(10);
        expect(data[0].id).toEqual(1);
      });

      it('should return the requested page of the requested size', async () => {
        const response: Response = await request(app).get('/properties?page=3&pageSize=5');
        const data: Property[]   = response.body;

        expect(data.length).toEqual(5);
        expect(data[0].id).toEqual(11); // first id of the third 5-item page
      });
    });

    describe('filters', () => {
      describe('by address', () => {
        it('should allow partial matching', async () => {
          const response: Response = await request(app).get('/properties?address=west');
          const data: Property[]   = response.body;

          expect.assertions(10);
          for (const property of data) {
            expect(property.address).toMatch(/west/i);
          }
        });
      });

      describe('by price', () => {
        describe('error cases', () => {
          it('should throw a 400 if the operand is not provided along with the price', async () => {
            const response: Response = await request(app).get('/properties?price=10000000');
            expect(response.status).toBe(400);
            expect(response.body[0].constraints.isNotEmpty).toBeDefined();
          });

          it('should throw a 400 if price lower than zero', async () => {
            const response: Response = await request(app).get('/properties?price=-2&priceOperand==');
            expect(response.status).toBe(400);
            expect(response.body[0].constraints.min).toBeDefined();
          });
        });

        it('should match lower prices', async () => {
          const response: Response = await request(app).get('/properties?price=10000000&priceOperand=<');
          const data: Property[]   = response.body;

          expect.assertions(10);
          for (const property of data) {
            expect(property.price).toBeLessThan(10_000_000);
          }
        });

        it('should match exact price', async () => {
          const response: Response = await request(app).get('/properties?price=23507305&priceOperand==');
          const data: Property[]   = response.body;

          expect.assertions(3);
          for (const property of data) {
            expect(property.price).toEqual(23507305);
          }
        });
      });

      describe('by bedrooms', () => {
        describe('error cases', () => {
          it('should throw a 400 if the operand is not provided along with the bedrooms', async () => {
            const response: Response = await request(app).get('/properties?bedrooms=10000000');
            expect(response.status).toBe(400);
            expect(response.body[0].constraints.isNotEmpty).toBeDefined();
          });

          it('should throw a 400 if bedrooms is not a number', async () => {
            const response: Response = await request(app).get('/properties?bedrooms=four&bedroomsOperand==');
            expect(response.status).toBe(400);
            expect(response.body[0].constraints.isNumber).toBeDefined();
          });

          it('should throw a 400 if bedrooms lower than zero', async () => {
            const response: Response = await request(app).get('/properties?bedrooms=-2&bedroomsOperand==');
            expect(response.status).toBe(400);
            expect(response.body[0].constraints.min).toBeDefined();
          });
        });

        it('should match higher counts', async () => {
          const response: Response = await request(app).get('/properties?bedrooms=3&bedroomsOperand=>=');
          const data: Property[]   = response.body;

          expect.assertions(10);
          for (const property of data) {
            expect(property.bedrooms).toBeGreaterThanOrEqual(3);
          }
        });
      });

      describe('by bathrooms', () => {
        describe('error cases', () => {
          it('should throw a 400 if the operand is not provided along with the bathrooms', async () => {
            const response: Response = await request(app).get('/properties?bathrooms=10000000');
            expect(response.status).toBe(400);
            expect(response.body[0].constraints.isNotEmpty).toBeDefined();
          });

          it('should throw a 400 if bathrooms is not a number', async () => {
            const response: Response = await request(app).get('/properties?bathrooms=four&bathroomsOperand==');
            expect(response.status).toBe(400);
            expect(response.body[0].constraints.isNumber).toBeDefined();
          });

          it('should throw a 400 if bathrooms lower than zero', async () => {
            const response: Response = await request(app).get('/properties?bathrooms=-2&bathroomsOperand==');
            expect(response.status).toBe(400);
            expect(response.body[0].constraints.min).toBeDefined();
          });
        });

        it('should match equal count', async () => {
          const response: Response = await request(app).get('/properties?bathrooms=2&bathroomsOperand==');
          const data: Property[]   = response.body;

          expect.assertions(10);
          for (const property of data) {
            expect(property.bathrooms).toEqual(2);
          }
        });
      });

      describe('by type', () => {
        it('should throw a 400 if type is not allowed', async () => {
          const response: Response = await request(app).get('/properties?type=BeachHouse');
          expect(response.status).toBe(400);
          expect(response.body[0].constraints.isIn).toBeDefined();
        });

        it('should match equal count', async () => {
          const response: Response = await request(app).get('/properties?type=Townhouse');
          const data: Property[]   = response.body;

          expect.assertions(10);
          for (const property of data) {
            expect(property.type).toEqual('Townhouse');
          }
        });
      });
    });
  });

  describe('GET /properties/:id', () => {
    it('should throw 404 if id not found', async () => {
      const response: Response = await request(app).get('/properties/500000');
      expect(response.status).toBe(404);
    });

    it('should return accessed property', async () => {
      const response: Response = await request(app).get('/properties/2');
      expect(response.body).toMatchObject(<Property>{
        id: 2,
        address: '8369 West MAJESTY STREET Path #1765',
        price: 9375751,
        bedrooms: 3,
        bathrooms: 6,
        type: null,
      });
    });
  });

  describe('POST /properties', () => {
    let payload: Partial<Property>;

    beforeEach(() => {
      payload = {
        address: 'Address Test',
        price: 100000,
        bedrooms: 2,
        bathrooms: 2,
        type: 'Condominium',
      };
    });

    describe('validation', () => {
      it('should throw 400 if address is missing', async () => {
        payload.address          = '';
        const response: Response = await request(app).post('/properties').send(payload);
        expect(response.status).toBe(400);
        expect(response.body[0].constraints.isNotEmpty).toBeDefined();
      });

      it('should throw 400 if price is missing', async () => {
        payload.price            = undefined;
        const response: Response = await request(app).post('/properties').send(payload);
        expect(response.status).toBe(400);
        expect(response.body[0].constraints.isNotEmpty).toBeDefined();
      });

      /** Etc (running out of time so I'm skipping some tests here, basically similar to the ones above) */
      /** Todo: implement missing test cases */
    });

    it('should return accessed property', async () => {
      const response: Response = await request(app).post('/properties').send(payload);
      expect(response.body.id).toBeGreaterThan(0);
      expect(response.body).toMatchObject(payload);
    });
  });

  describe('PUT /properties/:id', () => {
    describe('validation', () => {
      // Todo: similar to POST but needs to be retested as they involve different validation groups
    });

    it('should update and return property', async () => {
      const response: Response = await request(app).put('/properties/3').send({ address: 'New Address' });
      expect(response.body).toMatchObject({
        id: 3,
        address: 'New Address',
        price: 12104869,
        bedrooms: 5,
        bathrooms: 4,
        type: null,
      });

      // Testng persistence by re-querying the property
      const updated: Response = await request(app).get('/properties/3');
      expect(updated.body.address).toEqual('New Address');
    });

    // Todo: Test updating all other fields
  });

  describe('DELETE /properties/:id', () => {
    it('should throw 404 if id not found', async () => {
      const response: Response = await request(app).get('/properties/500000');
      expect(response.status).toBe(404);
    });

    it('should delete targeted property', async () => {
      let response: Response;
      response = await request(app).get('/properties/42');
      expect(response.status).toBe(200);

      await request(app).delete('/properties/42');

      response = await request(app).get('/properties/42');
      expect(response.status).toBe(404);
    });
  });
});
