<script setup lang="ts">
import ScoreBar from "./components/score-bar/ScoreBar.vue";
import RotateDevice from "./components/RotateDevice.vue";
import CurrentMoney from "./components/CurrentMoney.vue";
import PokemonCard from "./components/PokemonCard.vue";
import { GameState } from "./game/GameState";
import { ref, onMounted, onUnmounted, reactive, computed } from "vue";

const width = ref(window.innerWidth);
const orientation = ref(window.screen.orientation?.type || "portrait");

const updateWidth = () => {
  width.value = window.innerWidth;
};
const updateOrientation = () => {
  orientation.value = window.screen.orientation?.type || "portrait";
};

const rotateDevice = computed(() => {
  return orientation.value.includes("portrait") || width.value <= 600;
});

const isMounted = ref(false);

// Initialize GameState as reactive so refs are unwrapped in template
const game = reactive(new GameState());

const enemyImageRef = ref<HTMLElement | null>(null);
const hoveredCardIndex = ref(-1);

// --- Damage Numbers ---
interface DamageNumber {
  id: number;
  value: string;
  x: number;
  y: number;
}
const damageNumbers = ref<DamageNumber[]>([]);

// --- Screen Shake ---
const isShaking = ref(false);

const triggerScreenShake = () => {
  isShaking.value = true;
  setTimeout(() => (isShaking.value = false), 200);
};

const triggerEnemyHit = () => {
  if (!enemyImageRef.value) return;

  // 1. Movement Animation (Existing - Keep composite: 'add' for stacking hits)
  enemyImageRef.value.animate(
    [
      { transform: "translate(0, 0) scale(1, 1)", offset: 0 },
      // Strong Knockback (Fly Up/Back) - No rotation to prevent spin stacking
      { transform: `translate(0, -40px) scale(0.95, 1.05)`, offset: 0.1 },
      // Hover/Hang briefly at peak
      { transform: `translate(0, -35px) scale(0.98, 1.02)`, offset: 0.3 },
      // Slow Return with overshoot
      { transform: "translate(0, 10px) scale(1.02, 0.98)", offset: 0.6 },
      { transform: "translate(0, 0) scale(1, 1)", offset: 1 },
    ],
    {
      duration: 800,
      easing: "cubic-bezier(0.2, 0.8, 0.2, 1)", // Smooth ease out-in
      composite: "add",
    },
  );

  // 2. Flash Animation (New - Visual feedback)
  enemyImageRef.value.animate(
    [
      {
        filter: "brightness(1) sepia(0) hue-rotate(0deg) saturate(1)",
        offset: 0,
      },
      {
        filter: "brightness(2) sepia(1) hue-rotate(-50deg) saturate(5)",
        offset: 0.1,
      }, // Flash Red
      {
        filter: "brightness(1) sepia(0) hue-rotate(0deg) saturate(1)",
        offset: 1,
      },
    ],
    {
      duration: 300,
      easing: "ease-out",
    },
  );

  // 3. Spawn Damage Number
  const rect = enemyImageRef.value.getBoundingClientRect();
  const randomX = (Math.random() - 0.5) * 40;
  const randomY = (Math.random() - 0.5) * 40;

  const newNumber: DamageNumber = {
    id: Date.now() + Math.random(),
    value: "POW!", // Placeholder for now
    x: rect.left + rect.width / 2 + randomX,
    y: rect.top + randomY,
  };

  damageNumbers.value.push(newNumber);
  setTimeout(() => {
    damageNumbers.value = damageNumbers.value.filter(
      (n) => n.id !== newNumber.id,
    );
  }, 1000);

  // 4. Screen Shake (Random chance)
  if (Math.random() > 0.7) {
    triggerScreenShake();
  }
};

const onLeave = (el: Element, done: () => void) => {
  const element = el as HTMLElement;
  const rect = element.getBoundingClientRect();
  const index = parseInt(element.dataset.index || "0");

  let targetX = window.innerWidth / 2;
  let targetY = window.innerHeight * 0.2;

  // Use actual enemy position if available
  if (enemyImageRef.value) {
    const enemyRect = enemyImageRef.value.getBoundingClientRect();
    // Target X: Center of card aligns with center of enemy
    targetX = enemyRect.left + enemyRect.width / 2 - rect.width / 2;

    // Target Y: Top of card aligns with Center of enemy
    // absolute Y position of where we want the card top to be.
    targetY = enemyRect.top + enemyRect.height / 2;
  }

  // Fall destination: Bottom of screen with random spread
  const fallX = targetX + (Math.random() * 400 - 200);
  const fallY = window.innerHeight + 200;

  // Animation Sequence
  const animation = element.animate(
    [
      {
        transform: `translate(0, 0) scale(1) rotate(0deg)`,
        opacity: 1,
        zIndex: 100,
        offset: 0,
        easing: "cubic-bezier(0.25, 1, 0.5, 1)",
      },
      {
        // Impact Point
        transform: `translate(${targetX - rect.left}px, ${
          targetY - rect.top
        }px) scale(0.8) rotate(${Math.random() * 60 - 30}deg)`,
        opacity: 1,
        zIndex: 100,
        offset: 0.3,
        easing: "cubic-bezier(0.4, 0, 1, 1)",
      },
      {
        // Bounce Back/Up (Impact Reaction)
        // Move partially back towards start and up slightly
        transform: `translate(${(targetX - rect.left) * 0.9}px, ${
          targetY - rect.top - 50
        }px) scale(0.7) rotate(${Math.random() * 120 - 60}deg)`,
        opacity: 1,
        zIndex: 100,
        offset: 0.45,
        easing: "ease-out",
      },
      {
        // Fall off screen
        transform: `translate(${fallX - rect.left}px, ${
          fallY - rect.top
        }px) scale(0.4) rotate(${Math.random() * 720 - 360}deg)`,
        opacity: 1,
        zIndex: 100,
        offset: 1,
      },
    ],
    {
      duration: 1500,
      delay: index * 100,
      fill: "forwards",
    },
  );

  const hitTime = index * 100 + 300;
  setTimeout(() => {
    triggerEnemyHit();
  }, hitTime);

  animation.onfinish = () => {
    done();
  };
};

onMounted(() => {
  window.addEventListener("resize", updateWidth);
  window.addEventListener("orientationchange", updateOrientation);
  isMounted.value = true;
});

onUnmounted(() => {
  window.removeEventListener("resize", updateWidth);
  window.removeEventListener("orientationchange", updateOrientation);
});
</script>

<template>
  <div
    v-if="!rotateDevice"
    class="w-screen h-screen bg-gray-900 flex flex-col overflow-hidden font-sans select-none fixed inset-0"
  >
    <!-- Intro Overlay -->
    <div
      v-if="game.state === 'INTRO'"
      class="absolute inset-0 z-50 bg-black flex flex-col items-center justify-center text-white cursor-pointer"
      @click="game.nextIntroMessage()"
    >
      <div class="text-4xl mb-4 animate-pulse">{{ game.introMessage }}</div>
      <div class="absolute bottom-20 text-sm text-gray-500">
        Click to continue
      </div>
    </div>

    <!-- Game Over Overlay -->
    <div
      v-if="game.state === 'GAME_OVER'"
      class="absolute inset-0 z-50 bg-black/90 flex flex-col items-center justify-center text-white"
    >
      <h1 class="text-6xl mb-8 text-red-600 font-bold">GAME OVER</h1>
      <div class="text-2xl mb-8">Score: {{ game.score }}</div>
      <button
        class="px-8 py-4 bg-green-600 text-xl font-bold rounded hover:bg-green-500 transition-colors"
        @click="game.restartGame()"
      >
        Restart Game
      </button>
    </div>

    <!-- Main Game UI -->
    <div class="flex-grow flex relative h-full">
      <!-- ScoreBar (Left) -->
      <!-- We pass the reactive game object. Components need to handle it. -->
      <ScoreBar v-if="isMounted" :is-mounted="isMounted" :game="game" />

      <!-- Game Board (Center) -->
      <div
        class="flex-grow flex flex-col items-center justify-between p-4 bg-[url('/images/pixel_background.jpg')] bg-cover relative border-[20px] border-score-board-background m-2 rounded-lg box-border"
        :class="{ 'animate-shake': isShaking }"
      >
        <!-- Enemy Area -->
        <div v-if="game.enemy" class="flex flex-col items-center mt-4 w-full">
          <div class="relative flex flex-col items-center">
            <img
              ref="enemyImageRef"
              :src="game.enemy.pokemon.image"
              class="w-48 h-48 object-contain drop-shadow-2xl transition-transform duration-100 animate-bounce-slow"
            />

            <!-- Health Bar -->
            <div
              class="w-64 h-6 bg-gray-800 mt-4 rounded-full overflow-hidden border-2 border-gray-600 relative"
            >
              <!-- Red background (Slow transition) - Shows previous health -->
              <div
                class="absolute top-0 left-0 h-full bg-red-600 transition-all duration-1000 ease-out delay-200"
                :style="{
                  width: (game.enemy.hp / game.enemy.maxHp) * 100 + '%',
                }"
              ></div>
              <!-- Green foreground (Fast transition) - Shows current health -->
              <div
                class="absolute top-0 left-0 h-full bg-green-500 transition-all duration-200 ease-out"
                :style="{
                  width: (game.enemy.hp / game.enemy.maxHp) * 100 + '%',
                }"
              ></div>
            </div>
            <div
              class="text-center text-white font-bold text-shadow mt-1 text-xl stroke-black"
            >
              {{ Math.max(0, game.enemy.hp) }} / {{ game.enemy.maxHp }}
            </div>
          </div>
        </div>

        <!-- Controls (Middle) -->
        <div
          class="flex gap-4 absolute top-1/2 transform -translate-y-1/2 right-10 flex-col"
        >
          <button
            class="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors border-2 border-blue-800"
            :disabled="
              game.submitsRemaining <= 0 || game.selectedCards.length === 0
            "
            @click="game.submitHand()"
          >
            Submit Hand
            <div class="text-xs font-normal">
              Remaining: {{ game.submitsRemaining }}
            </div>
          </button>

          <button
            class="px-6 py-3 bg-red-600 text-white font-bold rounded-lg shadow-lg hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors border-2 border-red-800 mt-4"
            :disabled="
              game.discardsRemaining <= 0 || game.selectedCards.length === 0
            "
            @click="game.discardSelected()"
          >
            Discard
            <div class="text-xs font-normal">
              Remaining: {{ game.discardsRemaining }}
            </div>
          </button>

          <!-- Predicted Damage Info -->
          <div
            v-if="game.selectedCards.length > 0"
            class="bg-black/50 p-2 rounded text-white text-sm"
          >
            <div>Mult: x{{ game.currentMultiplier }}</div>
            <div>Dmg: {{ game.currentDamage }}</div>
          </div>
        </div>

        <!-- Hand Area -->
        <div
          class="w-full flex justify-center items-end h-[260px] relative mb-4"
          @mouseleave="hoveredCardIndex = -1"
        >
          <TransitionGroup
            name="hand"
            tag="div"
            class="flex justify-center items-end -space-x-8 px-10 w-full h-full relative"
            @leave="onLeave"
          >
            <div
              v-for="(card, index) in game.hand_cards"
              :key="card.id"
              :data-index="index"
              class="relative transition-all duration-300 origin-bottom ease-out"
              :class="{
                'z-10 -translate-y-10': game.selectedCards.includes(card),
                'z-20': hoveredCardIndex === index,
              }"
              :style="{
                transform:
                  hoveredCardIndex !== -1 && hoveredCardIndex !== index
                    ? `translateX(${index < hoveredCardIndex ? '-30px' : '30px'})`
                    : '',
              }"
              @mouseenter="hoveredCardIndex = index"
            >
              <PokemonCard
                class="w-full h-full"
                :class="{
                  'animate-idle-bounce':
                    !game.selectedCards.includes(card) &&
                    hoveredCardIndex === -1,
                }"
                :style="{ animationDelay: `${index * 0.1}s` }"
                :card="card"
                :selected="game.selectedCards.includes(card)"
                @click="game.toggleSelectCard(card)"
              />
            </div>
          </TransitionGroup>
        </div>
      </div>

      <!-- Current Money (Top Right) -->
      <CurrentMoney
        v-if="isMounted"
        :game="game"
        class="fixed top-4 right-4 z-40"
      />

      <!-- Damage Numbers Overlay -->
      <div class="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        <TransitionGroup name="damage-number">
          <div
            v-for="num in damageNumbers"
            :key="num.id"
            class="absolute text-4xl font-black text-white stroke-black text-shadow-lg"
            :style="{ left: `${num.x}px`, top: `${num.y}px` }"
          >
            {{ num.value }}
          </div>
        </TransitionGroup>
      </div>
    </div>
  </div>
  <div v-else>
    <RotateDevice />
  </div>
</template>

<style scoped>
.text-shadow {
  text-shadow: 2px 2px 0 #000;
}
.animate-bounce-slow {
  animation: bounce 3s infinite;
}
@keyframes bounce {
  0%,
  100% {
    transform: translateY(-5%);
  }
  50% {
    transform: translateY(5%);
  }
}
@keyframes idle-bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}
.animate-idle-bounce {
  animation: idle-bounce 3s infinite ease-in-out;
}

/* Hand Transitions */
.hand-move,
.hand-enter-active,
.hand-leave-active {
  transition: all 0.5s ease;
}

.hand-enter-from,
.hand-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

/* Attack Animation (Leaving cards go up) */
.hand-leave-active {
  position: absolute;
  z-index: 50; /* On top */
  width: 150px; /* Fix width during animation */
  height: 200px;
}

.animate-hit {
  animation: hit 0.5s ease-in-out;
}

@keyframes hit {
  0% {
    filter: brightness(1);
  }
  25% {
    filter: brightness(2) sepia(1) hue-rotate(-50deg) saturate(5);
  }
  100% {
    filter: brightness(1);
  }
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-5px) translateY(2px);
  }
  75% {
    transform: translateX(5px) translateY(-2px);
  }
}

.animate-shake {
  animation: shake 0.2s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
}

.stroke-black {
  -webkit-text-stroke: 2px black;
}

/* Damage Number Transitions */
.damage-number-enter-active {
  transition: all 0.5s ease-out;
}
.damage-number-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.5);
}
.damage-number-leave-active {
  transition: all 0.5s ease-in;
}
.damage-number-leave-to {
  opacity: 0;
  transform: translateY(-50px) scale(1.5);
}
</style>
