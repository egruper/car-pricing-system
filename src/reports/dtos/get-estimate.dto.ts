import {
    IsString,
    IsNumber,
    Min,
    Max,
    IsLongitude,
    IsLatitude,
} from 'class-validator'
// Allow to process an incoming value, i.e. string to int
// We use it since we have year and mileage which are numbers, but will be parsed as strings from the Get request
import { Transform } from 'class-transformer';

export class GetEstimateDto {
    @IsString()
    make: string;

    @IsString()
    model: string;

    // Convert the year from a pasrsed string of the http request 
    // to an int, and assign it to the year property
    @Transform(({ value }) => parseInt(value))
    @IsNumber()
    @Min(1930)
    @Max(2050)
    year: number;

    @Transform(({ value }) => parseInt(value))
    @IsNumber()
    @Min(0)
    @Max(1000000)
    mileage: number;

    @Transform(({ value }) => parseFloat(value))
    @IsLongitude()
    lng: number;

    @Transform(({ value }) => parseFloat(value))
    @IsLatitude()
    lat: number;
}