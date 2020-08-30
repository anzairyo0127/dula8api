import { Sequelize, Model, DataTypes } from "sequelize";
import { Users } from "./Users";

const tableName = 'follows';

class Follows extends Model {
  public id: number;
  public user_id: number;
  public follow_id: number;

  public static attach(sequelize: Sequelize): void {
    this.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          allowNull: false,
          primaryKey: true,
        },
    },
      {
        sequelize,
        tableName,
        timestamps: false,
      }
    );
  };
  public static associate(): void {
    Follows.belongsTo(Users, {
      foreignKey: 'user_id',
    });
    Follows.belongsTo(Users, {
      foreignKey: 'follow_id',
    });
  }
};
const factory = (sequelize: Sequelize) => {
  Follows.attach(sequelize);
  return Follows;
};

export { Follows, factory };
