/**
 * Repository - Representate a table in a database
 */
class Repository {
  constructor() {
    this.db;
    this.table;
    this.fields = {};
  }


  /**
   * create - Create a new tabe in database if not exists
   *
   * @return {type}  description
   */
  async create() {
    if(!this.validate(this.table) || !this.validate(this.db)) {
      return false;
    }

    let queryData = "";
    for(let name in this.fields) {
      queryData = queryData + name;

      /**
        * Add column data
        */
      if(this.validate(this.fields[name].type)) {
        let type = this.fields[name].type;
        queryData = queryData + " " + type;
      }
      if(this.validate(this.fields[name].length)) {
        let length = this.fields[name].length;
        queryData = queryData + "(" + length + ")";
      }
      if(this.validate(this.fields[name].constrains)) {
        let constrains = this.fields[name].constrains;
        queryData = queryData + " " + constrains;
      }

      queryData = queryData + ", "
    }

    queryData = queryData.slice(0, -2);

    try{
      let statement = "CREATE TABLE IF NOT EXISTS " + pgPrepare(this.table) + " ( id SERIAL PRIMARY KEY " + pgPrepare(queryData) + ");";
      let createTableData = await this.db.query(statement);
      if(createTableData.rowCount !== 0){
        return true;
      }
    } catch(e) {

    }
    return false;
  }

  /**
   * validate - validate a data
   *
   * @param  object data the data object
   * @param  JSON   checks = {checkNull: true} the checks
   * @return boolean
   */
  validate(data, checks = {checkNull: true}) {
    if(checks.checkNull) {
      if(data == null || typeof data == "undefined") {
        return false;
      }
    }

    return true;
  }
}

module.exports = Repository;
