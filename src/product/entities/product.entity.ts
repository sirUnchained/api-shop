import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('product')
export class ProductEntity {
  @PrimaryGeneratedColumn()
  id: number;

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
