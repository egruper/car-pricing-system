import { rm } from "fs/promises";
import { join} from 'path';

//Adding a global beforeEach function to run before each test of all spec files
 global.beforeEach(async () => {
    // Remove the 'test.sqlite' file, by doing so the DB will be deleted, 
    // and the TypeOrm will create it again.
    try {
        await rm(join(__dirname, '..', 'test.sqlite'));
    } catch (err) {
        // If the file doesn't exists we dont want to handle any error,
        // since this is the point - not having the db.
    }
    
 }); 