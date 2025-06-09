import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { MealplanModule } from './mealplan/mealplan.module';
import { WorkoutModule } from './workout/workout.module';
import { VideoModule } from './video/video.module';
import { TestimonialModule } from './testimonial/testimonial.module';
import { ContentModule } from './content/content.module';
import { ImageModule } from './image/image.module';
import { SettingsModule } from './settings/settings.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UserModule,
    MealplanModule,
    WorkoutModule,
    VideoModule,
    TestimonialModule,
    ContentModule,
    ImageModule,
    SettingsModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}
