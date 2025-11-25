
import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';

config(); // Tải các biến môi trường từ file .env

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: ['dist/**/*.entity.js'], // CLI cần trỏ tới file .js đã được biên dịch
  migrations: ['dist/migrations/*.js'], // CLI cần trỏ tới file .js đã được biên dịch
  synchronize: false, // Luôn là false khi sử dụng migrations
  logging: ['error'],
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
