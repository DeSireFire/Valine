# Valine 魔改 隐私专版

## Instruction

这是根据 [xCss/Valine#336](https://github.com/xCss/Valine/issues/336) 的需求实现的魔改版本。

因 *发送请求中响应内容明文暴露评论者IP、邮箱等隐私内容*，博客主需要[手动更改字段权限](https://leancloud.cn/docs/data_security.html#hash723958571)，然而，如果设置 mail 客户端不可见，将不会显示评论者的 Gravatar，转为显示默认头像。

该魔改版新增一个可见字段（`mailMd5`）存储 mail 的 MD5，并提供了脚本处理现有数据。

## Usage

1. 访问 LeanCloud 控制台 > 存储 > 结构化数据
2. 选择 Comment Class，分别点击 mail 和 ip 相应字段的下拉菜单，选择编辑
3. 勾选"客户端不可见"后，客户端发起查询的时候，返回的结果将不包含这个字段
4. 使用脚本处理现有数据
5. 替换博客的 Valine