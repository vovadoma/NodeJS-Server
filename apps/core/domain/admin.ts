class Admin {

  constructor () {
    console.log('construct');
  }

  async create () {
    console.log('admin created!!!');
  }
}

export const init = () => new Admin();
