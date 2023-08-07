<script setup>
import Loading from './LoadingShimmer.vue';
</script>

<template>
    <figure class="card">
        <div class="card-image">
            <Loading class="card-image-loading"/>
        </div>
        <figcaption class="card-info">
            <Loading class="card-loading-block"/>
            <Loading class="card-loading-block"/>
            <Loading class="card-loading-block"/>
        </figcaption>
    </figure>
</template>

<style lang="scss" scoped>
@import '../style/carditem.scss';
.card {
    height: 200px;

    &-image {
        margin-bottom: 6px;

        &-loading {
            border-radius: 8px;
        }
    }

    &-loading-block {
        width: 70%;
        height: 18px;
        margin-bottom: 4px;
    }
}

</style>
