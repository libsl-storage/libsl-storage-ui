<template>
    <div class="search-result-item" @click="$router.push({path: '/lib'})">
        <div style="display: flex; margin: 0.5em 0em">
            <div style="display: flex; align-items: center;">
                {{ label }}
            </div>
            <div style="margin-left: 0.5em; color: grey">
                {{ path }}
                
            </div>
        </div>
        <div>
            <Tag v-for="item in tags" :key="item.id" class="tag" :value="item.value" />
        </div>
    </div>
</template>

<script>
export default {
    name: "v-search-result-item",
    props: {
        label: String,
        path: String,
        tags: Array
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
    flex-flow: column;
    margin: 0.5em 0em 1.5em 0em;
    padding: 0.5em 1em;
    border-radius: 0.5em;
    background-color: white;
    box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.2);
}

.search-result-item:hover {
    cursor: pointer;
    box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.3);
}

.tag {
    margin-right: 0.5em;
}
</style>