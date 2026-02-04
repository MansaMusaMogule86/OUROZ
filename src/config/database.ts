/**
 * OUROZ Database Configuration
 * PostgreSQL connection pool configuration with environment-based settings
 */

export const databaseConfig = {
    development: {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432'),
        database: process.env.DB_NAME || 'ouroz_dev',
        username: process.env.DB_USER || 'ouroz_admin',
        password: process.env.DB_PASSWORD || '',
        dialect: 'postgres' as const,
        pool: {
            max: 10,
            min: 2,
            acquire: 30000,
            idle: 10000,
        },
        logging: true,
    },
    production: {
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || '5432'),
        database: process.env.DB_NAME,
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        dialect: 'postgres' as const,
        pool: {
            max: 50,
            min: 10,
            acquire: 60000,
            idle: 20000,
        },
        logging: false,
        ssl: {
            require: true,
            rejectUnauthorized: false,
        },
    },
    test: {
        host: 'localhost',
        port: 5432,
        database: 'ouroz_test',
        username: 'ouroz_admin',
        password: '',
        dialect: 'postgres' as const,
        pool: {
            max: 5,
            min: 1,
            acquire: 30000,
            idle: 10000,
        },
        logging: false,
    },
};

export const elasticsearchConfig = {
    node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200',
    auth: {
        username: process.env.ELASTICSEARCH_USER || 'elastic',
        password: process.env.ELASTICSEARCH_PASSWORD || '',
    },
    indices: {
        products: 'ouroz_products',
        suppliers: 'ouroz_suppliers',
        rfqs: 'ouroz_rfqs',
    },
};

export const redisConfig = {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD || '',
    db: parseInt(process.env.REDIS_DB || '0'),
};

export const storageConfig = {
    provider: process.env.STORAGE_PROVIDER || 'aws', // 'aws' or 'gcp'
    aws: {
        bucket: process.env.AWS_S3_BUCKET || 'ouroz-assets',
        region: process.env.AWS_REGION || 'eu-west-1',
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    },
    gcp: {
        bucket: process.env.GCP_STORAGE_BUCKET || 'ouroz-assets',
        projectId: process.env.GCP_PROJECT_ID || '',
    },
};
