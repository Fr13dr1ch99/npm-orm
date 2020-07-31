const {ORM, Entity, Repository} = require("../ORM.class.js");

class ORMUnitTest {
  constructor() {
    this.testORM();
  }

  testORM() {
    let orm = new ORM();
  }
}

let ormUnitTest = new ORMUnitTest();
