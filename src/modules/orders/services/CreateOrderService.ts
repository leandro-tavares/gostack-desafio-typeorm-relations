import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import Order from '../infra/typeorm/entities/Order';
import IOrdersRepository from '../repositories/IOrdersRepository';

interface IProduct {
  id: string;
  quantity: number;
}

interface IRequest {
  customer_id: string;
  products: IProduct[];
}

@injectable()
class CreateOrderService {
  constructor(
    @inject('OrdersRepositoryContainer')
    private ordersRepository: IOrdersRepository,

    @inject('ProductsRepositoryContainer')
    private productsRepository: IProductsRepository,

    @inject('CustomersRepositoryContainer')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({ customer_id, products }: IRequest): Promise<Order> {
    const customer = await this.customersRepository.findById(customer_id);

    if (!customer) {
      throw new AppError('Customer not found');
    }

    const productList = await this.productsRepository.findAllById(products);

    if (productList.length === 0) {
      throw new AppError('Product not found');
    }

    const productsOrder = productList.map(item => {
      const productFound = products.find(
        product => product && product.id === item.id,
      );

      if (productFound && productFound.quantity > item.quantity) {
        throw new AppError(
          "You cant't create an order with products with insufficiente quantities",
        );
      }

      const result = {
        product_id: item.id,
        price: item.price,
        quantity: productFound ? productFound.quantity : 0,
      };
      return result;
    });

    const order = await this.ordersRepository.create({
      customer,
      products: productsOrder,
    });

    await this.productsRepository.updateQuantity(products);

    return order;
  }
}

export default CreateOrderService;
