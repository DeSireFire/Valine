const AV = require('leancloud-storage');
const md5 = require('blueimp-md5');

// LeanCloud 后台 -> 设置 -> 应用 Keys
AV.init({
  appId: "AppID",
  appKey: "AppKey",
  masterKey: "MasterKey",
  serverURL: "服务器地址"
});

// 搞到超级管理员权限（用来更新数据）
AV.Cloud.useMasterKey(true);

// 新建查询
const query = new AV.Query('Comment');

// 记录修改了几条记录
let migratedCount = 0;

/**
 * LeanCloud 限制每次查询最多返回 1000 条
 * 默默地看了一下我的博客的评论数：191
 * 不会有谁的博客有超过 1000 评论吧？？不会吧？？？
 * 算了还是考虑一下这种情况吧 T A T
 */
query.count().then(async (count) => {
  const pageSize = 100;
  const pageCount = Math.ceil(count / pageSize);
  for (let pageNo = 0; pageNo < pageCount; pageNo++) {
    query.ascending('createdAt');
    query.skip(pageNo * pageSize);
    query.limit(pageSize);
    await query.find().then(async (comments) => {
      for (const comment of comments) {
        migratedCount++;
        const mail = comment.get('mail');
        let mailMd5 = comment.get('mailMd5');
        if (mail) {
          if (mailMd5 === undefined) {
            mailMd5 = md5(mail);
            comment.set('mailMd5', mailMd5);
            console.log(`已处理：${migratedCount} 条，邮箱：${mail}，MD5：${mailMd5}`);
          } else {
            console.log(`已处理：${migratedCount} 条，邮箱：${mail}，MD5：${mailMd5}，但是数据已存在~`);
          }
        } else {
          comment.set('mailMd5', '');
          console.log(`已处理：${migratedCount} 条，是个匿名评论～`);
        }
      }
      await AV.Object.saveAll(comments);
      console.log(`已保存：第 ${pageNo + 1} 页评论数据`);
    });
  }
});
