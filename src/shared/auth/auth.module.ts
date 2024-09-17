import { Module } from '@nestjs/common';
import { ConfigModule, registerAs } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

const jwtConfig = registerAs('jwt', () => ({
  global: true,
  secret: process.env.JWT_SECRET,
  signOptions: { expiresIn: process.env.JWT_EXPIRES_IN },
}));

/**
 * Module that provides the authentication system to the application.
 * @description It uses the JwtModule to provide the authentication system.
 */
@Module({
  imports: [ConfigModule.forFeature(jwtConfig), JwtModule.registerAsync(jwtConfig.asProvider())],
  exports: [JwtModule],
})
export class AuthModule {}
