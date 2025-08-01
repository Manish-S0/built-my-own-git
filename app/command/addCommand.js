// Importing required modules
const fs = require('fs');                      // Node.js module for file system operations
const path = require('path');                  // Node.js module for handling and transforming file paths
const crypto = require('crypto');              // Node.js module for cryptographic functionality (used to hash content)

// Function to create a SHA-1 hash of file content
const hashContent = (content) => {
  return crypto.createHash('sha1')             // Create SHA-1 hash instance
        .update(content)                // Update the hash with the file content
        .digest('hex');                 // Generate the final hash in hexadecimal format
};

// Class to handle adding files to a staging area (like `git add`)
class AddCommand {
  constructor(filepath) {
    this.filepath = filepath;                  // Store the provided filepath
  }

  execute() {
    // Function to add a single file to the .mygit/index (staging area)
    const addFile = (filename) => {
      const filePath = path.resolve(filename); // Resolve full absolute path of the file

      try {
        const stat = fs.statSync(filePath);    // Get file/directory status (metadata)
        if (!stat.isFile()) {                  // Check if it's not a regular file
          console.error(`"${filename}" is not a valid file.`);
          return;                              // Stop execution for invalid file
        }

        const content = fs.readFileSync(filePath, 'utf8'); // Read file content as string

        const fileHash = hashContent(content);             // Create a SHA-1 hash of file content

        const gitDir = path.resolve('.mygit');             // Path to `.mygit` directory
        if (!fs.existsSync(gitDir)) {
          fs.mkdirSync(gitDir, { recursive: true });       // Create `.mygit` if it doesn't exist
        }

        //store blob obj
        const objectsDir=path.join(gitDir,'objects');
        const dirName=fileHash.slice(0,2);
        const fileName=fileHash.slice(2);

        const objectDir=path.join(objectsDir,dirName);
        const objectPath=path.join(objectDir,filename)

        if(!fs.existsSync(objectDir)){
          fs.mkdirSync(objectDir,{recursive:true});
        }
        if(fs.existsSync(objectPath)){
          fs.writeFileSync(objectPath,content,'utf8');
        }
        
        
        const indexFile = path.resolve(gitDir, 'index');   // Path to `.mygit/index` file

        if (!fs.existsSync(indexFile)) {
          fs.writeFileSync(indexFile, '');                 // Create an empty index file if it doesn't exist
        }

        let indexContent = fs.readFileSync(indexFile, 'utf8'); // Read the current content of the index

        const fileEntry = `${fileHash} ${filename}`;       // Create entry string: "hash filename"
        if (!indexContent.includes(fileEntry)) {
          indexContent += `${fileHash} ${filename}\n`;     // Append entry if not already present
          fs.writeFileSync(indexFile, indexContent);       // Overwrite the index file with updated content
          console.log(`Added "${filename}" to the staging area.`);
        } else {
          console.log(`"${filename}" is already staged.`); // Inform if file is already in index
        }

      } catch (error) {
        // Handle any read/write/stat errors
        console.error(`Error processing file "${filename}": ${error.message}`);
      }
    };

    // Recursive function to add all files from a directory (and subdirectories)
    const addAllFiles = (dir) => {
      const files = fs.readdirSync(dir);                   // Read all file/folder names in the directory

      files.forEach((file) => {
        const filePath = path.join(dir, file);             // Create full path for current file
        const stat = fs.statSync(filePath);                // Get metadata (file or folder)

        if (stat.isFile()) {
          addFile(filePath);                               // Add the file to staging area
        } else if (stat.isDirectory() && file !== '.mygit' && file !== '.git') {
          addAllFiles(filePath);                           // Recursively add contents of subdirectories
        }
      });
    };

    // Convert input to absolute path
    const filePath = path.resolve(this.filepath);

    // Determine if the input is a single file, directory, or current directory
    if (filePath === '.') {
      addAllFiles(process.cwd());                          // If ".", add all files from current working directory
    } else if (fs.existsSync(filePath)) {
      const stat = fs.statSync(filePath);

      if (stat.isFile()) {
        addFile(filePath);                                 // If input is a file, add it
      } else if (stat.isDirectory()) {
        addAllFiles(filePath);                             // If input is a directory, add all its files
      }
    } else {
      console.error(`"${input}" does not exist.`);         // Error if path does not exist
    }
  }
}

// Export the AddCommand class to be used in other files
module.exports = { AddCommand };
