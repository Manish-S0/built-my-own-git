const fs=require('fs');
const path=require("path");
const zlib=require("zlib");


class CatFileCommand{
  constructor(flag,commitSHA){
    this.flag=flag
    this.commitSHA=commitSHA
  }

  execute(){
     //navigate to .git/objects/commitSHA[0..2]
    //read the file .git/objects/commitSHA[0..2]/commitSHA[2..]
    //decompress
    // output

    const flag=this.flag;
    const commitSHA=this.commitSHA;

    switch (flag){
      case "-p":{
        const filepath=commitSHA.slice(0,2);
        const filename=commitSHA.slice(2);
        
        const completePath=path.join(process.cwd(),'.mygit','objects',filepath,filename);

        if (!fs.existsSync(completePath)){
          throw new Error(`Not a valid object name ${commitSHA}`)
        }

        const content=fs.readFileSync(completePath);
        const BufferOutput=zlib.inflateSync(content);  //decompress data that was compressed using the zlib"deflate" algo

        const output=BufferOutput.toString().split('\x00')[1];
        process.stdout.write(output);
      }
    }
  }
}

module.exports={CatFileCommand};