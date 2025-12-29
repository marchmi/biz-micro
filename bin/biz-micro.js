#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const commander_1 = require("commander");
const inquirer_1 = __importDefault(require("inquirer"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const chalk_1 = __importDefault(require("chalk"));
const ora_1 = __importDefault(require("ora"));
const VERSION = '1.0.0';
const TEMPLATES = [
    { name: 'qiankun-main-vite', description: 'Qiankun 主应用模板 (Vite)', framework: 'qiankun', type: 'main' },
    { name: 'qiankun-sub-vite', description: 'Qiankun 子应用模板 (Vite)', framework: 'qiankun', type: 'sub' },
    { name: 'wujie-main-vite', description: 'Wujie 主应用模板 (Vite)', framework: 'wujie', type: 'main' },
    { name: 'wujie-sub-vite', description: 'Wujie 子应用模板 (Vite)', framework: 'wujie', type: 'sub' }
];
function runList() {
    console.log(chalk_1.default.blue('\n📋 可用的微前端模板\n'));
    const qiankunTemplates = TEMPLATES.filter(t => t.framework === 'qiankun');
    const wujieTemplates = TEMPLATES.filter(t => t.framework === 'wujie');
    console.log(chalk_1.default.cyan('┌─────────────────────────────────────────────────────────────┐'));
    console.log(chalk_1.default.cyan('│  Qiankun 模板                                             │'));
    console.log(chalk_1.default.cyan('├─────────────────────────────────────────────────────────────┤'));
    qiankunTemplates.forEach(template => {
        const label = template.type === 'main' ? '主应用' : '子应用';
        console.log(chalk_1.default.cyan('│  ') + template.name.padEnd(25) + label.padEnd(8) + template.description);
    });
    console.log(chalk_1.default.cyan('├─────────────────────────────────────────────────────────────┤'));
    console.log(chalk_1.default.cyan('│  Wujie 模板                                               │'));
    console.log(chalk_1.default.cyan('├─────────────────────────────────────────────────────────────┤'));
    wujieTemplates.forEach(template => {
        const label = template.type === 'main' ? '主应用' : '子应用';
        console.log(chalk_1.default.cyan('│  ') + template.name.padEnd(25) + label.padEnd(8) + template.description);
    });
    console.log(chalk_1.default.cyan('└─────────────────────────────────────────────────────────────┘'));
    console.log(chalk_1.default.gray('\n使用说明:'));
    console.log(chalk_1.default.white('  biz-micro create              # 交互式创建项目'));
    console.log(chalk_1.default.white('  biz-micro init --framework qiankun --bundler vite  # 快速初始化'));
    console.log(chalk_1.default.white('  biz-micro add --name my-sub-app --port 3001         # 添加子应用'));
    console.log();
}
const program = new commander_1.Command('biz-micro');
program.version(VERSION, '-v, --version');
program.command('list')
    .description('列出所有可用的微前端模板')
    .action(() => {
    runList();
});
program.command('create')
    .description('创建微前端应用')
    .action(async () => {
    try {
        await runCreate();
    }
    catch (error) {
        console.error(chalk_1.default.red('创建失败:', error.message));
        process.exit(1);
    }
});
program.command('init')
    .description('初始化主应用（交互式）')
    .action(async () => {
    try {
        await runInit();
    }
    catch (error) {
        console.error(chalk_1.default.red('初始化失败:', error.message));
        process.exit(1);
    }
});
program.command('add')
    .description('添加子应用（交互式）')
    .action(async () => {
    try {
        await runAdd();
    }
    catch (error) {
        console.error(chalk_1.default.red('添加子应用失败:', error.message));
        process.exit(1);
    }
});
async function runCreate() {
    console.log(chalk_1.default.blue('🚀 欢迎使用 biz-micro 微前端脚手架\n'));
    const answers = await inquirer_1.default.prompt([
        {
            type: 'list',
            name: 'appType',
            message: '请选择要创建的应用类型：',
            choices: [
                { name: '主应用 (Main App) - 管理子应用', value: 'main' },
                { name: '子应用 (Sub App) - 被主应用加载', value: 'sub' }
            ]
        },
        {
            type: 'list',
            name: 'framework',
            message: '请选择微前端框架：',
            choices: [
                { name: 'qiankun', value: 'qiankun' },
                { name: 'wujie', value: 'wujie' }
            ]
        },
        {
            type: 'list',
            name: 'bundler',
            message: '请选择构建工具：',
            choices: [
                { name: 'Vite (推荐)', value: 'vite' },
                { name: 'Webpack', value: 'webpack' }
            ]
        },
        {
            type: 'input',
            name: 'projectName',
            message: '请输入项目名称：',
            validate: (input) => {
                if (!input.trim()) {
                    return '项目名称不能为空';
                }
                return true;
            }
        },
        {
            type: 'input',
            name: 'description',
            message: '请输入项目描述：'
        }
    ]);
    const { appType, framework, bundler, projectName, description } = answers;
    const targetFramework = framework;
    console.log(chalk_1.default.blue('\n📦 开始创建项目...\n'));
    console.log(chalk_1.default.gray(`  应用类型: ${appType === 'main' ? '主应用' : '子应用'}`));
    console.log(chalk_1.default.gray(`  框架: ${targetFramework}`));
    console.log(chalk_1.default.gray(`  构建工具: ${bundler}`));
    console.log(chalk_1.default.gray(`  项目名称: ${projectName}`));
    const spinner = (0, ora_1.default)('正在生成项目文件...').start();
    try {
        await generateProject({
            appType,
            framework: targetFramework,
            bundler,
            projectName,
            description
        });
        spinner.succeed(chalk_1.default.green('✅ 项目创建成功！\n'));
        console.log(chalk_1.default.blue('📝 下一步操作：'));
        console.log(chalk_1.default.white(`  cd ${projectName}`));
        console.log(chalk_1.default.white('  npm install'));
        console.log(chalk_1.default.white('  npm run dev'));
        if (appType === 'main') {
            console.log(chalk_1.default.yellow('\n⚠️  主应用创建完成后，可以使用 "biz-micro add" 添加子应用'));
        }
    }
    catch (error) {
        spinner.fail(chalk_1.default.red('项目创建失败'));
        throw error;
    }
}
async function runInit() {
    console.log(chalk_1.default.blue('🚀 初始化主应用\n'));
    const answers = await inquirer_1.default.prompt([
        {
            type: 'list',
            name: 'framework',
            message: '请选择微前端框架：',
            choices: [
                { name: 'qiankun', value: 'qiankun' },
                { name: 'wujie', value: 'wujie' }
            ]
        },
        {
            type: 'list',
            name: 'bundler',
            message: '请选择构建工具：',
            choices: [
                { name: 'Vite (推荐)', value: 'vite' },
                { name: 'Webpack', value: 'webpack' }
            ]
        }
    ]);
    const { framework, bundler } = answers;
    const templateName = `main-app-${framework}-${bundler}`;
    console.log(chalk_1.default.blue('\n📦 开始初始化主应用...\n'));
    const spinner = (0, ora_1.default)('正在生成主应用...').start();
    try {
        await generateProject({
            appType: 'main',
            framework,
            bundler,
            projectName: 'main-app',
            description: '主应用'
        });
        spinner.succeed(chalk_1.default.green('✅ 主应用初始化成功！\n'));
    }
    catch (error) {
        spinner.fail(chalk_1.default.red('初始化失败'));
        throw error;
    }
}
async function runAdd() {
    console.log(chalk_1.default.blue('🚀 添加子应用\n'));
    const answers = await inquirer_1.default.prompt([
        {
            type: 'input',
            name: 'appName',
            message: '请输入子应用名称：',
            validate: (input) => {
                if (!input.trim()) {
                    return '子应用名称不能为空';
                }
                return true;
            }
        },
        {
            type: 'input',
            name: 'port',
            message: '请输入子应用端口号：',
            default: '3001',
            validate: (input) => {
                const port = parseInt(input);
                if (isNaN(port) || port < 1 || port > 65535) {
                    return '请输入有效的端口号 (1-65535)';
                }
                return true;
            }
        },
        {
            type: 'list',
            name: 'framework',
            message: '请选择所属框架：',
            choices: [
                { name: 'qiankun', value: 'qiankun' },
                { name: 'wujie', value: 'wujie' }
            ]
        },
        {
            type: 'list',
            name: 'bundler',
            message: '请选择构建工具：',
            choices: [
                { name: 'Vite (推荐)', value: 'vite' },
                { name: 'Webpack', value: 'webpack' }
            ]
        }
    ]);
    console.log(chalk_1.default.blue('\n📦 开始创建子应用...\n'));
    const spinner = (0, ora_1.default)('正在生成子应用...').start();
    try {
        await generateProject({
            appType: 'sub',
            framework: answers.framework,
            bundler: answers.bundler,
            projectName: answers.appName,
            description: '子应用',
            port: answers.port
        });
        spinner.succeed(chalk_1.default.green('✅ 子应用创建成功！\n'));
        console.log(chalk_1.default.yellow('\n⚠️  请将子应用注册到主应用中'));
        console.log(chalk_1.default.white(`  子应用地址: http://localhost:${answers.port}`));
    }
    catch (error) {
        spinner.fail(chalk_1.default.red('创建失败'));
        throw error;
    }
}
async function generateProject(options) {
    const { appType, framework, bundler, projectName, description, port } = options;
    const templatePath = path_1.default.join(__dirname, '..', 'templates', `${framework}-app-${bundler}`);
    const targetPath = path_1.default.join(process.cwd(), projectName);
    if (fs_extra_1.default.existsSync(targetPath)) {
        throw new Error(`目录 ${projectName} 已存在`);
    }
    await fs_extra_1.default.copy(templatePath, targetPath);
    await updatePackageJson(targetPath, projectName, description);
    await updateEnvFile(targetPath, port);
    console.log(chalk_1.default.green(`✅ 项目已创建到: ${targetPath}`));
}
async function updatePackageJson(targetPath, projectName, description) {
    const packageJsonPath = path_1.default.join(targetPath, 'package.json');
    const packageJson = await fs_extra_1.default.readJSON(packageJsonPath);
    packageJson.name = projectName;
    if (description) {
        packageJson.description = description;
    }
    await fs_extra_1.default.writeJSON(packageJsonPath, packageJson, { spaces: 2 });
}
async function updateEnvFile(targetPath, port) {
    const envPath = path_1.default.join(targetPath, '.env.development');
    let content = '';
    if (fs_extra_1.default.existsSync(envPath)) {
        content = await fs_extra_1.default.readFile(envPath, 'utf-8');
    }
    if (port) {
        content = `VITE_APP_PORT=${port}\n${content}`;
    }
    await fs_extra_1.default.writeFile(envPath, content);
}
program.parse(process.argv);
//# sourceMappingURL=biz-micro.js.map