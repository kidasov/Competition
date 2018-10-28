import Sequelize from 'sequelize';
import { sequelize } from '../db';
import { UserId } from './user';

interface UploadId extends Number {
  _uploadIdBrand: string;
}

function asUploadId(rawId: number): UploadId {
  return rawId as any;
}

interface Upload {
  id: UploadId;
  ownerUserId: UserId;
  size: number;
  mimeType: string;
  fileName: string;
  createdAt: Date;
}

type UploadAttributes = Partial<Upload>;

type UploadInstance = Sequelize.Instance<UploadAttributes> & Upload;

const UploadModel = sequelize.define<UploadInstance, UploadAttributes>(
  'upload',
  {
    ownerUserId: Sequelize.INTEGER,
    size: Sequelize.INTEGER,
    mimeType: Sequelize.STRING,
    fileName: Sequelize.STRING,
    createdAt: {
      type: Sequelize.DATE,
      defaultValue: sequelize.fn('now'),
    },
  },
);

export default UploadModel;
export {
  asUploadId,
  UploadId,
  Upload,
  UploadAttributes,
  UploadInstance,
  UploadModel,
};
