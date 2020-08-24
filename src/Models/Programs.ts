import { Sequelize, Model, DataTypes } from "sequelize";
import { Users } from "./Users";

const tableName = 'programs';

class Programs extends Model {
  public id: number;
  public title: string;
  public content: string;
  public status: string;
  public start_time: Date;
  public end_time: Date;
  public createdAt: Date;
  public updatedAt: Date;
  public user_id: Date;

  public static attach(sequelize: Sequelize): void {
    this.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          allowNull: false,
          primaryKey: true,
        },
        title: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        content: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        status: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        start_time: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
        end_time: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
      },
      {
        sequelize,
        tableName,
        timestamps: true,
      }
    );
  };
  public static associate(): void {
    Programs.belongsTo(Users, {
      foreignKey: 'user_id',
    });
  }
};
const factory = (sequelize: Sequelize) => {
  Programs.attach(sequelize);
  return Programs;
};

export { Programs, factory };