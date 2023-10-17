import { DataSource, DataSourceOptions } from 'typeorm';
import typeOrmConfig from './src/shared/config/ormconfig';

const datasource = new DataSource(typeOrmConfig as DataSourceOptions);

export default datasource;
