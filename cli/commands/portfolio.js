/**
 * Portfolio Management Commands
 * Handles portfolio project operations and data management
 */

const chalk = require('chalk');
const inquirer = require('inquirer');
const ora = require('ora');
const { table } = require('table');
const fs = require('fs-extra');
const path = require('path');
const moment = require('moment');
const boxen = require('boxen');

const api = require('../utils/api');
const config = require('../utils/config');
const { formatBytes, formatDuration } = require('../utils/formatters');

/**
 * Show portfolio commands help
 */
function showHelp() {
  console.log(
    boxen(
      `${chalk.bold.cyan('Portfolio Management Commands')}\n\n` +
      `${chalk.yellow('List & View:')}\n` +
      `  solo portfolio:list          List all projects\n` +
      `  solo portfolio:show <id>     Show project details\n\n` +
      `${chalk.green('Create & Modify:')}\n` +
      `  solo portfolio:create        Create new project\n` +
      `  solo portfolio:update <id>   Update project\n` +
      `  solo portfolio:delete <id>   Delete project\n\n` +
      `${chalk.blue('Data Management:')}\n` +
      `  solo portfolio:export        Export portfolio data\n` +
      `  solo portfolio:backup        Backup portfolio\n` +
      `  solo portfolio:restore       Restore from backup`,
      {
        padding: 1,
        margin: 1,
        borderStyle: 'round',
        borderColor: 'cyan'
      }
    )
  );
}

/**
 * List all portfolio projects
 */
async function list(options) {
  const spinner = ora('Fetching portfolio projects...').start();
  
  try {
    const projects = await api.get('/portfolio/projects');
    spinner.succeed(`Found ${projects.length} projects`);
    
    if (projects.length === 0) {
      console.log(chalk.yellow('📁 No projects found. Create your first project with:'));
      console.log(chalk.cyan('   solo portfolio:create'));
      return;
    }
    
    // Apply filters
    let filteredProjects = projects;
    if (options.filter) {
      filteredProjects = applyFilters(projects, options.filter);
    }
    
    // Sort projects
    filteredProjects = sortProjects(filteredProjects, options.sort);
    
    // Output in requested format
    switch (options.format) {
      case 'json':
        console.log(JSON.stringify(filteredProjects, null, 2));
        break;
      case 'csv':
        outputCSV(filteredProjects);
        break;
      default:
        outputTable(filteredProjects);
    }
    
  } catch (error) {
    spinner.fail('Failed to fetch projects');
    console.error(chalk.red('Error:'), error.message);
    process.exit(1);
  }
}

/**
 * Show detailed project information
 */
async function show(id, options) {
  const spinner = ora(`Fetching project ${id}...`).start();
  
  try {
    const project = await api.get(`/portfolio/projects/${id}`);
    const analytics = await api.get(`/analytics/projects/${id}`);
    
    spinner.succeed(`Project ${id} loaded`);
    
    if (options.format === 'json') {
      console.log(JSON.stringify({ project, analytics }, null, 2));
      return;
    }
    
    // Display detailed project information
    displayProjectDetails(project, analytics);
    
  } catch (error) {
    spinner.fail(`Failed to fetch project ${id}`);
    console.error(chalk.red('Error:'), error.message);
    process.exit(1);
  }
}

/**
 * Create a new portfolio project
 */
async function create(options) {
  console.log(chalk.cyan('🚀 Creating new portfolio project\n'));
  
  let projectData;
  
  if (options.interactive) {
    projectData = await interactiveProjectCreation();
  } else if (options.template) {
    projectData = await createFromTemplate(options.template);
  } else {
    // Default interactive mode
    projectData = await interactiveProjectCreation();
  }
  
  const spinner = ora('Creating project...').start();
  
  try {
    const project = await api.post('/portfolio/projects', projectData);
    spinner.succeed(`Project created successfully!`);
    
    console.log(
      boxen(
        `${chalk.green('✅ Project Created')}\n\n` +
        `${chalk.bold('ID:')} ${project.id}\n` +
        `${chalk.bold('Name:')} ${project.name}\n` +
        `${chalk.bold('URL:')} ${project.url || 'Not set'}\n\n` +
        `${chalk.cyan('Next steps:')}\n` +
        `• Add project details: ${chalk.gray(`solo portfolio:update ${project.id}`)}\n` +
        `• View project: ${chalk.gray(`solo portfolio:show ${project.id}`)}`,
        {
          padding: 1,
          margin: 1,
          borderStyle: 'round',
          borderColor: 'green'
        }
      )
    );
    
  } catch (error) {
    spinner.fail('Failed to create project');
    console.error(chalk.red('Error:'), error.message);
    process.exit(1);
  }
}

/**
 * Update project information
 */
async function update(id, options) {
  const spinner = ora(`Loading project ${id}...`).start();
  
  try {
    const project = await api.get(`/portfolio/projects/${id}`);
    spinner.succeed('Project loaded');
    
    let updateData;
    
    if (options.file) {
      // Update from JSON file
      updateData = await fs.readJson(options.file);
    } else if (options.interactive) {
      // Interactive update
      updateData = await interactiveProjectUpdate(project);
    } else {
      console.log(chalk.yellow('Please specify --file or --interactive option'));
      return;
    }
    
    const updateSpinner = ora('Updating project...').start();
    
    const updatedProject = await api.put(`/portfolio/projects/${id}`, updateData);
    updateSpinner.succeed('Project updated successfully!');
    
    displayProjectDetails(updatedProject);
    
  } catch (error) {
    spinner.fail(`Failed to update project ${id}`);
    console.error(chalk.red('Error:'), error.message);
    process.exit(1);
  }
}

/**
 * Delete a portfolio project
 */
async function deleteProject(id, options) {
  if (!options.force) {
    const { confirm } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: `Are you sure you want to delete project ${id}?`,
        default: false
      }
    ]);
    
    if (!confirm) {
      console.log(chalk.yellow('Operation cancelled'));
      return;
    }
  }
  
  const spinner = ora(`Deleting project ${id}...`).start();
  
  try {
    await api.delete(`/portfolio/projects/${id}`);
    spinner.succeed(`Project ${id} deleted successfully`);
    
  } catch (error) {
    spinner.fail(`Failed to delete project ${id}`);
    console.error(chalk.red('Error:'), error.message);
    process.exit(1);
  }
}

/**
 * Export portfolio data
 */
async function exportPortfolio(options) {
  const spinner = ora('Preparing portfolio export...').start();
  
  try {
    // Determine what to include
    const includes = options.include ? options.include.split(',') : ['projects', 'analytics'];
    
    const exportData = {
      metadata: {
        exportDate: new Date().toISOString(),
        version: '1.0.0',
        includes
      }
    };
    
    // Fetch data based on includes
    if (includes.includes('projects')) {
      exportData.projects = await api.get('/portfolio/projects');
    }
    
    if (includes.includes('analytics')) {
      exportData.analytics = await api.get('/analytics/overview');
    }
    
    if (includes.includes('games')) {
      exportData.games = await api.get('/games/data');
    }
    
    spinner.text = 'Generating export file...';
    
    // Generate output file
    const timestamp = moment().format('YYYY-MM-DD_HH-mm-ss');
    const defaultFilename = `portfolio-export-${timestamp}.${options.format}`;
    const outputPath = options.output || defaultFilename;
    
    switch (options.format) {
      case 'json':
        await fs.writeJson(outputPath, exportData, { spaces: 2 });
        break;
      case 'csv':
        await exportToCSV(exportData, outputPath);
        break;
      case 'pdf':
        await exportToPDF(exportData, outputPath);
        break;
      default:
        throw new Error(`Unsupported export format: ${options.format}`);
    }
    
    spinner.succeed(`Portfolio exported to ${outputPath}`);
    
    // Show export summary
    const stats = await fs.stat(outputPath);
    console.log(
      boxen(
        `${chalk.green('📦 Export Complete')}\n\n` +
        `${chalk.bold('File:')} ${outputPath}\n` +
        `${chalk.bold('Size:')} ${formatBytes(stats.size)}\n` +
        `${chalk.bold('Format:')} ${options.format.toUpperCase()}\n` +
        `${chalk.bold('Includes:')} ${includes.join(', ')}`,
        {
          padding: 1,
          margin: 1,
          borderStyle: 'round',
          borderColor: 'green'
        }
      )
    );
    
  } catch (error) {
    spinner.fail('Export failed');
    console.error(chalk.red('Error:'), error.message);
    process.exit(1);
  }
}

// Helper functions

function applyFilters(projects, filterCriteria) {
  // Simple filter implementation
  // Format: "status:active" or "tech:react"
  const [field, value] = filterCriteria.split(':');
  
  return projects.filter(project => {
    if (field === 'status') {
      return project.status === value;
    }
    if (field === 'tech') {
      return project.technologies && project.technologies.includes(value);
    }
    if (field === 'category') {
      return project.category === value;
    }
    return true;
  });
}

function sortProjects(projects, sortField) {
  return projects.sort((a, b) => {
    switch (sortField) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'date':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'status':
        return a.status.localeCompare(b.status);
      default:
        return 0;
    }
  });
}

function outputTable(projects) {
  const data = [
    ['ID', 'Name', 'Status', 'Category', 'Created', 'Views']
  ];
  
  projects.forEach(project => {
    data.push([
      project.id,
      project.name,
      getStatusIcon(project.status),
      project.category || 'N/A',
      moment(project.createdAt).format('MMM DD, YYYY'),
      project.views || '0'
    ]);
  });
  
  console.log(table(data, {
    border: {
      topBody: '─',
      topJoin: '┬',
      topLeft: '┌',
      topRight: '┐',
      bottomBody: '─',
      bottomJoin: '┴',
      bottomLeft: '└',
      bottomRight: '┘',
      bodyLeft: '│',
      bodyRight: '│',
      bodyJoin: '│',
      joinBody: '─',
      joinLeft: '├',
      joinRight: '┤',
      joinJoin: '┼'
    }
  }));
}

function outputCSV(projects) {
  const headers = ['ID', 'Name', 'Status', 'Category', 'Created', 'Views', 'URL'];
  console.log(headers.join(','));
  
  projects.forEach(project => {
    const row = [
      project.id,
      `"${project.name}"`,
      project.status,
      project.category || '',
      project.createdAt,
      project.views || 0,
      project.url || ''
    ];
    console.log(row.join(','));
  });
}

function displayProjectDetails(project, analytics = {}) {
  console.log(
    boxen(
      `${chalk.bold.cyan(project.name)} ${chalk.gray(`(${project.id})`)}\n\n` +
      `${chalk.bold('Status:')} ${getStatusIcon(project.status)} ${project.status}\n` +
      `${chalk.bold('Category:')} ${project.category || 'Not specified'}\n` +
      `${chalk.bold('Created:')} ${moment(project.createdAt).format('MMMM DD, YYYY')}\n` +
      `${chalk.bold('Updated:')} ${moment(project.updatedAt).fromNow()}\n\n` +
      `${chalk.bold('Description:')}\n${project.description || 'No description available'}\n\n` +
      `${chalk.bold('Technologies:')} ${project.technologies ? project.technologies.join(', ') : 'Not specified'}\n` +
      `${chalk.bold('URL:')} ${project.url || 'Not set'}\n` +
      `${chalk.bold('Repository:')} ${project.repository || 'Not set'}\n\n` +
      `${chalk.yellow('📊 Analytics:')}\n` +
      `${chalk.bold('Views:')} ${analytics.views || 0}\n` +
      `${chalk.bold('Unique Visitors:')} ${analytics.uniqueVisitors || 0}\n` +
      `${chalk.bold('Avg. Time:')} ${formatDuration(analytics.avgTime || 0)}`,
      {
        padding: 1,
        margin: 1,
        borderStyle: 'round',
        borderColor: 'cyan'
      }
    )
  );
}

function getStatusIcon(status) {
  switch (status) {
    case 'active': return '🟢';
    case 'draft': return '🟡';
    case 'archived': return '🔴';
    case 'featured': return '⭐';
    default: return '⚪';
  }
}

async function interactiveProjectCreation() {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Project name:',
      validate: input => input.length > 0 || 'Project name is required'
    },
    {
      type: 'input',
      name: 'description',
      message: 'Project description:'
    },
    {
      type: 'list',
      name: 'category',
      message: 'Project category:',
      choices: ['Web Application', 'Mobile App', 'Desktop App', 'Library', 'Tool', 'Game', 'Other']
    },
    {
      type: 'input',
      name: 'technologies',
      message: 'Technologies (comma-separated):',
      filter: input => input.split(',').map(tech => tech.trim())
    },
    {
      type: 'input',
      name: 'url',
      message: 'Project URL (optional):'
    },
    {
      type: 'input',
      name: 'repository',
      message: 'Repository URL (optional):'
    },
    {
      type: 'list',
      name: 'status',
      message: 'Project status:',
      choices: ['draft', 'active', 'featured', 'archived'],
      default: 'draft'
    }
  ]);
  
  return answers;
}

async function interactiveProjectUpdate(project) {
  console.log(chalk.cyan(`\n📝 Updating project: ${project.name}\n`));
  
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Project name:',
      default: project.name
    },
    {
      type: 'input',
      name: 'description',
      message: 'Project description:',
      default: project.description
    },
    {
      type: 'list',
      name: 'category',
      message: 'Project category:',
      choices: ['Web Application', 'Mobile App', 'Desktop App', 'Library', 'Tool', 'Game', 'Other'],
      default: project.category
    },
    {
      type: 'input',
      name: 'technologies',
      message: 'Technologies (comma-separated):',
      default: project.technologies ? project.technologies.join(', ') : '',
      filter: input => input.split(',').map(tech => tech.trim())
    },
    {
      type: 'input',
      name: 'url',
      message: 'Project URL:',
      default: project.url
    },
    {
      type: 'input',
      name: 'repository',
      message: 'Repository URL:',
      default: project.repository
    },
    {
      type: 'list',
      name: 'status',
      message: 'Project status:',
      choices: ['draft', 'active', 'featured', 'archived'],
      default: project.status
    }
  ]);
  
  return answers;
}

module.exports = {
  showHelp,
  list,
  show,
  create,
  update,
  delete: deleteProject,
  export: exportPortfolio