import { Injectable, NotFoundException, ParseIntPipe } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dtos/create-report.dto';
import { Report } from './report.entity';
import { GetEstimateDto } from './dtos/get-estimate.dto';

@Injectable()
export class ReportsService {
    constructor(@InjectRepository(Report) private repo:Repository<Report>) {}

    create(reportDto: CreateReportDto, user: User) {
        const report = this.repo.create(reportDto);
        // In the db we save the id of the user,
        // When we will save this report - behind the scene
        // the id of the user will be extracted by the repository
        report.user = user;

        return this.repo.save(report);
    }

    async changeApproval(id: string, approved: boolean) {
        const report = await this.repo.findOne({ 
            where: {
                id: parseInt(id) 
            }
        });
        if (!report) {
            throw new NotFoundException('report not found');
        }

        report.approved = approved;
        return this.repo.save(report);
    }

    // We estimate a price by calculating the average 3 prices that fit this logic:
    // - same make as requested make
    // - same model as requester model
    // - lng in range of [-5, 5] of requested lng
    // - lat in range of [-5, 5] of requested lat
    // - year in range of [-3, 3] of requested year
    createEstimare({ make, model, year, lng, lat, mileage }: GetEstimateDto) {
        return this.repo.createQueryBuilder()
            .select('AVG(price)', 'price')
            .where('make = :make', { make})
            .andWhere('model = :model', { model})
            .andWhere('lng - :lng BETWEEN -5 AND 5', { lng })
            .andWhere('lat - :lat BETWEEN -5 AND 5', { lat })
            .andWhere('year - :year BETWEEN -3 AND 3', { year })
            .orderBy('ABS(mileage - :mileage)', 'DESC')
            .andWhere('approved IS TRUE')
            // 'orderBy' doen't take a parameter object as a second parameter, so we use 'setParameter' instead
            .setParameters({ mileage })
            .limit(3)
            .getRawOne();
    }
}
