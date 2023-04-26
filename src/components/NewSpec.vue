<template>
    <div id="new-spec">
        <div class="property">
            <InputText v-model="libName" placeholder="Lib name" style="width: 100%" autofocus />
        </div>
        <div class="property">
            <InputText v-model="tags" placeholder="Tags" style="width: 100%" />
        </div>
        <div class="property" style="display: flex; flex-flow: column; flex: 1">
            <div style="display: flex; justify-content: right; margin-bottom: 0.5em">
                <Button label="Browse" icon="pi pi-file" @click="openFileChooser" />
            </div>
            <LibSLCodeEditor :readonly="false"/>
        </div>
        <div style="display: flex; justify-content: right;">
            <Button label="Cancel" icon="pi pi-times" severity="secondary" style="margin-right: 1em"
                @click="cancelDialogVisible = true" />
            <Button label="Save" icon="pi pi-save" />
        </div>
    </div>

    <Dialog v-model:visible="cancelDialogVisible" header="New spec" :modal="true" :draggable="false">
        <div>
            Your changes will be lost. Are you sure you want to continue?
        </div>
        <template #footer>
            <Button label="No" @click="cancelDialogVisible = false" />
            <Button label="Yes"/>
         </template>
      </Dialog>
</template>

<script>
import LibSLCodeEditor from '@/components/CodeEditor/LibSLCodeEditor.vue'
export default {
    name: "v-new-spec",
    components: {
        LibSLCodeEditor
    },
    data() {
        return {
            libName: "",
            tags: "",
            cancelDialogVisible: false
        } 
    },
    methods: {
        openFileChooser() {
            
        }
    }
}
</script>

<style scoped>
#new-spec {
    display: flex;
    flex-flow: column;
    flex: 1;
    margin: 0.5em;
    padding: 0.5em;
    overflow: auto;
}

.property {
    margin-bottom: 1em;
}
</style>