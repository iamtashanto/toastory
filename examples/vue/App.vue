<script setup lang="ts">
import { GlazeToaster, useToast } from 'glazekit/vue';
import { ui } from 'glazekit';
import 'glazekit/themes/ios-glass.toast.css';
import 'glazekit/themes/ios-glass.dialog.css';

const toast = useToast();

const showToast = () => {
  toast.success('Saved in Vue!', {
    description: 'Reactivity synchronized smoothly.',
  });
};

const openPrompt = async () => {
  const result = await ui.prompt({
    title: 'Rename Project',
    input: 'text',
    inputValue: 'My Glaze App',
    confirmButton: { label: 'Save' },
  });

  if (result.isConfirmed) {
    toast.info(`Renamed to "${result.value}"`);
  }
};
</script>

<template>
  <main style="max-width: 640px; margin: 40px auto; font-family: system-ui, sans-serif">
    <h1>glazekit Vue 3 Example</h1>
    <p>Complete glass toolkit with Vue 3 composables.</p>

    <div style="display: flex; gap: 12px; margin-top: 24px">
      <button type="button" @click="showToast">Show Toast</button>
      <button type="button" @click="openPrompt">Prompt Dialog</button>
    </div>

    <GlazeToaster position="bottom-right" :rich-colors="true" />
  </main>
</template>
