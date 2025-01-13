import { CategoryEntity } from 'src/category/entities/category.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('product')
export class ProductEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => CategoryEntity, (category) => category.id)
  category: CategoryEntity;

  @Column()
  title: string;

  @Column({ unique: true })
  slug: string;

  @Column()
  price: string;

  @Column()
  description: string;

  @Column()
  stock: number;

  @CreateDateColumn()
  creadedAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
