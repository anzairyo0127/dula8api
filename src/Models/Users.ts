import { Sequelize, Model, DataTypes } from "sequelize";
import { Programs } from "./Programs";

const tableName = 'users';

class Users extends Model {
  public id: number;
  public username: string;
  public password: string;
  public created_at: string;
  // public cognito_sub: string;

  public static attach(sequelize: Sequelize): void {
    this.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          allowNull: false,
          primaryKey: true,
        },
        username: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        created_at: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
        /*
        cognito_sub: {
          type: DataTypes.STRING,
          allowNull: false,  
          unique: true,
        },
        */
      },
      {
        sequelize,
        tableName,
        timestamps: false,
      }
    ); 
  };

  public static associate(): void {
    Users.hasOne(Programs, {
      foreignKey: 'user_id',
    });
  }
};
const factory = (sequelize: Sequelize) => {
  Users.attach(sequelize);
  return Users;
};

export { Users, factory };
