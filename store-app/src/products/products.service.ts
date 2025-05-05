import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<Product>,
  ) {}

  async create(
    createProductDto: CreateProductDto,
    user: User,
  ): Promise<Product> {
    console.log('📥 DTO recibido:', createProductDto);
    console.log('👤 Usuario recibido:', user);

    try {
      const product = await this.productModel.create({
        ...createProductDto,
        user_id: user._id,
      });
      return product;
    } catch (error) {
      console.error('❌ Error al crear producto:', error.message);
      this.handleExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    try {
      const { limit = 10, offset = 0 } = paginationDto;
      return await this.productModel
        .find()
        .limit(limit)
        .skip(offset)
        .sort({ name: 1 })
        .select('-__v');
    } catch (error) {
      console.error('❌ Error al cargar productos:', error);
      throw new InternalServerErrorException('Error al cargar productos');
    }
  }

  async findOne(id: string) {
    let product: Product;

    if (isValidObjectId(id)) {
      product = await this.productModel.findById(id);
    }

    if (!product) {
      product = await this.productModel.findOne({
        name: id.toLocaleLowerCase().trim(),
      });
    }

    if (!product) {
      throw new NotFoundException(
        `Producto con id o nombre "${id}" no encontrado`,
      );
    }

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.findOne(id);

    if (updateProductDto.name) {
      updateProductDto.name = updateProductDto.name.toLocaleLowerCase();
    }

    try {
      await product.updateOne(updateProductDto);
      return { ...product.toJSON(), ...updateProductDto };
    } catch (error) {
      console.error('❌ Error al actualizar producto:', error.message);
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    const { deletedCount } = await this.productModel.deleteOne({ _id: id });

    if (deletedCount === 0) {
      throw new BadRequestException(`Producto con id "${id}" no encontrado`);
    }

    return { message: 'Producto eliminado correctamente' };
  }

  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(
        `El producto con el nombre "${error.keyValue.name}" ya existe.`,
      );
    }
    throw new InternalServerErrorException(
      'Error inesperado al procesar la solicitud.',
    );
  }
}
