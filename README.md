[编辑器访问地址](http://localhost:8080/#/editor?uid=123&activity_id=2)

[H5访问地址](http://localhost:8080?uid=123&activity_id=2)


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