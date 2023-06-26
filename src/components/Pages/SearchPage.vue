<template>
    <div id="search">
        <div id="search-options-panel" :class="{'search-options-panel-mobile': isMobile,
            'search-options-panel-mobile-visible': isMobile && search_options_mobile_visible}">
            <div style="display: flex; flex-flow: column; flex: 1">
                <MultiSelect v-model="selected_filters" :options="filters" optionLabel="title" placeholder="Select filters" display="chip" />
                <div v-for="item in selected_filters" :key="item.id" class="filter-item">
                    <InputText v-model="item.value" style="flex: 1" :placeholder="item.title" @keydown.enter="applyFilters(0)" />
                </div>
            </div>
            <div style="display: flex; justify-content: center; margin-top: 1.5em">
                <Button id="search-options-btn" label="Apply filters" @click="applyFilters(0)" />
            </div>
        </div>
        <div v-show="isDesktop || (isMobile && !search_options_mobile_visible)" id="result-panel">
            <div v-show="isMobile" style="display: flex; justify-content: end;">
                <Button id="search-options-btn" icon="pi pi-sliders-h" label="Filters" link
                    @click="search_options_mobile_visible = !search_options_mobile_visible" />
            </div>
            <div v-show="searchResult.length == 0" style="display: flex; flex: 1; justify-content: center; align-items: center; color: grey">
                Use filters to search for specifications
            </div>
            <div v-show="searchResult.length != 0" id="list">
                <SearchResultItem v-for="item in searchResult.content" :key="item.id"
                    :label="item.name" :path="item.path" :tags="item.tags"
                    @click="$router.push({'path': '/spec/' + item.id})" />
            </div>
            <div v-show="searchResult.totalPages > 1" id="page-switch">
                <Paginator v-model:first="paginator" :rows="searchResult.size" :totalRecords="searchResult.totalElements" />
            </div>
        </div>
    </div>
</template>

<script>
import SearchResultItem from "@/components/SearchResultItem.vue"
import Paginator from "primevue/paginator"
import { mapGetters, mapActions } from "vuex"
export default {
    name: "v-search",
    components: {
        SearchResultItem,
        Paginator
    },
    mounted() {
        this.filters = this.getFilters
        if (this.filters.length == 0) this.fetchFilters()
        this.selected_filters = this.getSelectedFilters
        this.searchResult = this.getSearchResult
    },
    data() {
        return {
            search_options_mobile_visible: false,
            filters: [],
            selected_filters: [],
            searchResult: [],
            paginator: 0
        }
    },
    methods: {
        async fetchFilters() {
            let r = await this.makeRequest("/specification/page/filters", "GET")
            let data = await r.json()
            this.filters = []
            for (const item in data.keys) {
                this.filters.push({"title": data.keys[item].title, "key": data.keys[item].key, "value": ""})
            }
            this.setFilters(this.filters)
        },
        async applyFilters(page_number) {
            let filter_list = []
            this.selected_filters.forEach((item) => {
                filter_list.push({"key": item.key, "value": item.value})
            })
            let r = await this.makeRequest("/specification/page", "POST", {
                "page": page_number,
                "filters": filter_list
            })
            this.searchResult = await r.json()
            this.setSearchResult(this.searchResult)

            if (this.isMobile) {
                this.search_options_mobile_visible = !this.search_options_mobile_visible
            }
        },
        ...mapActions([
            "setFilters",
            "setSelectedFilters",
            "setSearchResult"
        ])
    },
    computed: {
        ...mapGetters([
            "isDesktop",
            "isMobile",
            "isAuthenticated",
            "getFilters",
            "getSelectedFilters",
            "getSearchResult"
        ])
    },
    watch: {
        selected_filters() {
            this.setSelectedFilters(this.selected_filters)
        },
        paginator() {
            this.applyFilters(this.paginator / this.searchResult.size)
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
    margin-top: 0.5em;
    margin-right: 1em;
    padding: 1em 0.5em;
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
    margin-top: 1em;
}

#list {
    display: flex;
    flex-flow: column;
    flex: 1;
    padding: 0em 0.5em;
    overflow: auto;
}

#page-switch {
    display: flex;
    justify-content: center;
    margin-top: 1em;
}
</style>