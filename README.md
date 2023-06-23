# Documentation

- The domain logic for managing Property objects (CRUD operations) is in `PropertyService`
- `PropertyFilter` represents filtering and pagination settings for the `GET /` endpoint
- Routes in `propertyRoutes` extract relevant data from the query and calls the appropriate function
  in `PropertyService`
    - instantiation from json object to class object is done using `class-transformer`
    - input data validation is done using `class-validator` (configured via decorators on `Property`
      and `PropertyFilter`)
- I did not have the time to complete all tests
    - integration tests (`propertyRoutes.spec.ts`) are missing some error cases to be tested
    - unit tests (`PropertyService.spec.ts`) are missing even more but the missing tests would follow the same logic as
      the other ones
    - I added some comments inline towards the end of both test files with a little more details and context