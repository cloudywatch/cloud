import { Connection } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BaseTransaction {
  constructor(private readonly connection: Connection) { }

  usingItNow = async function (callback, queryRunner) {
    return await callback(queryRunner);
  };

  async runTransaction(myCallback) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const result = await this.usingItNow(myCallback, queryRunner);
      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log(error);
      throw new Error('Transaction failed');
    } finally {
      await queryRunner.release();
    }
  }

}