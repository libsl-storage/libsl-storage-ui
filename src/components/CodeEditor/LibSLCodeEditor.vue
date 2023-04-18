<template>
    <div id="LibSL-code-editor">
        <div id="toolbar">
            <div style="display: flex; flex: 1">
                <Dropdown v-model="font_size" :options="sizes" title="Font size">
                    <template #value="slotProps">
                        {{ slotProps.value }} pt
                    </template>
                    <template #option="slotProps">
                        {{ slotProps.option }} pt
                    </template>
                </Dropdown>
                <div v-show="readonly" id="read-only-indicator">
                    read-only
                </div>
            </div>
            <div>
                <Button class="p-button-secondary p-button-text" icon="pi pi-copy" title="Copy code"
                    @click="copy_code" />
            </div>
        </div>
        <div id="main">
            <textarea id="row-counter" v-model="row_counter_content" readonly spellcheck="false"
                :class="{'font10': font_size==10, 'font12': font_size==12, 'font14': font_size==14}" />
            <div id="editor">
                <textarea id="code" v-model="code" spellcheck="false" :readonly="readonly"
                    @keydown.tab.prevent="tab_handler" @keydown.enter.prevent="enter_handler"
                    :class="{'font10': font_size==10, 'font12': font_size==12, 'font14': font_size==14}" />
                <pre id="highlighter"
                    :class="{'font10': font_size==10, 'font12': font_size==12, 'font14': font_size==14}" />
            </div>
        </div>
    </div>
</template>

<script>
import wordlist from '@/components/CodeEditor/highlight'
export default {
    props: {
        content: {
            type: String,
            default: ""
        },
        readonly: {
            type: Boolean,
            default: true
        }
    },
    mounted() {
        // sync scroll in textarea, pre and row counter
        let code_el = document.getElementById("code")
        let row_counter_el = document.getElementById("row-counter")
        let highlighter_el = document.getElementById("highlighter")
        code_el.addEventListener("scroll", () => {
            row_counter_el.scrollTop = code_el.scrollTop
            highlighter_el.scrollTop = code_el.scrollTop
            row_counter_el.scrollLeft = code_el.scrollLeft
            highlighter_el.scrollLeft = code_el.scrollLeft
        })

        // load code highlight
        this.key_words = RegExp(`(^|\\s|\\t|\\b)(${wordlist.join("|")})(\\s|\\t|\\b|$)`, "g")

        // show initial content
        this.code = this.content
    },
    updated() {
        if (this.new_cursor_pos != null) {
            let el = document.getElementById("code")
            el.selectionStart = this.new_cursor_pos
            el.selectionEnd = this.new_cursor_pos
            this.new_cursor_pos = null
        }
    },
    data() {
        return {
            font_size: 14,
            sizes: [10, 12, 14],
            row_count: 1,
            row_counter_content: "1",
            code: "",
            new_cursor_pos: null, // set the cursor after pressing Tab or Enter
            key_words: null
        }
    },
    methods: {
        copy_code() {
            try { 
                navigator.clipboard.writeText(this.code)
            } catch (e) { // the old method for some browsers
                let code_el = document.getElementById("code")
                let oldContentEditable = code_el.contentEditable
                let oldReadOnly = code_el.readOnly
                let range = document.createRange()

                code_el.contentEditable = true
                code_el.readOnly = false
                range.selectNodeContents(code_el)

                let s = window.getSelection()
                s.removeAllRanges()
                s.addRange(range)

                code_el.setSelectionRange(0, 999999)

                code_el.contentEditable = oldContentEditable
                code_el.readOnly = oldReadOnly

                document.execCommand('copy')
                s.removeAllRanges()
            }
        },
        tab_handler() {
            let code_el = document.getElementById("code")
            let before_tab = this.code.slice(0, code_el.selectionStart)
            let after_tab = this.code.slice(code_el.selectionEnd, this.code.length)
            this.code = before_tab + "\t" + after_tab
            this.new_cursor_pos = code_el.selectionStart + 1
        },
        enter_handler() {
            let code_el = document.getElementById("code")
            let before_enter = this.code.slice(0, code_el.selectionStart)
            let after_enter = this.code.slice(code_el.selectionEnd, this.code.length)

            let line_start_pos = code_el.selectionStart
            let code_start_pos = line_start_pos
            while (line_start_pos > 0 && this.code[line_start_pos - 1] != "\n") {
                line_start_pos--
                if (this.code[line_start_pos] != " " && this.code[line_start_pos] != "\t")
                    code_start_pos = line_start_pos
            }
            let line_prefix = this.code.slice(line_start_pos, code_start_pos)

            this.code = before_enter + "\n" + line_prefix + after_enter
            if (this.code.at(-1) == "\n") this.code += " " // for <pre />
            this.new_cursor_pos = code_el.selectionStart + 1 + line_prefix.length

            // forced textarea scrolling
            code_el.blur()
            code_el.focus()
        }
    },
    watch: {
        code() { // row counting and code highlighting
            let strings = this.code.split("\n")
            let highlighted_code = ""
            for (let i = 0; i < strings.length; i++) {
                let comments_start_pos = strings.at(i).search(/\/\//g)
                if (comments_start_pos == -1) { // no comments
                    highlighted_code += strings.at(i).replaceAll(this.key_words, "<strong>$1$2$3</strong>")
                } else {
                    highlighted_code +=
                        strings.at(i).slice(0, comments_start_pos).replaceAll(this.key_words, "<strong>$1$2$3</strong>") +
                        "<span style='color:green'>" + 
                        strings.at(i).slice(comments_start_pos, strings.at(i).length) + 
                        "</span>"
                }

                if (i != strings.length - 1) highlighted_code += "\n"
            }
            document.getElementById("highlighter").innerHTML = highlighted_code            

            if (strings.length != this.row_count) {
                let counter = ""
                for (let i = 1; i <= strings.length; i++)
                    counter += i + "\n"
                this.row_count = strings.length
                this.row_counter_content = counter
            }
        }
    }
}
</script>

<style scoped>
#LibSL-code-editor {
    display: flex;
    flex-flow: column;
    flex: 1;
    overflow: hidden;
    border: 1px solid black;
    border-top-left-radius: 0.5em;
    border-top-right-radius: 0.5em;
    background-color: white;
}

#toolbar {
    display: flex;
    align-items: center;
    padding: 0.25em;
    border-bottom: 1px solid black;
}

#read-only-indicator {
    display: flex;
    align-items: center;
    margin-left: 1em;
    font-size: small;
    color: grey;
}

#main {
    display: flex;
    flex: 1;
}

#row-counter {
    display: flex;
    width: 2.5em;
    padding: 0.5em 0.1em 0.5em 0em;
    background-color: WhiteSmoke;
    color: DodgerBlue;
    text-align: right;
    border: 0;
    overflow: hidden;
    resize: none;
    outline: none;
    font-family: monospace;
}

#editor {
    display: flex;
    flex: 1;
    position: relative;
    width: 100%;
    z-index: 0;
}

.font10 {
    font-size: 10pt;
}

.font12 {
    font-size: 12pt;
}

.font14 {
    font-size: 14pt;
}

#code, #highlighter {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    margin: 0em;
    padding: 0.5em 0.25em;
    border: 0;
    height: 100%;
    overflow: auto;
    white-space: pre;
    overflow-wrap: normal;
    text-align: left;
    font-family: monospace;
    tab-size: 2;
}

#code {
    z-index: 2;
    width: 100%;
    resize: none;
    outline: none;
    color: transparent;
    background: transparent;
    caret-color: black;
}

#highlighter {
    z-index: 1;
}
</style>