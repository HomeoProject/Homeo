This is a version of Docker where the databases, etc. are in the cloud.

Cloud solutions used:

- cloudinary - object storage
- aiven - postgres and redis
- apininjas - location api
- auth0 - idp

Unfortunately we are still using rabbitmq locally because we haven't found a cloud where you can install stomp plugins for free
