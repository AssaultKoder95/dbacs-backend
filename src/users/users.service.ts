import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Member } from '../domain/member';

@Injectable()
export class UsersService {
  constructor(
    @Inject('MEMBER_REPOSITORY') private memberRepository: Repository<Member>,
  ) {}

  async findOneOrCreate(
    email: string,
    firstName: string,
    lastName: string,
  ): Promise<Member | undefined> {
    const member = await this.memberRepository.findOne({
      email: email,
    });

    if (member) {
      return member;
    } else {
      const member = new Member();
      member.email = email;
      member.name = `${firstName} ${lastName}`;
      return this.memberRepository.save(member);
    }
  }

  async findOne(email: string): Promise<Member | null> {
    const member = await this.memberRepository.findOne({
      email: email,
    });

    return member ? member : null;
  }
}
