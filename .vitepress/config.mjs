import {defineConfig} from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lastUpdated: true,
  title: "我的文档",
  description: "A VitePress Site",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      {text: '主页', link: '/'},
      {text: '操作系统', link: '/system/ssl-certificate'},
      {text: '中间件', link: '/middleware/nginx'},
      {text: '数据库', link: '/databases/mysql'},
      {text: 'python', link: '/python/install'}
    ],

    sidebar: {
      '/middleware/': [
        {
          text: '中间件',
          collapsed: true,
          items: [
            {text: 'nginx', link: '/middleware/nginx'},
            {text: 'openvpn', link: '/middleware/openvpn'},
          ]
        }
      ],
      '/databases/': [
        {
          text: '数据库',
          collapsed: true,
          items: [
            {
              text: 'mysql',
              items: [
                {text: 'mysql基础操作', link: '/databases/mysql'}
              ],
            },
            {text: 'doris', link: '/databases/doris'}
          ]
        }
      ],
      '/python/': [
        {
          text: 'python',
          items: [
            {text: '安装python', link: '/python/install'}
          ]
        },
        {
          text: 'django',
          collapsed: false,
          items: [
            {text: 'orm基础操作', link: '/python/django/orm'},
            {text: '序列化器', link: '/python/django/serializer'}
          ]
        },
      ],
      '/system/': [
        {
          text: 'ssl证书',
          collapsed: false,
          items: [
            {text: '使用acme申请证书', link: '/system/ssl-certificate'},
            {text: '信任自签名证书', link: '/system/trust-ssl'}
          ]
        },

      ]
    },

    // socialLinks: [
      // {icon: 'github', link: 'https://github.com/yongravell/yongravell.github.io'}
    // ]
  }
})
