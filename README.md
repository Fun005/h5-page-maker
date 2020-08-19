
## 测试环境

[发布系统地址](https://deploy.inkept.cn/templates/deploy.html?job_name=cop.inke_owt.bpc_pdl.opd_servicegroup.opd_service.admin_job.activity-me_cluster.ali-test)

[编辑器访问地址](http://testboss.me.inke.cn/activity/design/#/editor?uid=123&activity_id=2)

[H5访问地址](http://testactivity.me.inke.cn/?uid=123&activity_id=2)

## gray环境

[发布系统地址](https://deploy.inkept.cn/templates/deploy.html?job_name=cop.inke_owt.bpc_pdl.opd_servicegroup.opd_service.admin_job.activity-me_cluster.ali-gray)

[编辑器访问地址](http://betaboss.me.inke.cn/activity/design/#/editor?uid=123&activity_id=2)

[H5访问地址](http://betaactivity.me.inke.cn/?uid=123&activity_id=2)

## prod环境

[发布系统地址](https://deploy.inkept.cn/templates/deploy.html?job_name=cop.inke_owt.bpc_pdl.opd_servicegroup.opd_service.admin_job.activity-me_cluster.ali-bj)

[编辑器访问地址](http://boss.me.inke.cn/activity/design/#/editor?uid=123&activity_id=2)

[H5访问地址](http://activity.me.inke.cn/?uid=123&activity_id=2)


## 目录结构
```
|-- editor					--------编辑器打包目录
|-- h5					    --------h5打包目录
|-- public					--------项目公共文件 会直接打到生成的目录中
|-- template				--------入口模版
|-- src					    --------代码目录
    |--apis					    --------接口目录（公共）
    |--config			        --------常量
    |--mixins					--------公共混入
    |--pages					--------页面
    	|--editor					--------编辑器页面
    	|--h5					    --------h5页面
    |--plugins				--------组件
    |--utils				--------工具
```