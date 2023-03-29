<template>
    <div id="search">
        <div id="search-panel">
            <InputText id="search-field" v-model="search_query" placeholder="Search" @keyup.enter="search" autofocus />
            <Button id="search-btn" icon="pi pi-search" title="Search" @click="search" />
            <Button v-show="isMobile" id="search-options-btn" icon="pi pi-sliders-h" title="Search options"
                @click="search_options_mobile_visible = !search_options_mobile_visible" />
        </div>
        <div id="result-panel">
            <div id="search-options-panel" :class="{'search-options-panel-mobile': isMobile,
                'search-options-panel-mobile-visible': isMobile && search_options_mobile_visible}">
                <Dropdown v-model="language" :options="languages" title="Language" />
            </div>
            <div v-show="isDesktop || (isMobile && !search_options_mobile_visible)" id="list">
                <SearchResultItem label="lib1" />
                <SearchResultItem label="lib2" />
                <SearchResultItem label="lib3" />
                <SearchResultItem label="lib4" />
                <SearchResultItem label="lib5" />
                <SearchResultItem label="lib..." />
                <SearchResultItem label="libN" />
            </div>
        </div>
    </div>
</template>

<script>
import SearchResultItem from "@/components/Search/SearchResultItem.vue"
import { mapGetters } from "vuex"
export default {
    name: "v-search",
    components: {
        SearchResultItem
    },
    data() {
        return {
            search_query: "",
            search_options_mobile_visible: false,

            language: "Select language",
            languages: ["Select language", "C", "C++", "C#", "Java", "Python"]
        }
    },
    methods: {
        search() {
            console.log("searching...")
        }
    },
    computed: {
        ...mapGetters([
            "isDesktop",
            "isMobile"
        ])
    }
}
</script>

<style scoped>
#search {
    display: flex;
    flex-flow: column;
    flex: 1;
    padding: 1em 0.5em 0em 0.5em;
    overflow: auto;
}

#search-panel {
    display: flex;
}

#search-field {
    display: flex;
    flex: 1;
}

#search-btn {
    margin-left: 0.5em;
}

#search-options-btn {
    margin-left: 0.5em;
}

#result-panel {
    position: relative;
    display: flex;
    flex: 1;
    margin: 1em 0em;
    padding: 0.2em 0.2em;
    overflow: auto;
}

#search-options-panel {
    display: flex;
    flex-flow: column;
    width: 12em;
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

#list {
    display: flex;
    flex-flow: column;
    flex: 1;
    padding: 1em;
    overflow: auto;
}
</style>