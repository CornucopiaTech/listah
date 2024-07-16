# Project ToDo

## Vision

Have a shopping list app that groups things according to tags that are assigned to them.
The groups within the app are hierachical, this means that if an item (say banana) is listed as a grocery item, it should appear in all sub-groups under the grocery group such that a person can buy the item in many different stores.

However, this item should not be duplicated within the database. It should be a single item that appears in different shopping lists at the same time. Since the item is not duplicated within the database, once the item has been bought, it should temporarily or permanently disappear from all the lists that is belongs to.


Some items are bought frequently, and they should not be re-written into the shopping list app every time they are needed. Instead when an item is bought, the user has the option of removing it from the shopping list permanently (it will need to be manually added if it is needed again), or temporarily suspending it for a given period of time (after the suspension time period elapses, it will automatically re-appear within the categories it belongs to)



Technical Needs
- User accounts (authentication)
- List groups and subgroups

# API
- [ ] initialise the internal infrastructure used within the API (logging, telemetry, connection to DB)
- [ ] Define gRPC services such that each server contains all the internal infra that were bootstrapped 

- [ ] Set up logging
- [ ] Set up authentication
- [ ] Set up Prisma ORM
- [ ] Define RESTful routes
- [ ] Define cors


# App
- [ ]