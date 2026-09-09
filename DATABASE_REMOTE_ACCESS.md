# Remote Database Management

This document outlines the recommended approach for securely connecting to and managing the remote production database for **Combine Drive**.

## Security Policy: No Public Database Ports
For production deployments, the MySQL database port (`3306`) must **never** be exposed to the public internet. Tools like Prisma Studio should not be hosted publicly as they lack built-in authentication and expose the entire database.

The standard and most secure method to access the production database is via an **SSH Tunnel**.

## Accessing the Database via SSH Tunnel

An SSH tunnel encrypts your database traffic and routes it through your server's secure shell connection. 

### Prerequisites
1. **Desktop Database Client:** 
   - [TablePlus](https://tableplus.com/) (Mac/Windows/Linux)
   - [DBeaver](https://dbeaver.io/) (Free, Mac/Windows/Linux)
   - [MySQL Workbench](https://www.mysql.com/products/workbench/)
2. **Server SSH Access:** You need SSH access (IP, Username, and SSH Key) to the server hosting the database.
3. **Database Credentials:** You need the database username, password, and database name as defined in the server's `.env` file.

### General Connection Setup

When setting up your connection in your database client, you will configure two sections:

#### 1. SSH Tunnel Configuration
This authenticates you to the server.
- **SSH Host / Server:** Your server's public IP address or domain.
- **SSH Port:** `22` (or your custom SSH port).
- **SSH User:** Your SSH username (e.g., `root`, `ubuntu`).
- **SSH Key:** Your private SSH key file.

#### 2. Local Database Configuration
This authenticates you to the database *from the perspective of the server*.
- **Database Host:** `127.0.0.1` (or the Docker container name, e.g., `mysql`, if connecting directly within the Docker network context).
- **Database Port:** `3306`
- **Database User:** Your database user.
- **Database Password:** Your database password.
- **Database Name:** The name of the Combine Drive database.

Once configured, the client will first securely SSH into your server, and then connect locally to MySQL, keeping all traffic encrypted and hidden from the public internet.

## Managing Migrations in Production

Do not run migrations from your local machine over an SSH tunnel. Instead, deploy your code to the server and run migrations directly on the host machine:

```bash
# Example
cd /path/to/combine-drive/backend
npm run prisma:migrate:deploy
```
*(Note: Use `deploy` in production instead of `dev` to apply pending migrations without resetting data).*
