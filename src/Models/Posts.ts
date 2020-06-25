import { Pool } from 'pg';

export interface PostsColumn {
    id:string,
    title:string,
    text:string,
    name:string,
    created_at:string
}

export interface insertColumn {
    title:string,
    text:string,
    name:string,
    password?:string
}

export interface responseJson {
    status:number,
    date:string,
    message,
    count:number,
}

export class Posts {
    private readonly client:Pool;
    public tableName: String;
    public insertPassword:(id:string, word:string) => void;

    constructor(conn:Pool, table?:string){
        this.client = conn;
        this.tableName = table || "posts";
    }

    retJson (status:number, message, count:number) {
        let ret:responseJson;
        const date = new Date();
        ret = {
            status,
            date: date.toISOString(),
            message,
            count
        }
        return ret;
    };
    
    async row(id:string) {
        let ret:responseJson;
        const query = {
            text:`SELECT * FROM ${this.tableName} WHERE id=$1`,
            values:[id]
        }
        await this.client.query(query).then((result) => {
            if (result.rowCount == 0) {
                ret = this.retJson(404, "Not Found Data.", 0);
            } else {
                ret = this.retJson(200, result.rows, result.rowCount);
            }
        }).catch((reason) => {
            ret = this.retJson(500, "Server Application is Failed.", 0);
        });
        return ret;
    }

    async rows() {
        let ret:responseJson;
        const query = {
            text: `SELECT * FROM ${this.tableName} ORDER BY created_at DESC`,
            values: []
        }
        await this.client.query(query).then((result) => {
            ret = this.retJson(200, result.rows, result.rowCount);
        }).catch( (reason) => {
            ret = this.retJson(400, reason.message, 0);
        });
        return ret;
    }

    async post(insertData: insertColumn) {
        let ret:responseJson;
        const query = {
            text: `INSERT INTO ${this.tableName} (title, text, name) VALUES ($1, $2, $3)`,
            values: [insertData.title, insertData.text, insertData.name,]
        };
        await this.client.query(query).then(async (result) => {
            if(insertData.password) {
                const lastVal = await this.getLastVal();
                this.insertPassword(lastVal, insertData.password);
            };
            ret = this.retJson(200, "OK", 0);
        }).catch((reason) => {
            ret = this.retJson(400, reason.message, 0);
        });
        return ret;
    }

    async getLastVal() {
        let message:string;
        const query = {
            text:`SELECT LASTVAL();`,
            values:[]
        };
        await this.client.query(query).then((result) => {
            message = result.rows[0].lastval;
        }).catch((reason) => {
            message = reason.message;
        });
        return message;
    }
}