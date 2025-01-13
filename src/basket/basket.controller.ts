import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { BasketService } from './basket.service';
import { CreateBasketDto } from './dto/create-basket.dto';
import { UpdateBasketDto } from './dto/update-basket.dto';

@Controller('basket')
export class BasketController {
  constructor(private readonly basketService: BasketService) {}

  @Post()
  create(@Body() createBasketDto: CreateBasketDto, @Req() req: any) {
    return this.basketService.create(createBasketDto, req);
  }

  @Get()
  findAll(@Req() req: any) {
    return this.basketService.findAll(req);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.basketService.findOne(+id, req);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBasketDto: UpdateBasketDto,
    @Req() req: any,
  ) {
    return this.basketService.update(+id, updateBasketDto, req);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.basketService.remove(+id, req);
  }
}
