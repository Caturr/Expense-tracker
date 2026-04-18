<template>
  <div class="rounded-lg border border-ink/10 bg-white p-5 shadow-soft">
    <div class="grid gap-4 md:grid-cols-2">
      <label class="block">
        <span class="text-sm font-medium text-ink/70">Currency</span>
        <select class="mt-2 w-full rounded-md border border-ink/15 bg-white px-3 py-2 text-sm">
          <option>IDR</option>
        </select>
      </label>

      <label class="block">
        <span class="text-sm font-medium text-ink/70">Dashboard period</span>
        <select class="mt-2 w-full rounded-md border border-ink/15 bg-white px-3 py-2 text-sm">
          <option>This month</option>
          <option>Last 30 days</option>
        </select>
      </label>
    </div>
  </div>
</template>
