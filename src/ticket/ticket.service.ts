import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TicketEntity } from './entities/ticket.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TicketService {
  constructor(
    @InjectRepository(TicketEntity)
    private readonly ticketRepo: Repository<TicketEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  async create(createTicketDto: CreateTicketDto) {
    try {
      const newTicket = this.ticketRepo.create(createTicketDto);
      await this.ticketRepo.save(newTicket);
      return newTicket;
    } catch (error) {
      throw new InternalServerErrorException('insternal error');
    }
  }

  async findAll() {
    try {
      const tickets = this.ticketRepo.find();
      return tickets;
    } catch (error) {
      throw new InternalServerErrorException('insternal error');
    }
  }

  async findOne(id: number, req: any) {
    try {
      if (!id) {
        throw new BadRequestException('ticket not found.');
      }

      const ticket = await this.ticketRepo.findOne({
        where: { id },
        relations: ['users'],
      });
      if (ticket.user_id.id !== req.user.id || req.user.role !== 'admin') {
        throw new BadRequestException('you cannot access this ticket.');
      }

      return ticket;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('insternal error');
    }
  }

  async update(id: number, updateTicketDto: UpdateTicketDto, req: any) {
    try {
      const result = await this.ticketRepo.update(
        { id },
        { reply_msg: updateTicketDto.reply_msg, reply_id: req.user.id },
      );
      if (!result.affected) {
        throw new BadRequestException('ticket not found');
      }
      return 'done';
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('insternal error');
    }
  }

  async remove(id: number) {
    try {
      const result = await this.ticketRepo.delete(id);
      if (!result.affected) {
        throw new BadRequestException('ticket not found');
      }
      return 'done';
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('insternal error');
    }
  }
}
