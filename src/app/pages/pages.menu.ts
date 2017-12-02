export const PAGES_MENU = [
  {
    path: 'pages',
    children: [
      {
        path: 'custom',
        data: {
          menu: {
            title: 'Custom',
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
                title: 'TabComponent'
              }
            }
          }
        ]
      },
      {
        path: 'album',
        data: {
          menu: {
            title: 'Project Album',
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
