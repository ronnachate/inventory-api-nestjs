import { DataSource, DataSourceOptions } from 'typeorm';
import typeOrmConfig from './ormconfig';

const datasource = new DataSource(typeOrmConfig as DataSourceOptions);

export default datasource;
