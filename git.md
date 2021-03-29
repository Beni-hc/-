#### 初始化 Git 仓库

> `git init`

###### 使用指定目录作为仓库

> `git init xxx(文件夹)`

#### 添加新文件

> `git add xxx(文件名)`

###### 添加所有文件

> `git add *`

#### 提交版本到仓库

> `git commit -m "xxx(注释信息)"`

###### -a 选项可将所有被修改或者已删除的且已经被 git 管理的文档提交到仓库中，-a 不会造成新文件被提交，只能修改。

> `git commit -a -m "xxx(注释信息)"`

#### 版本发布

###### 克隆

> `git clone ssh://example.com/~/www/project.git`

###### 推送

> `git push ssh://example.com/~/www/project.git`

###### 拉取

> `git pull` >`git pull ssh://example.com/~/www/project.git`

#### 删除文件

> `git rm file`

#### 分支与合并

###### 创建分支

> `git branch test`

###### 切换分支

> `git checkout test`

###### 分支合并到主分支

> `git checkout master` >`git merge test`

###### 删除分支

> `git branch -d test`
