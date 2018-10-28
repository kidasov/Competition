import { createLogger } from 'winston';
import Elasticsearch from 'winston-elasticsearch';

const logger = createLogger({
  transports: [new Elasticsearch({})],
});

export default logger;
