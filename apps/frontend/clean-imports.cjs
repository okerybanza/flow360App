const fs = require('fs');
const path = require('path');

// Liste des fichiers à nettoyer avec leurs imports non utilisés
const filesToClean = [
  {
    file: 'src/components/EmojiPicker.tsx',
    removeImports: ['Smile'],
    removeParams: ['onClose']
  },
  {
    file: 'src/components/FileAttachment.tsx',
    removeImports: ['Badge', 'Download']
  },
  {
    file: 'src/components/FileComments.tsx',
    removeImports: ['Badge', 'MoreVertical', 'User'],
    removeVars: ['user', 'error']
  },
  {
    file: 'src/components/FilePreview.tsx',
    removeImports: ['useEffect', 'Badge']
  },
  {
    file: 'src/components/FilePreviewPanel.tsx',
    removeImports: ['Card', 'CardContent', 'CardHeader', 'CardTitle'],
    removeVars: ['isText']
  },
  {
    file: 'src/components/ProjectDiscussions.tsx',
    removeImports: ['User', 'MoreVertical']
  },
  {
    file: 'src/components/ProjectFiles.tsx',
    removeImports: ['Badge', 'X', 'Loader2', 'MessageSquare']
  },
  {
    file: 'src/components/ProjectMaterials.tsx',
    removeImports: ['useState']
  },
  {
    file: 'src/components/ProjectOverview.tsx',
    removeImports: ['Card', 'CardContent', 'Progress']
  },
  {
    file: 'src/components/TemplateStepsEditor.tsx',
    removeVars: ['setSteps', 'stepId', 'data', 'taskIndex']
  },
  {
    file: 'src/components/ui/ClientCard.tsx',
    removeImports: ['MapPin']
  },
  {
    file: 'src/components/ui/ClientListView.tsx',
    removeVars: ['getClientTypeIcon']
  },
  {
    file: 'src/components/ui/select.tsx',
    removeParams: ['ref']
  },
  {
    file: 'src/components/UserPreferences.tsx',
    removeImports: ['React']
  },
  {
    file: 'src/contexts/NotificationContext.tsx',
    removeImports: ['useContext']
  },
  {
    file: 'src/pages/DashboardPage.tsx',
    removeImports: ['Target'],
    removeVars: ['plannedProjects', 'onHoldProjects', 'completionRate', 'averageBudget']
  },
  {
    file: 'src/pages/MaterialsPage.tsx',
    removeImports: ['Card', 'CardContent']
  },
  {
    file: 'src/pages/ProjectPage.tsx',
    removeImports: ['Edit'],
    removeVars: ['handleEdit', 'handleDelete']
  },
  {
    file: 'src/pages/SettingsPage.tsx',
    removeImports: ['ProfilePhotoUpload']
  },
  {
    file: 'src/pages/TemplatesPage.tsx',
    removeImports: ['Textarea', 'Settings', 'Eye', 'Copy']
  }
];

function cleanFile(filePath, config) {
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');

  // Remove unused imports
  if (config.removeImports) {
    config.removeImports.forEach(importName => {
      // Remove from lucide-react imports
      content = content.replace(
        new RegExp(`\\b${importName}\\b\\s*,?\\s*`, 'g'),
        ''
      );
      
      // Clean up empty import statements
      content = content.replace(/import\s*{\s*}\s*from\s*['"][^'"]+['"];?\s*/g, '');
      content = content.replace(/import\s*{\s*,\s*}\s*from\s*['"][^'"]+['"];?\s*/g, '');
    });
  }

  // Remove unused parameters
  if (config.removeParams) {
    config.removeParams.forEach(paramName => {
      content = content.replace(
        new RegExp(`\\b${paramName}\\b\\s*:?\\s*[^,)]*\\s*,?\\s*`, 'g'),
        ''
      );
    });
  }

  // Remove unused variables
  if (config.removeVars) {
    config.removeVars.forEach(varName => {
      content = content.replace(
        new RegExp(`\\bconst\\s+\\{\\s*${varName}\\s*\\}\\s*=\\s*[^;]+;?\\s*`, 'g'),
        ''
      );
      content = content.replace(
        new RegExp(`\\b${varName}\\s*:\\s*[^,}]+\\s*,?\\s*`, 'g'),
        ''
      );
    });
  }

  fs.writeFileSync(filePath, content);
  console.log(`Cleaned: ${filePath}`);
}

// Clean all files
filesToClean.forEach(config => {
  cleanFile(config.file, config);
});

console.log('Import cleaning completed!');
