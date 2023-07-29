import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Ledger } from "src/ledger/ledger.entity";

export enum JournalType {
    DEBIT = 'debit',
    CREDIT = 'credit'    
  }

@Entity('journals')
export class Journal {
    @PrimaryGeneratedColumn()
    id: number;

    // @Column({ default: false })
    // removed: boolean;
    
    // @Column({ type: 'timestamptz' }) // Recommended
    // jrdate: Date;

    //@Column({ type: 'timestamp' }) // Not recommended
    //@Column({ type: 'date' })
    //@Column()    
    @Column({ type: 'date' })
    date: Date;

    @ManyToOne(() => Ledger)
    @JoinColumn({name: 'ledger'})
    ledger: Ledger;
    
    @Column({
      type: 'enum',
      enum: JournalType,
      default: JournalType.DEBIT
    })
    jrtype: JournalType;

    @Column({ type: 'decimal', precision: 12, scale: 2, default: 0, })
    amount: number;

    @Column()
    particular: string;

    @CreateDateColumn()
    createdAt: Date;
}

// @Column("simple-json")
// profile: { name: string; nickname: string }

// @Column("simple-array")
// names: string[]

// @Column({
//     type: "set",
//     enum: ["admin", "editor", "ghost"],
//     default: ["ghost", "editor"]
// })
// roles: UserRoleType[]

// @Column({
//     type: "enum",
//     enum: ["admin", "editor", "ghost"],
//     default: "ghost"
// })
// role: UserRoleType

// @Column({ type: 'date' })
// date_only: string;

// @Column({ type: 'timestamptz' }) // Recommended
// date_time_with_timezone: Date;

// @Column({ type: 'timestamp' }) // Not recommended
// date_time_without_timezone: Date;

// const users = await userRepository.find({
//     where: {
//         createdAt: Between(
//             new Date(2019, 5, 3), 
//             new Date(2022, 5, 3)
//         ),
//     }
// })

// import { startOfDay, endOfDay } from 'date-fns';
// import { Between, Equal } from "typeorm";
// //...
// let findArgs = { 
//   where:{
//     date: Between(startOfDay(webInputArgs.date).toISOString(), endOfDay(webInputArgs.date).toISOString()), 
//     userId: Equal(ctx.req.session.userId)
//   }
// };
// return entity.find(findArgs) as any;

// // BeforeDate
// const BeforeDate = (date: Date) => Between(subYears(date, 100), date);
// return await this.connection.getRepository(ExampleEntity)
//       .find({ createdAt: BeforeDate(new Date()) });

// // AfterDate
// const AfterDate = (date: Date) => Between(date, addYears(date, 100));
//     return await this.connection.getRepository(ExampleEntity)
//       .find({ createdAt: BeforeDate(new Date()) });

// // BetweenDates
// // TypeORM Query Operators with validation before 2 months and actual date plus one day
//     const BetweenDates = (date: Date) => Between(subMonths(date, 2), addDays(date, 1));

//     return await this.connection.getRepository(ExampleEntity)
//       .find({
//         where: {
//           createdAt: BetweenDates(new Date()),
//         },
//       });


