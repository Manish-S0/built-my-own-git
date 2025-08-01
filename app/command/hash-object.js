const fs=require('fs');
const path=require('path');
const crypto=require('crypto');
const zlib=require('zlib');


class HashObjectCommand{
  constructor(flag,filepath){
    this.flag=flag;
    this.filepath=filepath;
  }
  execute(){
    const filepath=path.resolve(this.filepath);

    if(!fs.existsSync(filepath)){
      throw new Error(`${this.filepath}: No such file or directory`)
    }
    //read the file
    const fileContent=fs.readFileSync(filepath);
    const filelength=fileContent.length;

    //create blob and compress
    const header=`blob ${filelength}\0`;//blob object=header + null byte + content
    const fullContent=Buffer.concat([Buffer.from(header),fileContent]);
    //create hash
    const hash=crypto.createHash('sha1').update(fullContent).digest('hex');

    //if -w then write file
    if (this.flag && this.flag==='-w'){
      const folder=hash.slice(0,2);
      const file=hash.slice(2);

      const completeFolderPath=path.join(process.cwd(),'.mygit','objects',folder);

      if(!fs.existsSync(completeFolderPath)){
        fs.mkdirSync(completeFolderPath,{recursive:true});
      }
      const compressedData=zlib.deflateSync(fullContent);

      fs.writeFileSync(path.join(completeFolderPath,file),compressedData);

    }
    process.stdout.write(hash);
  }
}

module.exports={HashObjectCommand}; 