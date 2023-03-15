<template>
    <div id="lib-page">
        <div id="header">
            <div style="display: flex; flex: 1">
                <Button icon="pi pi-chevron-circle-left" title="Back" @click="$router.push({path: '/'})"/>
            </div>
            <div>
                <Button icon="pi pi-download" title="Download" />
            </div>
        </div>
        <div id="main">
            <LibSLCodeEditor :content="code" />
        </div>
    </div>
</template>

<script>
import LibSLCodeEditor from '@/components/LibSLCodeEditor.vue'
export default {
    name: "v-lib-page",
    components: {
        LibSLCodeEditor
    },
    data() {
        return {
            code: "LibSL\n\t\tcode"
        }
    }
}
</script>

<style scoped>
#lib-page {
    display: flex;
    flex: 1;
    flex-flow: column;
    padding: 1em 0.5em;
}

#header {
    display: flex;
    margin-bottom: 1em;
}

#main {
    display: flex;
    flex: 1;
}
</style>