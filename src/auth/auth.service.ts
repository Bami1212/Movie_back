import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RefreshTokenDto } from './dto/refreshToken.dto';
import { Favorite } from 'src/schemas/favorite.schema';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { UpdateProfileDto } from './dto/UpdateProfile.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Favorite.name) private readonly favoriteModel: Model<Favorite>,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async register(data: RegisterDto) {
    try {
      const existUser = await this.userModel.findOne({ email: data.email });
      if (existUser) throw new ConflictException('email exist!');

      const hash = bcrypt.hashSync(data.password, 10);

      const user = await this.userModel.create({
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        password: hash,
        avatar_url: this.generateAvatarUrl(
          `${data.first_name} ${data.last_name}`,
        ),
      });

      const tokens = await this.generateToken({
        _id: user._id.toString(),
        email: user.email,
      });
      user.refresh_token = tokens.refresh_token;
      await user.save();
      user.password = undefined;

      return { ...user.toObject(), ...tokens };
    } catch (error) {
      throw error;
    }
  }

  async login(data: LoginDto) {
    try {
      const user = await this.userModel.findOne({ email: data.email });
      if (!user) throw new UnauthorizedException('email or password invalid');
      const checkPassword = bcrypt.compareSync(data.password, user.password);
      if (!checkPassword)
        throw new UnauthorizedException('email or password invalid');

      const payload = { _id: user._id.toString(), email: user.email };
      const tokens = await this.generateToken(payload);
      user.refresh_token = tokens.refresh_token;
      await user.save();
      return {
        ...user.toObject(),
        password: undefined,
        ...tokens,
      };
    } catch (error) {
      throw error;
    }
  }

  async logout(userId: string) {
    try {
      const user = await this.userModel.findById(userId);
      if (!user) throw new UnauthorizedException();
      user.refresh_token = null;
      await user.save();
      return {
        message: 'Successfully logged out',
        statusCode: 200,
      };
    } catch (error) {
      throw error;
    }
  }

  async getProfile(_id: string) {
    try {
      const user = await this.userModel.findById(_id);
      return {
        ...user.toObject(),
        refresh_token: undefined,
        password: undefined,
      };
    } catch (error) {
      throw error;
    }
  }

  async refreshToken(data: RefreshTokenDto) {
    try {
      const payload: { _id: string; email: string } =
        await this.jwtService.verifyAsync(data.refresh_token, {
          secret: this.config.get('JWT_REFRESH_SECRET'),
        });
      const user = await this.userModel.findById(payload._id);
      if (data.refresh_token !== user.refresh_token) {
        throw new UnauthorizedException();
      }

      const tokens = await this.generateToken({
        _id: payload._id,
        email: payload.email,
      });

      return tokens;
    } catch (error) {
      throw error;
    }
  }

  async getFavorites(userId: string, page: number, limit: number) {
    const startIndex = (page - 1) * limit;
    try {
      const totalCountPromise = this.favoriteModel.count({ userId });
      const favoriteMoviesPromise = this.favoriteModel
        .find({ userId })
        .skip(startIndex)
        .limit(limit)
        .sort('createdAt');

      const [favoriteMovies, totalCount] = await Promise.all([
        favoriteMoviesPromise,
        totalCountPromise,
      ]);

      const prev_page = page <= 1 ? null : page - 1;
      const next_page = page * limit >= totalCount ? null : page + 1;

      return {
        totalDoc: totalCount,
        page,
        limit,
        docs: favoriteMovies,
        prev_page,
        next_page,
      };
    } catch (error) {
      throw error;
    }
  }

  async updateProfile(
    userId: string,
    data: UpdateProfileDto,
    avatar?: Express.Multer.File,
  ) {
    try {
      const user = await this.userModel.findById(userId);
      console.log(user.toJSON());
      if (avatar) {
        if (user.avatar_url.includes('res.cloudinary.com')) {
          const arrSplit = user.avatar_url.split('/');
          const file = arrSplit[arrSplit.length - 1];
          const [fileName, type] = file.split('.');
          this.cloudinaryService.deleteImage(fileName);
        }
        const result = await this.cloudinaryService.uploadImage(avatar);
        user.avatar_url = result.url;
      }
      if (data.first_name && data.last_name) {
        user.first_name = data.first_name;
        user.last_name = data.last_name;
      }

      if (data.old_password && data.new_password) {
        const isValidPw = bcrypt.compareSync(data.old_password, user.password);
        if (!isValidPw) throw new UnauthorizedException('Password invalid');
        user.password = bcrypt.hashSync(data.new_password, 10);
      }
      await user.save();

      return {
        ...user.toObject(),
        password: undefined,
        refresh_token: undefined,
      };
    } catch (error) {
      throw new InternalServerErrorException('Internal Server Error');
    }
  }
  private async generateToken(payload: { _id: string; email: string }) {
    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, {
        secret: this.config.get('JWT_REFRESH_SECRET'),
        expiresIn: '100d',
      }),
    ]);

    return {
      access_token,
      refresh_token,
    };
  }

  private generateAvatarUrl(name: string) {
    return 'https://ui-avatars.com/api/?background=random&name=' + name;
  }
}
