import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import{UsersService} from './users.service';
import {User} from './user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    providers: [UsersService],
    exports: [UsersService], // export để auth module có thể dùng duoc

})

export class UsersModule {}

