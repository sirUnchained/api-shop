import { CategoryEntity } from 'src/category/entities/category.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('product')
export class ProductEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => CategoryEntity, (category) => category.id)
  @JoinColumn()
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
