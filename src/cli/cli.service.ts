import { Injectable } from '@nestjs/common';
import { ImporterService } from '../import/importer.service';

@Injectable()
export class CliService {
  constructor(private readonly importService: ImporterService) {}

  async runImportCommand(filePath: string) {
    await this.importService.importData(filePath);
    console.log('Import completed!');
  }
}
