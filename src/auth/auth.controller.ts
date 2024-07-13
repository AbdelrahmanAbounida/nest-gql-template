import { Controller, Post, Body, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Public } from './guards/public.guard';

@Controller('auth')
@Public()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    console.log('Register DTO', registerDto);
    // TODO:: Send email verification
    return this.authService.register(registerDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    console.log('Login DTO', loginDto);
    return this.authService.login(loginDto);
  }

  // TODO:: Implement the following methods
  @Post('verify-email')
  verifyEmail(@Body() { token }: { token: string }) {
    // return this.authService.verifyEmail(token);
  }

  // TODO:: Implement the following methods
  @Post('reset-password')
  forgotPassword(@Body() { email }: { email: string }) {
    // return this.authService.forgotPassword(email);
  }

  // TODO:: add oauth login
  @Post('google-login')
  googleLogin(@Body() { token }: { token: string }) {
    // return this.authService.googleLogin(token);
  }
  @Post('facebook-login')
  facebookLogin(@Body() { token }: { token: string }) {
    // return this.authService.facebookLogin(token);
  }

  @Post('twitter-login')
  twitterLogin(@Body() { token }: { token: string }) {
    // return this.authService.twitterLogin(token);
  }

  @Post('github-login')
  githubLogin(@Body() { token }: { token: string }) {
    // return this.authService.githubLogin(token);
  }
}
