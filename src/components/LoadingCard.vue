<script setup>
import Loading from './LoadingShimmer.vue';
</script>

<template>
    <figure class="card">
        <div class="card-image">
            <Loading />
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

    &-loading-block {
        height: 20px;
    }
}

</style>
