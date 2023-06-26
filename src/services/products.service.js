import { productsModel} from '../DAO/models/products.model.js';

export class productService {
  validateUser(title, description, price ,thumbnail,status,category,code,stock ) {
    if (!title || !description || !price) {
      console.log('validation error: please complete firstName, lastname and email.');
      throw new Error('validation error: please complete firstName, lastname and email.');
    }
  }
  async getAll(limit,page,category,stock) {
    const query = {}
    if(category){
      query = {category: category}
    }
    if(stock){
      query = {stock: stock}
    }
   const products = await productsModel.paginate(query,{limit:limit || 10 ,page:page || 1})
    /* const products = await productsModel.find(); */
    return products;
  }

  async createOne(title, description, price ,thumbnail,status,category,code,stock ) {
    this.validateUser(title, description, price ,thumbnail,status,category,code,stock);
    const productCreated = await productsModel.create({ title, description, price ,thumbnail,status,category,code,stock });
    return productCreated;
  }

  async deletedOne(_id) {
    const deleted = await productsModel.deleteOne({ _id: _id });
    return deleted;
  }

  async updateOne(_id, title, description, price ,thumbnail,status,category,code,stock) {
    if (!_id) throw new Error('invalid _id');
    this.validateUser(title, description, price ,thumbnail,status,category,code,stock);
    const userUptaded = await productsModel.updateOne({ _id: id }, { title, description, price ,thumbnail,status,category,code,stock });
    return userUptaded;
  }
}