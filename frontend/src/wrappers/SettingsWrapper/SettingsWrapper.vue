<script setup lang="ts">
import SettingsPanel from '@/components/domain/SettingsPanel/SettingsPanel.vue';
import PageHeader from '@/components/ui/PageHeader/PageHeader.vue';
</script>

<template>
  <div class="space-y-6">
    <PageHeader title="Settings" description="Keep simple application preferences in one place." />
    <SettingsPanel />
  </div>
</template>
