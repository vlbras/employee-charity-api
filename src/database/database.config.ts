import { ConfigModule } from "@nestjs/config";
import "reflect-metadata";
import { DataSource, DataSourceOptions } from "typeorm";

ConfigModule.forRoot();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  migrations: [__dirname + "/migrations/*.js"],
  synchronize: false,
}

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;