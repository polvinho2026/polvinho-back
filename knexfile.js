import "dotenv/config";

const knexConfig = {
    development: {
        client: "pg",
        connection: {
            host: process.env.DB_HOST,
            port: Number(process.env.PORT),
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        },
        pool: {
            min: 2,
            max: 10,
        },
        migrations: {
            directory: "./src/database/migrations",
        },
        seeds: {
            directory: "./src/database/seeds",
        },
    },
};

export default knexConfig;