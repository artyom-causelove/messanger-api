import { Model } from 'mongoose';

export abstract class Service<T> {
  protected abstract model: Model<T>;

  async all(): Promise<T[]> {
    return this.model.find().exec();
  }

  async findById(id: any): Promise<T> {
    return this.model.findById(id).exec();
  }

  async findByIds(ids: string[]): Promise<T[]> {
    return this.model.find({ _id: { $in: ids } }).exec();
  }

  async findOneBy(conditions: any): Promise<T> {
    return this.model.findOne(conditions).exec();
  }
  
  async findBy(conditions: any): Promise<T[]> {
    return this.model.find(conditions).exec();
  }

  async updateModel(updatingModel: Model<T>, values: any): Promise<T> {
    for (const field in values) {
      updatingModel[field] = values[field];
    }

    return updatingModel.save();
  }
}
