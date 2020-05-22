import { inject, injectable } from 'tsyringe';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import IOrdersRepository from '../repositories/IOrdersRepository';
import Order from '../infra/typeorm/entities/Order';

interface IRequest {
  id: string;
}

@injectable()
class FindOrderService {
  constructor(
    @inject('OrdersRepositoryContainer')
    private ordersRepository: IOrdersRepository,

    @inject('ProductsRepositoryContainer')
    private productsRepository: IProductsRepository,

    @inject('CustomersRepositoryContainer')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({ id }: IRequest): Promise<Order | undefined> {
    const order = await this.ordersRepository.findById(id);

    return order;
  }
}

export default FindOrderService;
