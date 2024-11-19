<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

## Description

This is a **NestJS** framework-based project, designed for building scalable and efficient server-side applications.

---

## Steps to Run the Project

To set up and run the project, follow these steps:

1. **Install required dependencies:**

    ```bash
    npm install
    ```

2. **Set up environment variables:**
   
    Copy `.env.example` to `.env` and configure it as needed:
   
    ```bash
    cp .env.example .env
    ```

3. **Generate the schema:**

    ```bash
    npm run generate
    ```

4. **Apply database migrations:**

    ```bash
    npm run migrate
    ```

5. **Seed default data into the database:**

    Run the following SQL queries to insert necessary default data:

    ```sql
    -- Insert ADMIN role into the role table
    INSERT INTO role (id, role_name, created_at, created_by)
    VALUES (gen_random_uuid(), 'ADMIN', NOW(), 'system');
    
    -- Insert an ADMIN user into the users table
    INSERT INTO users (id, first_name, last_name, email, password, mobile, role, created_at, created_by)
    VALUES (gen_random_uuid(), 'Admin', 'User', 'admin@example.com', 
    '$2a$10$XTJV1oc6gaY1Qh1.BiOUSuESTuekfRRx096pvVqeCubUI9qb8HZxa', 
    '1234567890', 'ADMIN', NOW(), 'system');
    ```

    > These queries will populate the database with an initial ADMIN role and an ADMIN user with the email `admin@example.com` and password `12345678`. You can use these credentials to log into the application.

---

## Additional Information

### Swagger Documentation

Swagger UI is available at:

[http://localhost:3000/api](http://localhost:3000/api)

### Code Formatting

Run the following command to format the entire codebase according to project standards:

```bash
npm run format

```

### Commitizen (git cz)
This project uses Commitizen to enforce a consistent commit message format. Use the following command to create commits interactively:
git cz

Benefits of These Practices
**Code Formatting**: Ensures a consistent style throughout the codebase, improving readability and maintainability.

**Git Commit Standards (git cz):** Enforces structured and meaningful commit messages, aiding in versioning, debugging, and generating changelogs automatically.

**Swagger Documentation:** Provides an interactive API documentation interface, making it easier for developers to understand and use the APIs.

**Default Data Setup:** Simplifies initial setup by pre-populating required roles and an admin user, enabling immediate functionality.

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g mau
$ mau deploy

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.


