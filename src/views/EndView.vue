<template>
  <div class="end">
    <div class="end__background">
      <transition name="slow-fade" appear>
        <img
          class="end__background-image"
          src="@/assets/img/background.jpg"
          alt="background"
        />
      </transition>
    </div>
    <div class="flex-container">
      <div class="column-wrapper">
        <transition name="slow-fade" appear>
          <img class="end__header" :src="header" alt="logo" />
        </transition>
        <transition name="slow-fade" appear>
          <div class="text-wrapper">
            <h1>Glückwunsch</h1>
            <p>zum</p>
            <h1>Bachelor</h1>
          </div>
        </transition>
        <transition name="slow-fade" appear>
          <div class="text-wrapper">
            <p>– Spielende –</p>
          </div>
        </transition>
      </div>
      <div class="role-box">
        <div>
          <img src="../assets/img/roles/designer-role-cap.svg">
        </div>
        <div>
          <img src="../assets/img/roles/hacker-role-cap.svg">
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";

export default defineComponent({
  name: "EndView",
  setup() {
    const header = computed(() => {
      if (matchMedia("(prefers-color-scheme: dark)").matches) {
        return require("@/assets/img/logo_header_dark.png");
      }
      return require("@/assets/img/logo_header.png");
    });

    return { header };
  },
});
</script>

<style lang="scss" scoped>



.end {
    &__background {
        position: relative;
        overflow: hidden;
        height: 100vh;

        &-image {
            width: 100%;
            min-height: 100%;
            object-fit: cover;
            filter: grayscale(20%) brightness(70%);
            opacity: 0.2;

            @include color-scheme(dark) {
                opacity: 0.15;
                filter: grayscale(0%) brightness(90%);
            }
        }
    }

    &__header {
        width: 100%;
        max-width: $width-xl;
        
        @include color-scheme(dark) {
        filter: drop-shadow(1px 1px 10px rgba(215, 208, 213, 0.02));
        }
    }

    .text-wrapper {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    
    h1 {
        color: $color-black;
        margin: 0;

        @include color-scheme(dark) {
            color: $color-white;
        }
    }

    p {
      margin: 0;
    }

    .flex-container {
        position: absolute;
        z-index: 2;
        top: 0;
    }

    .role-box {
      display: flex;
      flex-direction: row;
      width: 75%;
      margin: 0 auto;
      justify-content: space-between;
      position: absolute;
      bottom: 0;

      img {
        height: 100%;
        width: auto;
      }
    }
}

@media (min-width: 1051px){

  .end {
     &__header {
        margin-top: 10%;
     }

    .text-wrapper {
      height: 50vh;
    }

     h1 {
      font-size: 5rem;
    }

    p {
      font-size: 3rem;
    }

    .role-box {
      height: 30vh;
    }

  }
}

@media (max-width: 1050px){

  .end {
     &__header {
        margin-top: 0;
     }

    .text-wrapper {
      height: 15vh;
    }

    h1 {
      font-size: 3rem;
    }

    p {
      font-size: 1.5rem;
    }

    .role-box {
      height: 20vh;
    }

  }
}

</style>
