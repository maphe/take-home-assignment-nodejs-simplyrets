import express                             from 'express';
import bodyParser                          from 'body-parser';
import { PropertyFilter, PropertyService } from '../services';
import AppDataSource                       from '../dataSource';
import { plainToInstance }                 from 'class-transformer';
import { Property }                        from '../entities';

export const propertyRoutes = express.Router();

propertyRoutes.use(bodyParser.json());
const propertyService = new PropertyService(AppDataSource);

propertyRoutes.get('/', async (req, res) => {
  try {
    const filter = plainToInstance(PropertyFilter, req.query);
    res.send(await propertyService.findMany(filter));
  } catch (errors) {
    res.status(400);
    res.send(errors);
  }
});

propertyRoutes.get('/:id', async (req, res) => {
  try {
    res.send(await propertyService.findById(+req.params.id));
  } catch {
    res.status(404);
    res.send();
  }
});

propertyRoutes.post('/', async (req, res) => {
  try {
    const property = plainToInstance(Property, req.body);
    res.send(await propertyService.createProperty(property));
  } catch (errors) {
    res.status(400);
    res.send(errors);
  }
});

propertyRoutes.put('/:id', async (req, res) => {
  try {
    const property = plainToInstance(Property, req.body);
    res.send(await propertyService.updateProperty(+req.params.id, property));
  } catch (errors) {
    res.status(400);
    res.send(errors);
  }
});

propertyRoutes.delete('/:id', async (req, res) => {
  try {
    res.send(await propertyService.deleteById(+req.params.id));
  } catch {
    res.status(404);
    res.send();
  }
});
