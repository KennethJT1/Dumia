#####
TO RUN MIGRATION:GENERATE
* yarn migration:generate database/migrations/
yarn migration:generate database/migrations/

TO RUN MIGRATION:RUN
* yarn migration:run
yarn migration:run





nest g resource categories

have done migration tof categories table before when i did one to many relation between them, now i added a product table where both user and categories can have one to any relationship with product table, how do i goa boout the migration since the error persist