# 圖表遊樂區

記載了一些在工作中因應實務需求設計出來的圖表component，主要運用的套件是angular + D3，這邊就沒有記載一些常用的圖表(長條、折線)了，只有特別列出一些不常見但自己經驗中常使用的圖表

## 懶人包

原本是打算利用純 d3.js 客製出簡單的匯入資料就產出報表的小工具，沒想到後來需求越來越多，但是原本的做法做出來的東西基本上沒有太大的重用性，就想到利用 angular 將我的一些圖表封裝成 component 再整理成 module 供自己在專案中使用

1. 安裝套件 
```
    npm i
```

2. 開始使用
```
    npm start

    view this site in localhost:4200
```

#### 離線體驗

如果是在本機端使用，不妨可以體驗一下離線體驗，這份專案裡面有埋了 service worker 主要是為了測試一下他的 offline cache 功能，以及未來有機會做網頁推播的前置工作

執行步驟

1. 安裝套件
```
    npm i
```

2. 打包成產品環境用的檔案
```
    npm run build-prod-ngsw
```

3. 使用 http-server 建立瀏覽環境
```
    npm run serve-ngsw

    view the site in localhost:8080
```



