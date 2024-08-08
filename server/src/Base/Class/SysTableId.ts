import Collections from "../Config/collections";
import Start from "./Start";


class SysTableId extends Start {

    async getTableId(tableName: string): Promise<number> {
        let tableId = 0;
        await this.connectDb();
        tableId = (await this.getWithColumns(Collections.SysTableId, { Name: tableName }, ["RecId"])).RecId;
        this.flush()
        return tableId;
    }

    async getTableName(tableId: number): Promise<string> {
        let tableName = '';
        await this.connectDb();
        tableName = (await this.getWithColumns(Collections.SysTableId, { RecId: tableId }, ["Name"])).Name;
        this.flush()
        return tableName;
    }
}

export default SysTableId;