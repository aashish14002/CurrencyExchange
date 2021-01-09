<template>
    <div class="currency-section">
            <h2 
                class="currency-heading" 
                :class="{ 'spacing-left': isDisabledCurrencyValue }" 
            >
                {{heading}}
            </h2>
            <div 
                class="currency-type"
                :class="{ 'spacing-left': isDisabledCurrencyValue }" 
            >
                <div class="currency-type-block">
                    <input 
                        class="currency-type-input cursor-pointer"
                        type="radio"
                        :id="'currency-0'+heading"
                        value="0"
                        checked="checked"
                        v-model="currencyType"
                        @change="onCurrencyTypeChange"
                    >
                    <label 
                        :for="'currency-0'+heading"
                        class="cursor-pointer"
                    >
                        {{currencyTypeLabel0}}
                    </label>
                </div>
                <div class="currency-type-block">
                    <input
                        class="currency-type-input cursor-pointer"
                        type="radio"
                        :id="'currency-1'+heading"
                        value="1"
                        v-model="currencyType"
                        @change="onCurrencyTypeChange"
                    >
                    <label
                        class="cursor-pointer"
                        :for="'currency-1'+heading"
                    >
                        {{currencyTypeLabel1}}
                    </label>
                </div>
            </div>
            <div
                class="currency-option"
                :class="{ 'spacing-left': isDisabledCurrencyValue }" 
            >
                <select 
                    class="currency-select"
                    :id="'currency-name'+heading"
                    @change="onCurrencyNameChange"
                    v-model="currencyName">
                        <option disabled value="">-Select-</option>
                        <option 
                            v-for="option in currencyOptionsToSelect" 
                            :key="option" 
                            :value="option"
                        >
                            {{ option }}
                        </option>
                </select>
                <input 
                    v-if="!isDisabledCurrencyValue"
                    :id="'currency-value'+heading"
                    type="number"
                    class="currency-value"
                    v-model="currencyValue"
                    @change="onCurrencyValueChange"
                >
                <span 
                    v-if="isDisabledCurrencyValue"
                    :id="'currency-value'+heading"
                    class="output currency-value"
                >
                    {{val}}
                </span>
            </div>
        </div>
</template>

<script>

export default {
    name: 'BaseCurrencyInput',
    props:{
        heading: String,
        currencyTypeLabel0: String,
        currencyTypeLabel1: String,
        currencyOptions: Object,
        isDisabledCurrencyValue: Boolean,
        val: Number
    },

    data() {
        return {
            currencyType: 0,
            currencyName: "",
            currencyValue: 0
        }
    },

    computed: {
        currencyOptionsToSelect: function() {
            return this.currencyOptions[this.currencyType];
        }
    },

    watch: {
        currencyType: function( updatedVal ) {
            if ( updatedVal != undefined ) {
                this.currencyName = "";
            }
        }
    },

    methods: {

        onCurrencyTypeChange: function() {
            this.$emit( 'on-currency-input-change', this.currencyType );
        },

        onCurrencyNameChange: function() {
            this.$emit( 'on-currency-name-change', this.currencyName );
        },

        onCurrencyValueChange: function() {
            this.$emit( 'on-currency-value-change', this.currencyValue );
        }

    }

}

</script>

<style scoped lang="scss">

    .currency-section {
        display: flex;
        flex-direction: column;
        padding: 2%;
        flex-basis: 40%;

        .currency-heading {
            padding: 0.5rem;
            color: #808080;
        }
        .currency-type {
            padding: 0.5rem;

            .cursor-pointer {
                cursor: pointer;
            }

            .currency-type-block {
                display: inline-block;
                margin-right: .5rem;
            }
        }

        .currency-option {
            padding: 0.5rem;

            .currency-select {
                height: 20px;
                width: 6.7rem;
                margin-right: 1rem;
                margin-bottom: 1rem;
            }

            .output {
                text-rendering: auto;
                letter-spacing: normal;
                word-spacing: normal;
                text-transform: none;
                text-indent: 0px;
                text-shadow: none;
                display: inline-block;
                text-align: start;
                appearance: textfield;
                margin: 0em;
                padding: 1px 2px;
                border-width: 1px;
                border-style: solid;
                border-color:#808080;
            }

            .currency-value {
                width:  100px;
                font: 14px;
            }
        }

        .spacing-left {
            padding-left: min(40% , calc(100% - 300px));
        }
    }
</style>
