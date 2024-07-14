import { Controller, Post, Body, Get, NotFoundException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Public } from './guards/public.guard';
import { EmailService } from 'src/common/email/email.service';
import { OtpService } from './otp.service';
import { CustomResponse } from 'src/common/response/custom-response';
import { CurrentUser } from './decorator/current-user.decorator';

/**
 * register > Verify-Otp > Login
 *
 * forget-password > reset-password
 */

@Controller('auth')
@Public()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly emailService: EmailService,
    private readonly otpService: OtpService,
  ) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    console.log('Register DTO', registerDto);
    // 1- register user and get otp
    const { otp, user } = await this.authService.register(registerDto);
    console.log('OTP', otp);

    // 2- Send OTP to the user
    const res = await this.emailService.sendResendEmailVerification(
      user.email,
      otp.value.toString(),
    );
    console.log('Email Response', res);
    return res;
  }

  // send this request when user enters the OTP
  @Post('request-verify-otp')
  async verifyEmail(
    @Body() { email, otpValue }: { email: string; otpValue: string },
  ) {
    // check if it is a valid OTP
    const otp = await this.otpService.validateOtp(otpValue, email);
    console.log('OTP', otp);

    // remove otp
    this.otpService.removeOtp(otp);

    // update user verification email
    await this.authService.updateUserEmail({
      id: otp.user.id,
      emailVerified: new Date(),
    });

    return this.authService.createTokens(otp.user);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('test-generate-otp')
  async testGenerateOtp(@Body() { email }: { email: string }) {
    const otp = await this.otpService.createOTP({ email });
    return otp;
  }

  @Get('all-otps')
  async allOtps() {
    return this.otpService.getAllOtps();
  }
  // when u forget password send this request
  @Post('forget-password')
  async forgotPassword(@Body() { email }: { email: string }) {
    // 1- generate otp
    const otp = await this.otpService.createOTP({ email });

    // 2- send otp to the user
    this.emailService.sendResendResetPasswordEmail(
      email,
      otp?.value.toString(),
    );
  }

  // when updaing the password send this request with the token u got
  @Post('reset-password')
  async resetPassword(
    @Body()
    {
      email,
      otp,
      newPassword,
    }: {
      email: string;
      otp: string;
      newPassword: string;
    },
  ) {
    // check if the otp is valid
    const isValid = await this.otpService.validateOtp(otp, email);

    // update the password
    if (isValid) {
      await this.authService.resetPassword({ email, newPassword });

      return new CustomResponse({
        message: 'Password updated successfully',
        error: false,
      });
    }
  }

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

  @Get('me')
  async me(@CurrentUser() user: any) {
    return user;
  }
}
