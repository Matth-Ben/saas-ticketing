<template>
    <div>
        <button class="flex items-center gap-0.5" @click="isOpen = true">
            <UKbd>{{ metaSymbol }}</UKbd>
            +
            <UKbd>K</UKbd>
        </button>
        <NuModal class="custom-modal" v-if="isOpen" v-model="isOpen">
            <template #header>
                <h2>Titre de la Modal</h2>
            </template>
            <template #default>
                <p>Contenu de votre modal.</p>
            </template>
            <template #footer>
                <button @click="isOpen = false">Fermer</button>
            </template>
        </NuModal>
    </div>
</template>

<style>
.custom-modal {
    @apply fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50;
}
</style>

<script lang="ts" setup>
import { ref } from 'vue'

const isOpen = ref(false)
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
</script>