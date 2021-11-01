##  NFT拍卖系统

一、运行

- 安装环境与Ganache

- 使用Node.js安装truffle框架：

  `npm install truffle` 或 `yarn add truffle`

- 在Ganache的workspace 标签页中 add project 选中 [./contracts/truffle-config.js](https://github.com/LBruyne/miniICO/blob/main/contracts/truffle-config.js)，在server标签卡中将端口改为7545。

- 运行：

  ```
  truffle compile` 和 `truffle migrations
  ```

- `yarn start` 或 `npm start` 运行应用。

二、运行截图

接入用户

![image-20211101221100675](C:\Users\HM\AppData\Roaming\Typora\typora-user-images\image-20211101221100675.png)

上传文件，点击CID可查看文件

![image-20211101221131495](C:\Users\HM\AppData\Roaming\Typora\typora-user-images\image-20211101221131495.png)

开始拍卖

![image-20211101221221010](C:\Users\HM\AppData\Roaming\Typora\typora-user-images\image-20211101221221010.png)

加价

![image-20211101221239723](C:\Users\HM\AppData\Roaming\Typora\typora-user-images\image-20211101221239723.png)

下架

![image-20211101221252264](C:\Users\HM\AppData\Roaming\Typora\typora-user-images\image-20211101221252264.png)

