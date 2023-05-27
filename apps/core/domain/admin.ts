class Admin {

  constructor() {
    console.log('construct');
  }

  async create() {
    console.log('admin created!!!');
    console.info('logger');
    // @ts-ignore
    console['dir']('logger');
  }
}

export default new Admin();
