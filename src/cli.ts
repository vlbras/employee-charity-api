import { NestFactory } from '@nestjs/core';
import { CliModule } from './cli/cli.module';
import { CliService } from './cli/cli.service';
import { readFile , } from 'fs/promises';
import { existsSync } from 'fs';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(CliModule);
  const cliService = appContext.get(CliService);
  const dumpName = process.argv[2];

  if (!dumpName) {
    console.error('Please provide a dump name.');
    process.exit(1);
  }

  const filePath = `./src/database/dumps/${dumpName}`;

  if (!existsSync(filePath)) {
    console.error(`File ${filePath} does not exist.`);
    process.exit(1);
  }

  const dump = await readFile(filePath, 'utf8');
  await cliService.runImportCommand(dump);
  
  process.exit(0);
}

bootstrap();
