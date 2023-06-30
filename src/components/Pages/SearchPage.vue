<template>
    <div id="search">
        <div id="search-options-panel" :class="{'search-options-panel-mobile': isMobile,
            'search-options-panel-mobile-visible': isMobile && search_options_mobile_visible}">
            <div style="display: flex; flex-flow: column; flex: 1">
                <div v-show="isMobile" style="display: flex; justify-content: end; margin-bottom: 0.5em">
                    <Button icon="pi pi-times" label="Close" text @click="search_options_mobile_visible = false" />
                </div>
                <MultiSelect v-model="selectedFilters" :options="getSearchFilters" optionLabel="title"
                    placeholder="Select filters" display="chip" style="margin-bottom: 1em" />
                <div v-for="item in selectedFilters" :key="item.id" class="filter-item">
                    <span class="p-input-icon-right" style="flex: 1">
                        <i class="pi pi-times" style="cursor: pointer" @click="item.value = ''" />
                        <InputText v-model="item.value" style="flex: 1" :placeholder="item.title" @keydown.enter="search(0)" />
                    </span>
                </div>
            </div>
            <div style="display: flex; flex-flow: column; align-items: center; margin-top: 1.5em">
                <Button label="Apply filters" style="margin-bottom: 1em" @click="search_options_mobile_visible = false; search(0)" />
                <div id="reset-btn" @click="search_options_mobile_visible = false; selectedFilters = []">
                    Reset
                </div>
            </div>
        </div>
        <div v-show="isDesktop || (isMobile && !search_options_mobile_visible)" id="result-panel">
            <div v-show="isMobile" style="display: flex; justify-content: end;">
                <Button icon="pi pi-sliders-h" label="Filters" text @click="search_options_mobile_visible = true" />
            </div>
            <div v-show="getSearchResult.totalPages == 0" style="display: flex; flex: 1; justify-content: center; align-items: center; color: grey">
                Nothing found
            </div>
            <div v-show="getSearchResult.totalPages > 0" style="display: flex; flex: 1; overflow: hidden">
                <div style="flex: 1; position: relative; overflow: auto">
                    <div style="position: absolute; width: 100%">
                        <DataTable :value="this.getSearchResult.content" v-model:selection="selectedSpec" selectionMode="single"
                            showGridlines style="flex: 1">
                            <Column field="name" header="Spec"></Column>
                            <Column field="path" header="Path"></Column>
                            <Column field="libslVersion" header="LibSL"></Column>
                            <Column field="libraryName" header="Name"></Column>
                            <Column field="libraryVersion" header="Version"></Column>
                            <Column field="libraryLanguage" header="Language"></Column>
                            <Column field="libraryURL" header="URL"></Column>
                            <Column field="tags" header="Tags">
                                <template #body="slotProps">
                                    <Tag v-for="tag in slotProps.data.tags" :key="tag.id" class="tag" :value="tag.value" />
                                </template>
                            </Column>
                        </DataTable>
                    </div>
                </div>
            </div>
            <div v-show="getSearchResult.totalPages > 0" style="display: flex; margin-top: 0.5em">
                <Paginator style="flex: 1" v-model:first="paginator" :rows="getSearchResult.size" :totalRecords="getSearchResult.totalElements" />
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex"
export default {
    name: "v-search",
    mounted() {
        this.selectedFilters = this.getSelectedFilters
        this.paginator = this.getPaginator
    },
    data() {
        return {
            search_options_mobile_visible: false,
            selectedFilters: [],
            selectedSpec: null,
            paginator: 0
        }
    },
    methods: {
        ...mapActions([
            "setSelectedFilters",
            "search",
            "setPaginator"
        ])
    },
    computed: {
        ...mapGetters([
            "isDesktop",
            "isMobile",
            "isAuthenticated",
            "getSearchFilters",
            "getSelectedFilters",
            "getSearchResult",
            "getPaginator"
        ])
    },
    watch: {
        selectedFilters(newValue, oldValue) {
            if (newValue.length != oldValue.length) {
                this.setSelectedFilters(this.selectedFilters)
                if (this.selectedFilters.length == 0) this.search(0) // reset filters
            }
        },
        selectedSpec() {
            this.$router.push({'path': '/spec/' + this.selectedSpec.id})
        },
        paginator() {
            this.search(this.paginator / this.getSearchResult.size)
            this.setPaginator(this.paginator)
        }
    }
}
</script>

<style scoped>
#search {
    position: relative;
    display: flex;
    flex: 1;
    padding: 0.5em;
    overflow: auto;
}

#search-options-panel {
    display: flex;
    flex-flow: column;
    width: 16em;
    margin-right: 1em;
    padding: 0.5em;
    border-radius: 0.25em;
    background-color: white;
    box-shadow: 0px 0px 4px 1px rgba(0, 0, 0, 0.1);
    overflow: auto;
}

.search-options-panel-mobile {
    position: absolute;
    left: -120%; /* closed */
    height: 98%;
    width: 100% !important;
    transition-duration: 0.3s;
}

.search-options-panel-mobile-visible {
    left: 0; /* opened */
}

#result-panel {
    display: flex;
    flex-flow: column;
    flex: 1;
}

.filter-item {
    display: flex;
    margin-bottom: 0.5em;
}

#reset-btn {
    color: #E34234;
    cursor: pointer;
}

#reset-btn:hover {
    text-decoration: #E34234 solid underline;
}

#list {
    position: relative
}

.tag {
    margin-right: 0.5em;
}
</style>