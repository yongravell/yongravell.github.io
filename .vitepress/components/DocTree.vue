<script setup>
defineProps({
  items: {
    type: Array,
    required: true
  }
})
</script>

<template>
  <ul class="doc-tree">
    <li v-for="(item, index) in items" :key="index">
      <a v-if="item.link" :href="item.link" class="link-item">
        {{ item.text }}
      </a>
      <span v-else class="group-title">
        {{ item.text }}
      </span>
      <DocTree
          v-if="item.items"
          :items="item.items"
          class="nested"
      />
    </li>
  </ul>
</template>

<style scoped>
.doc-tree {
  list-style: none;
  padding-left: 1rem;
}

.link-item {
  color: var(--vp-c-brand);
  transition: color 0.25s;
}

.link-item:hover {
  color: var(--vp-c-brand-dark);
}

.group-title {
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin: 12px 0;
  display: block;
}

.nested {
  border-left: 1px solid var(--vp-c-divider);
  margin: 4px 0;
}
</style>