import { SUPPORTED_LANGUAGES } from '@/utils/constants';
import { Environment, isEnv } from '@/utils/environment';
import { translationSchema } from './schema';
import fs from 'node:fs';
import path from 'node:path';

if (!isEnv(Environment.DEV)) {
    console.error('This script can only be run in development mode');
    process.exit(2);
}

const base = __dirname;

// Build list of files based on SUPPORTED_LANGUAGES
const files = SUPPORTED_LANGUAGES.map((lang) => `${lang}.json`);

const failedValidations: Record<string, ReturnType<typeof translationSchema.safeParse>> = {};

for (const file of files) {
    const filePath = path.join(base, file);

    if (!fs.existsSync(filePath)) {
        console.error(`Missing locale file: ${filePath}`);
        failedValidations[file] = { success: false, error: { message: 'File not found' } } as any;
        continue;
    }

    const raw = fs.readFileSync(filePath, 'utf8');
    let json: any;
    try {
        json = JSON.parse(raw);
    } catch (err) {
        console.error(`Invalid JSON in file: ${filePath}`);
        failedValidations[file] = { success: false, error: { message: (err as Error).message } } as any;
        continue;
    }

    const validation = translationSchema.safeParse(json);
    if (!validation.success) {
        failedValidations[file] = validation;
    }
}

if (Object.keys(failedValidations).length > 0) {
    Object.entries(failedValidations).forEach(([file, validation]) => {
        console.error('Invalid locale file:', file);

        if (validation.error?.issues) {
            validation.error.issues.forEach((issue) => {
                // Prints path like: this.common.ok
                const pathStr = issue.path.length > 0 ? issue.path.join('.') : '(root)';
                console.error(`Key: ${pathStr} \n${issue.message}`);
            });
        } else if ((validation as any).error?.message) {
            console.error((validation as any).error.message);
        }
    });
    process.exit(1);
}

console.log('Locale files ok!');
process.exit(0);
