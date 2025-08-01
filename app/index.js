const fs = require("fs");
const path = require("path");



//importing commands

const {AddCommand}=require('./command/addCommand')
const {CatFileCommand}=require('./command/cat-file')
const {HashObjectCommand}=require('./command/hash-object')

const client=require('./gitClient')
const gitClient=new client();

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

  case "cat-file":
    handleCatFileCommand();
    break;

  case "hash-object":
    handleHashObject();
    break;

  default:
    throw new Error(`Unknown command ${command}`);
}

// Create git directory
function createGitDirectory() {
  fs.mkdirSync(path.join(process.cwd(), ".mygit"), { recursive: true });      // { recursive: true } create intermediate parent if they dont exist
  fs.mkdirSync(path.join(process.cwd(), ".mygit", "objects"), { recursive: true });
  fs.mkdirSync(path.join(process.cwd(), ".mygit", "refs"), { recursive: true });
  fs.writeFileSync(path.join(process.cwd(), ".mygit", "HEAD"), "ref: refs/heads/main\n");
  console.log("Initialized git directory");
}

function handleAddCommand() {
  const filepath = process.argv[3];
  const command=new AddCommand(filepath);
  gitClient.run(command);

}

function handleCatFileCommand(){
  const flag=process.argv[3];
  const commitSHA=process.argv[4];

  const command=new CatFileCommand(flag,commitSHA);
  gitClient.run(command)
}

function handleHashObject(){
  let flag=process.argv[3];
  let filepath=process.argv[4];

  if (!filepath){
    filepath=flag;
    flag=null;
  }
  const command=new HashObjectCommand(flag,filepath);
  gitClient.run(command);
}