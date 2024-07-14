import {
  Injectable,
  NotAcceptableException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AwsSesService } from 'src/common/aws/services/aws.ses.service';
import { ResendService } from 'src/common/resend/resend.service';
import { Otp } from './entities/otp.entity';
import { Repository, EntityManager } from 'typeorm';
import { UsersService } from 'src/modules/users/users.service';
import { User } from 'src/modules/users/entities/user.entity';

@Injectable()
export class OtpService {
  constructor(
    private userService: UsersService,
    @InjectRepository(Otp) private readonly otpRepository: Repository<Otp>,
    private readonly entityManager: EntityManager,
  ) {}

  generateOTPString(count: number): number {
    if (count < 1) {
      return 0;
    }

    const min = Math.pow(10, count - 1);
    const max = Math.pow(10, count) - 1;
    const otp = Math.floor(Math.random() * (max - min + 1)) + min;

    return otp;
  }

  async createOTP({ email, user }: { email?: string; user?: User }) {
    // check if user exists
    if (!user) {
      user = await this.userService.findByEmail(email!);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
    }

    const otpValue = this.generateOTPString(6);
    const otp = this.otpRepository.create({
      value: otpValue,
      user,
      expirationDate: new Date(Date.now() + 1000 * 60 * 60 * 5), // 5 hours
    });
    await this.entityManager.transaction(async (transactionalEntityManager) => {
      await transactionalEntityManager.save(otp);
    });

    return otp;
  }

  async getAllOtps() {
    return this.otpRepository.find();
  }

  async validateOtp(otp: string, userEmail: string): Promise<Otp> {
    // check if it is not numeric value

    if (isNaN(parseInt(otp))) throw new NotAcceptableException('Invalid OTP');

    const otpValue = await this.otpRepository.findOne({
      where: { value: parseInt(otp), user: { email: userEmail } },
      relations: ['user'],
    });
    if (!otpValue) {
      throw new UnauthorizedException('Invalid OTP');
    }

    if (new Date() > otpValue.expirationDate) {
      throw new UnauthorizedException('OTP has expired');
    }

    return otpValue;
  }

  async removeOtp(otp: Otp) {
    return this.otpRepository.remove(otp);
  }
}
