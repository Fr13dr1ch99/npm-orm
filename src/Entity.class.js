/**
 * Entity - Representate one entity in a table
 */
class Entity {
  constructor(repository) {
    this.repository = repository;
  }

  /**
   * async create - Create the query
   *
   * @return bool success
   */
  async create() {
    if(!this.repository.validate(this.table) || !this.repository.validate(this.db)) {
      return false;
    }

    let queryDataNames = "";
    let queryDataValues = "";
    for(let name in this.repository.fields) {
      let value = this[name];
      if(this.repository.validate(value)) {
        queryDataNames = queryDataNames + name + ", ";
        if(typeof value == "string") {
          value = "'" + value + "'";
        }
        queryDataValues = queryDataValues + value + ", ";
      }
    }
    queryDataNames = queryDataNames.slice(0, -2);
    queryDataValues = queryDataValues.slice(0, -2);

    try{
      let statement = "INSERT INTO " + pgPrepare(this.table) + " (" + pgPrepare(queryDataNames) + ") VALUES (" + pgPrepare(queryDataValues) + ");";
      let insertData = await this.db.query(statement);
      if(insertData.rowCount !== 0){
        return true;
      }
    } catch(e) {

    }
    return false;
  }

  /**
   * async update - update a query
   *
   * @param  string where = "WHERE id = " + this.id
   * @return bool success
   */
  async update(where = "WHERE id = " + this.id) {
    if(!this.repository.validate(this.table) || !this.repository.validate(this.db) || !this.repository.validate(this.id)) {
      return false;
    }

    let queryData = "";
    for(let name in this.repository.fields) {
      if(this.repository.validate(this[name])) {
        queryData = queryData + name + " = " + this[name] + ", ";
      }
    }

    queryData = queryData.slice(0, -2);

    try{
      let statement = "UPDATE " + pgPrepare(this.table) + " SET " + pgPrepare(queryData) + " " + pgPrepare(where) + ";";
      let updateData = await this.db.query(statement);
      if(updateData.rowCount !== 0){
        return true;
      }
    } catch(e) {

    }
    return false;
  }


  /**
   * async get - select the entity
   *
   * @param  string where = "WHERE id = " + this.id
   * @return bool success
   */
  async get(where = "WHERE id = " + this.id) {
    if(!this.repository.validate(this.table) || !this.repository.validate(this.db) || !this.repository.validate(this.id)) {
      return false;
    }

    let statement = "SELECT * FROM " + pgPrepare(this.table) + " " + pgPrepare(where) + ";";
    let data = await this.db.query(statement);

    if (data.rows.length !== 0) {
      for(let name in this.repository.fields) {
        if(this.repository.validate(data.rows[0][name])) {
          this[name] = data.rows[0][name];
        }
      }
      return true;
    }else{
      return false
    }
  }
}

module.exports = Entity;
