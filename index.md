---
layout: home

hero:
  text: 文档地图导航
  tagline: 点击下方节点快速访问

---

<script setup>
import DocTree from './.vitepress/components/DocTree.vue';

const docMap = [
  {
    text: '数据库',
    items: [
      { text: 'mysql基础操作', link: '/databases/mysql' },
    ]
  },
  {
    text: '中间件',
    items: [
      { text: 'openvpn搭建', link: '/middleware/openvpn' },
    ]
  }
]
</script>

<DocTree :items="docMap"></DocTree>