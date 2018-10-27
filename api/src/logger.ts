import { createLogger } from 'winston';
import * as Elasticsearch from 'winston-elasticsearch';

const logger = createLogger({
  transports: [new Elasticsearch({})],
});

export default logger;
