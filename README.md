# Homeo

Homeo is a group project written by three students of the University of Gdańsk. The project is a web application that allows users to become or search for constructors to help them with their home renovation, construction, or repair and with everything related to the house. You can also communicate with constructors using implemented live chat. The application is written in React and uses various microservices written in Java. It also uses a PostgreSQL database, Redis, and RabbitMQ as well as WebSockets for real-time communication.

# Running the application

To run the application you need to have Docker installed on your machine. After that, you need to run the following commands inside `./Docker/Prod` project directory:

First, you need to build the local Docker images (metrics, RabbitMQ, observability, logs etc.). Don't worry about the environment variables, they are provided in the `.env` file for the 'production' environment that you're going to use. You can build the images using the following command (use Linux or WSL):

```bash
./docker-build.sh
```

After that, you can fetch the rest of the images from the Docker Hub and start the containers. In this case you don't need to provide any environment variables. You can do that by running the following command (use Linux or WSL):

```bash
./docker-run.sh
```

Now you can access the application by going to `https://localhost`. Keep in mind that your browser will show a warning that the connection is not secure. You can ignore this warning and proceed to the website. Remember that it may take a while for the microservices to start (around 5 minutes). If you want to start the application faster, you can do that by executing everything in the `./Docker/ProdLight` directory. The difference is that the `ProdLight` directory doesn't have the metrics, observability, and logs services.

# Test user

If you want to test, explore the application, you can use the following test user:

- Email: `testuser@email.com`
- Password: `Testuser1!`

# Documentation

You can access the backend documentation by going to `https://localhost/api/swagger-ui`.

# Work organization

[App Architecture](https://miro.com/app/board/uXjVNbUOMjw=/?share_link_id=47858828766)

[Our Kanban Board](https://miro.com/app/board/uXjVNXgGLhg=/?share_link_id=712521886168)

# Authors:

Karol Wiśniewski&nbsp; | &nbsp;[LinkedIn](https://linkedin.com/in/karol-wisniewski-722588267)\
Piotr Damrych&nbsp; | &nbsp;[LinkedIn](https://linkedin.com/in/piotr-damrych-146a1421a/)\
Maciej Słupianek&nbsp; | &nbsp;[LinkedIn](https://linkedin.com/in/maciej-słupianek-686246237/)
