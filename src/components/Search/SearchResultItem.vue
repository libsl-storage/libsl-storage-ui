<template>
    <div class="search-result-item" @click="$router.push({path: '/lib'})">
        <div style="margin: 0.5em 0em">
            {{ label }}
        </div>
        <div>
            <Tag class="tag" value="tag1" />
            <Tag class="tag" value="tag2" />
        </div>
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