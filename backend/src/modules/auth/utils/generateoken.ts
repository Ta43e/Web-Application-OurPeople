import { JwtService } from '@nestjs/jwt';

export async function generateToken(jwtService: JwtService, user) {
  const payload = { role: user.role, _id: user._id };
  const accessToken = jwtService.sign(payload, {
    secret: process.env.ACCESS_SECRET,
    expiresIn: '1h',
  });
  const refreshToken = jwtService.sign(payload, {
    secret: process.env.REFRESH_SECRET,
    expiresIn:  1000 * 60 * 24 * 3,
  });
  return {
    accessToken,
    refreshToken,
  };
}
