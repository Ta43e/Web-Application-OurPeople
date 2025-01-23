import 'dotenv/config';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PassportStrategy } from '@nestjs/passport';
import { Model } from 'mongoose';
import { Strategy, VerifyCallback, Profile } from 'passport-google-oauth20';
import { User, UserDocument } from 'src/schemes/user.schema';
import axios from 'axios';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK,
      scope: ['profile', 'email', 'https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/user.gender.read'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<any> {
    const { displayName, emails, photos, _json  } = profile;
    const user = await this.userModel.findOne({ email: emails[0].value });
    let gender = null;

    try {
      const response = await axios.get('https://people.googleapis.com/v1/people/me?personFields=genders', {
        headers: {
          Authorization: `Bearer ${_accessToken}`,
        },
      });
      gender = response.data.genders?.[0]?.value || null;
    } catch (error) {
      console.error('Ошибка при получении gender из Google People API:', error);
    }

    gender = gender === "male" ? "мужчина" : "женщина";
    if (user) {
      done(null, user);
    } 
    else {
        const user: UserDocument = await this.userModel.create({email: emails[0].value, firstName: displayName, mainPhoto: photos[0].value, sex: gender, iiGoogle: true });
        done(null, user);
      }
    }
}
