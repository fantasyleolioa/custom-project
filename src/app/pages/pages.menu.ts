export const PAGES_MENU = [
  {
    path: 'pages',
    children: [
      {
        path: 'custom',
        data: {
          menu: {
            title: '功能展示',
            icon: 'ion-android-home',
            selected: false,
            expanded: false,
            order: 0
          }
        },
        children:[
          {
            path: 'tab',
            data:{
              menu:{
                title: '頁籤Component'
              }
            }
          },
          {
            path: 'tree',
            data:{
              menu:{
                title: '樹狀資料Component'
              }
            }
          },
          {
            path: 'stateDemo',
            data:{
              menu:{
                title: '狀態Service實作'
              }
            }
          },
          {
            path: 'dragableArea',
            data:{
              menu:{
                title: '拖拉視窗'
              }
            }
          },
          // {
          //   path: 'areaCenter',
          //   data:{
          //     menu:{
          //       title: '水平、垂直置中'
          //     }
          //   }
          // }
        ]
      },
      {
        path: 'album',
        data: {
          menu: {
            title: '作品集',
            icon: 'ion-image',
            selected: false,
            expanded: false,
            order: 0
          }
        }
      }
    ]
  }
];
