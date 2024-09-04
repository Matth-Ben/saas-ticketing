<template>
    <div>
        <button class="flex items-center gap-0.5" @click="isOpen = true">
            <UKbd>{{ metaSymbol }}</UKbd>+<UKbd>K</UKbd>
        </button>
        <NuModal class="search--modal" v-if="isOpen" v-model="isOpen">
            <UCard class="search--card">
                <template #header>
                    <div class="search--input">
                        <div class="flex items-center gap-4">
                            <font-awesome icon="magnifying-glass" />
                            <input type="text" name="q" v-model="q" placeholder="Search..." ref="modalInput">
                        </div>
                        <button @click="isOpen = false"><span>ESC</span></button>
                    </div>
                </template>

                <template #default>
                    <div class="search--autocomplete">
                        <div class="search--elem">
                            <div>Links</div>
                            <ul>
                                <li><a href="#">Docs</a></li>
                                <li><a href="#">Pro</a></li>
                                <li><a href="#">Pricing</a></li>
                                <li><a href="#">Templates</a></li>
                            </ul>
                        </div>
                        <div class="search--elem">
                            <div>Links</div>
                            <ul>
                                <li><a href="#">Docs</a></li>
                                <li><a href="#">Pro</a></li>
                                <li><a href="#">Pricing</a></li>
                                <li><a href="#">Templates</a></li>
                            </ul>
                        </div>
                    </div>
                </template>
            </UCard>
        </NuModal>
    </div>
</template>

<style>
.search {
    &--modal {
        @apply fixed top-0 left-0 w-full h-full flex items-center justify-center bg-dark bg-opacity-75;
        backdrop-filter: blur(1px);
        -webkit-backdrop-filter: blur(1px);
    }

    &--card {
        @apply w-[76.8rem] h-[44.8rem] bg-dark-light rounded-xl;
    }

    &--input {
        @apply flex items-center justify-between px-8 py-4 border-b border-dark;

        input {
            @apply w-full bg-transparent text-light;

            &::placeholder {
                @apply text-light;
            }

            &:focus {
                @apply outline-none;
            }
        }

        button {
            @apply flex items-center justify-center w-12 h-10 bg-grey text-sm text-light p-2 rounded-lg;
        }
    }

    &--autocomplete {
        @apply overflow-auto;

        .search--elem {
            @apply px-8 py-4;

            &:not(:last-child) {
                @apply border-b border-dark;
            }
        }
    }
}
</style>

<script lang="ts" setup>
import { ref, watch } from 'vue'

const q = ref('')
const isOpen = ref(false)
const modalInput = ref(null);
const { metaSymbol } = useShortcuts()

defineShortcuts({
    meta_k: {
        usingInput: true,
        handler: () => {
            isOpen.value = !isOpen.value
        }
    },
    escape: {
        usingInput: true,
        whenever: [isOpen],
        handler: () => { isOpen.value = false }
    }
})

watch(isOpen, (newVal) => {
  if (newVal) {
    // Timeout pour s'assurer que la modal est bien rendue avant de focaliser
    setTimeout(() => {
      modalInput.value?.focus();
    }, 100);
  }
});
</script>