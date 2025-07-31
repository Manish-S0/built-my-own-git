const fs = require("fs");
const path = require("path");

// Get command from CLI
const command = process.argv[2];

// Handle command
switch (command) {
  case "init":
    createGitDirectory();
    break;

    case "add":
      handleAddCommand();
      break;

    

  default:
    throw new Error(`Unknown command ${command}`);
}

// Create git directory
function createGitDirectory() {
  fs.mkdirSync(path.join(process.cwd(), ".mygit"),{ recursive: true });      // { recursive: true } create intermediate parent if they dont exist
  fs.mkdirSync(path.join(process.cwd(), ".mygit", "objects"), { recursive: true });
  fs.mkdirSync(path.join(process.cwd(), ".mygit", "refs"), { recursive: true });
  fs.writeFileSync(path.join(process.cwd(), ".mygit", "HEAD"), "ref: refs/heads/main\n");
  console.log("Initialized git directory");
}

function handleAddCommand(){
  const filename =process.argv[3];
  
}
