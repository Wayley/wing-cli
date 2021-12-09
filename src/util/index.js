const fs = require('fs-extra');
const path = require('path');

/**
 * @description 异步写入多文件
 * @param {String} targetDir 目标目录名称
 * @param {Object} files 文件信息
 */
exports.writeFiles = async function (targetDir, files) {
  Object.keys(files).forEach(async (fileName) => {
    try {
      const filePath = path.join(targetDir, fileName);
      fs.ensureDirSync(path.dirname(filePath));
      await fs.writeFile(filePath, files[fileName]);
    } catch (error) {
      throw error;
    }
  });
};
