<template>
    <div id="search">
        <div id="top-panel">
            <InputText id="search-field" v-model="search_query" placeholder="Search" @keyup.enter="search" autofocus />
            <Button id="search-btn" icon="pi pi-search" title="Search" @click="search" />
            <Button v-show="isMobile" id="search-options-btn" icon="pi pi-sliders-h" title="Search options"
                @click="search_options_mobile_visible = !search_options_mobile_visible" />
        </div>
        <div id="bottom-panel">
            <div id="search-options-panel" :class="{'search-options-panel-mobile': isMobile,
                'search-options-panel-mobile-visible': isMobile && search_options_mobile_visible}">
                <div v-show="isAuthenticated" style="display: flex; padding: 0em 0.2em; margin-bottom: 1em">
                    <label style="display: flex; flex: 1; align-items: center">Only my specs</label>
                    <InputSwitch v-model="showOnlyMySpec" />
                </div>
                <Dropdown v-model="language" :options="languages" title="Language" />
            </div>
            <div v-show="isDesktop || (isMobile && !search_options_mobile_visible)" id="result-panel">
                <div id="list">
                    <SearchResultItem label="lib1" />
                    <SearchResultItem label="lib2" />
                    <SearchResultItem label="lib3" />
                    <SearchResultItem label="lib4" />
                    <SearchResultItem label="lib5" />
                    <SearchResultItem label="lib6" />
                    <SearchResultItem label="lib7" />
                    <SearchResultItem label="lib..." />
                    <SearchResultItem label="libN" />
                </div>
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
            languages: ["Select language", "C", "C++", "C#", "Java", "Python"],

            showOnlyMySpec: false
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
            "isMobile",
            "isAuthenticated"
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

#top-panel {
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

#bottom-panel {
    position: relative;
    display: flex;
    flex: 1;
    margin-top: 0.5em;
    margin-bottom: 0.5em;
    padding: 0.2em 0.2em; /* for shadows */
    overflow: auto;
}

#search-options-panel {
    display: flex;
    flex-flow: column;
    width: 12em;
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

#list {
    display: flex;
    flex-flow: column;
    flex: 1;
    padding: 0em 0.5em;
    overflow: auto;
}
</style>