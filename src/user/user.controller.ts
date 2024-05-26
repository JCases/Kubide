import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Put,
  Request,
} from '@nestjs/common';

import * as bcrypt from 'bcryptjs';

import { UserService } from './user.service';
import { Public } from './../auth/decorators/public.decorator';
import { AuthService } from './../auth/auth.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Public()
  @Post('signup')
  async signUp(@Body() signUp: Record<string, string>) {
    const { email, password } = signUp;

    // Check if user exists
    const userExists = await this.userService.user({ email });
    if (userExists) throw new BadRequestException();

    const passwordHash = await bcrypt.hash(password, +process.env.BCRYPT_SALT!);

    await this.userService.createUser({
      email,
      password: passwordHash,
    });

    return this.authService.signIn(email, password);
  }

  @Put('update')
  async updateUser(
    @Request() req: any,
    @Body() update: Record<string, string>,
  ) {
    const id = req.user.sub;
    const { email, password } = update;

    const passwordHash = password
      ? await bcrypt.hash(password, +process.env.BCRYPT_SALT!)
      : undefined;

    return this.userService.updateUser({
      where: { id: id! },
      data: {
        ...(email && { email }),
        ...(password && { password: passwordHash }),
      },
    });
  }

  @Get()
  getUser(@Request() req: any) {
    return this.userService.user({ id: req.user.sub });
  }

  @Get('status')
  async getUserActive(@Request() req: any) {
    const user = await this.userService.user({ id: req.user.sub });
    return { active: user?.active };
  }

  @Get('active')
  getActiveUsers() {
    return this.userService.users({ where: { active: true } });
  }
}
