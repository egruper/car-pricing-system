import { Expose, Transform } from 'class-transformer'
import { User } from '../../users/user.entity'

// ReportDto takes a report entity instance and convert it
// to an object that we can control what to expose from
export class ReportDto {
    @Expose()
    id: number;

    @Expose()
    price: number;

    @Expose()
    year: number;

    @Expose()
    lng: number;

    @Expose()
    lat: number;

    @Expose()
    make: string;

    @Expose()
    model: string;

    @Expose()
    mileage: number;

    @Expose()
    approved: boolean;

    // Adding new property 'userId' of the user that created the report.
    // We expose only the userId and not the whole User object with all its properties.
    // Using the @Transform we look and the report object and returns the user id of its user.
    // 'obj' - a reference to the original Report entity
    @Transform(({ obj }) => obj.user.id)
    @Expose()
    userId: number;
}