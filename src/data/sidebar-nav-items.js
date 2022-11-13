export default function () {
  return [{
    title: '测试指标管理',
    htmlBefore: '<i class="material-icons">edit</i>',
    to: {
      name: 'blog-overview',
    },
    items:[
      {
        title: '添加测试指标',
        htmlBefore: '<i class="material-icons">edit</i>',
        to: {
          name: 'TJCSZB',
        },
      },
      {
        title: '测试指标关联的测试用例',
        htmlBefore: '<i class="material-icons">edit</i>',
        to: {
          name: 'CSZBGLDCSYL',
        },
      },
      {
        title: '测试指标关联测试用例',
        htmlBefore: '<i class="material-icons">edit</i>',
        to: {
          name: 'CSZBGLCSYL',
        },
      },
    ],
  },{
    title: '测试用例管理',
    to: {
      name: 'blog-overview',
    },
    htmlBefore: '<i class="material-icons">edit</i>',
    htmlAfter: '',
  },
  {
    title: '测试文档管理',
    to: {
      name: 'blog-overview',
    },
    htmlBefore: '<i class="material-icons">edit</i>',
    htmlAfter: '',
  },
  {
    title: '用户管理',
    to: {
      name: 'blog-overview',
    },
    htmlBefore: '<i class="material-icons">edit</i>',
    htmlAfter: '',
  },
  // },{
  //   title: 'Blog Dashboard',
  //   to: {
  //     name: 'blog-overview',
  //   },
  //   htmlBefore: '<i class="material-icons">edit</i>',
  //   htmlAfter: '',
  // }, {
  //   title: 'Blog Posts',
  //   htmlBefore: '<i class="material-icons">vertical_split</i>',
  //   to: {
  //     name: 'blog-posts',
  //   },
  // }, {
  //   title: 'Add New Post',
  //   htmlBefore: '<i class="material-icons">note_add</i>',
  //   to: {
  //     name: 'add-new-post',
  //   },
  // }, {
  //   title: 'Forms & Components',
  //   htmlBefore: '<i class="material-icons">view_module</i>',
  //   to: {
  //     name: 'components-overview',
  //   },
  // }, {
  //   title: 'Tables',
  //   htmlBefore: '<i class="material-icons">table_chart</i>',
  //   to: {
  //     name: 'tables',
  //   },
  //   items:[
  //     {
  //       title: 'Tables2',
  //       htmlBefore: '<i class="material-icons">table_chart</i>',
  //       to: {
  //         name: 'tables2',
  //       },
  //     }
  //   ], 
  // }, {
  //   title: 'User Profile',
  //   htmlBefore: '<i class="material-icons">person</i>',
  //   to: {
  //     name: 'user-profile-lite',
  //   },
  // }, {
  //   title: 'Errors',
  //   htmlBefore: '<i class="material-icons">error</i>',
  //   to: {
  //     name: 'errors',
  //   },
  // }];
];
}
