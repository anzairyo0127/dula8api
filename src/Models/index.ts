import { Sequelize } from 'sequelize';
import schema from './schema';
import { HyDatabase } from "../@types/Models/index";

export const setModel = (sequelize: Sequelize): HyDatabase => {
  const db: any = {};

  Object.keys(schema).forEach(tableName => {
    db[tableName] = schema[tableName].factory(sequelize);
  });

  // associationを貼るのは各Modelのinit()が全て終わってから
  // (全モデルのinit()が終わる前にassociationを貼るとそんなモデル知らないみたいなエラーで死ぬ）
  Object.keys(schema).forEach(tableName => {
    if ('associate' in db[tableName]) {
      db[tableName].associate(db);
    }
  });

  return db;
};