import { DataSource } from 'typeorm';
import { dataSourceOptions } from '../typeorm.config';
import * as path from 'path';
import 'dotenv/config';

function validateEnv() {
  const required = ['DB_HOST','DB_PORT','DB_USER','DB_PASS','DB_NAME'];
  const missing = required.filter(k => !process.env[k]);
  if (missing.length) {
    console.warn('Thiếu biến môi trường DB:', missing.join(', '));
  }
}

process.on('unhandledRejection', (err) => {
  console.error('UnhandledRejection:', err);
  process.exitCode = 1;
});

async function synchronizeDatabase() {
  console.log('Bắt đầu quá trình đồng bộ hóa database...');

  validateEnv();

  const args = process.argv.slice(2);
  const force = args.includes('--force');
  const drop = args.includes('--drop');
  const migrate = args.includes('--migrate');

  const dataSource = new DataSource({
    ...dataSourceOptions,
    synchronize: !migrate, // tắt synchronize nếu chạy migrations
    dropSchema: drop && process.env.NODE_ENV !== 'production',
    entities: [path.join(__dirname, '**', '*.entity.{ts,js}')],
  });

  if (process.env.NODE_ENV === 'production' && !force) {
    console.warn('Bỏ qua đồng bộ schema: NODE_ENV=production (dùng --force để ép).');
    return;
  }

  const start = Date.now();

  try {
    await dataSource.initialize();
    console.log('Kết nối database thành công.');

    if (migrate) {
      console.log('Chạy migrations...');
      await dataSource.runMigrations();
      console.log('Migrations hoàn tất.');
    } else {
      console.log('Đồng bộ hóa schema thành công!');
    }
    console.log(`Thời gian thực thi: ${Date.now() - start} ms`);
    process.exitCode = 0;
  } catch (error) {
    console.error('Lỗi trong quá trình đồng bộ hóa database:', error instanceof Error ? error.stack || error.message : error);
    process.exitCode = 1;
  } finally {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
      console.log('Đã ngắt kết nối database.');
    }
  }
}

synchronizeDatabase();
