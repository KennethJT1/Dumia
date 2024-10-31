import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryEntity } from './entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { NotFoundError } from 'rxjs';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>,
  ) { }

  async create(createCategoryDto: CreateCategoryDto, currentUser: UserEntity): Promise<CategoryEntity> {
    const category = await this.categoryRepository.create(createCategoryDto);
    category.addedBy = currentUser;
    await this.categoryRepository.save(category);
    return category;
  }

  async findAll(): Promise<CategoryEntity[]> {
    return await this.categoryRepository.find();
  }

  async findOne(id: string): Promise<CategoryEntity> {
    const category = await this.categoryRepository.findOne({
      where: { id }, relations: { addedBy: true }, select: {
        addedBy: {
          id: true,
          name: true,
          email: true
        }
      }
    });

    if (!category) throw new NotFoundException("Category not found")
    return category;
  }

  async update(id: string, updateCategoryDto: Partial<UpdateCategoryDto>): Promise<CategoryEntity> {
    const category = await this.findOne(id);

    if (!category) throw new NotFoundException('No category found')

    Object.assign(category, updateCategoryDto);
    return this.categoryRepository.save(category)
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
