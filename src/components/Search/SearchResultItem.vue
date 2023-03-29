<template>
    <div class="search-result-item" @click="$router.push({path: '/lib'})">
        {{ label }}
    </div>
</template>

<script>
export default {
    name: "v-search-result-item",
    props: {
        label: String
    },
    data() {
        return {

        }
    }
}
</script>

<style>
.search-result-item {
    display: flex;
    padding: 1em;
    margin-bottom: 1.5em;
    border-radius: 0.5em;
    background-color: white;
    box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.2);
}

.search-result-item:hover {
    cursor: pointer;
    box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.3);
}
</style>