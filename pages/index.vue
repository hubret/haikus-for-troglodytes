<script setup>

const {data: deck} = await useFetch('/api/words')

const loading = ref(true)

onMounted(async ()=>{
  deck.value = deck.value.sort(() => (Math.random() > .5) ? 1 : -1)
  loading.value = false
})

let currentTeam = ref('a')

const getCurrentTeam = () => {
  return teams[currentTeam.value]
}

const getOtherTeam = () => {
  return teams[currentTeam.value == 'a' ? 'b' : 'a']
}

const getTeam = (team) => {
  return teams[team]
}

const teams = reactive({
  a: {
    id: "a",
    name: "Team A",
    color: "orange",
    score: 0,
    bank: []
  },
  b: {
    id: "b",
    name: "Team B",
    color: "skyblue",
    score: 0,
    bank: []
  }
})

const winCard = score => {
  locked.value = true
  let cardWon = deck.value.shift()
  getCurrentTeam().bank.push({team: getCurrentTeam().id, card: cardWon, score: score})
  getCurrentTeam().score += score
  animationMode.value = 'win'
  cardsSelected.value = [false, false]
}

const biff = () => {
  locked.value = true
  getOtherTeam().score ++
  getOtherTeam().bank.push({team: getCurrentTeam().id, card: deck.value.shift(), score: 1})
  cardsSelected.value = [false, false]
  animationMode.value = 'skip'
}

const mulligan = () => {
  deck.value.splice((deck.value.length) * Math.random() | 0, 0, deck.value.shift())
}

const view = ref('game')

const switchTeam = () => {
  view.value = 'switchteam'
}

const confirmSwitch = () => {
  currentTeam.value = currentTeam.value == 'a' ? 'b' : 'a'
  view.value = 'game'
  cardsSelected.value = [false, false]
  mulligan()
}

const cardsSelected = ref([false, false])

const toggleCard = n => {
  cardsSelected.value[n] = cardsSelected.value[n] ? false : true
}

const animationMode = ref('win')

const locked = ref(false)

</script>

<template>
  <div class="page" :style="`--team-color: ${getCurrentTeam().color}`" v-if="deck.length && !loading">
    <main v-if="view == 'game'">
      <div class="grid">
        <header>
          <div class="scoreboard">
            <div class="scorecard" :class="[{current: currentTeam == 'a'}]" :style="{color: getTeam('a').color}">
              <input class="top" v-model="getTeam('a').name" @blur="getTeam('a').name ? null : getTeam('a').name = 'Team A'">
              <input class="bottom" type="number" v-model="getTeam('a').score" @blur="getTeam('a').score ? null : getTeam('a').score = 0">
            </div>
            <div class="info">
              <div class="menu">
                <div @click="view = 'scores'">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="8" r="7"></circle>
                    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
                  </svg>
                </div>
                <div>
                  <svg width="24" height="24" viewBox="0 0 24 24">
                    <rect fill="black" stroke="white" stroke-width="2" height="18" rx="3" ry="3" width="12" x="3" y="3" transform="rotate(-10 9 12)" />
                    <rect fill="black" stroke="white" stroke-width="2" height="18" rx="3" ry="3" width="12" x="6" y="3" />
                    <rect fill="black" stroke="white" stroke-width="2" height="18" rx="3" ry="3" width="12" x="9" y="3" transform="rotate(10 9 12)"  />
                  </svg><br>
                  {{ deck.length }}
                </div>
                <div @click="view = 'rules'">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12" y2="8"></line>
                  </svg>
                </div>
              </div>
              <button @click="switchTeam()" :style="{color: getCurrentTeam().color}" class="small">
                  Switch team
              </button>
            </div>
            <div class="scorecard" :class="[{current: currentTeam == 'b'}]" :style="{color: getTeam('b').color}">
              <input class="top" v-model="getTeam('b').name" @blur="getTeam('b').name ? null : getTeam('b').name = 'Team A'">
              <input class="bottom" type="number" v-model="getTeam('b').score" @blur="getTeam('b').score ? null : getTeam('b').score = 0">
            </div>
          </div>
        </header>
        <transition :name="animationMode" mode="out-in" @after-leave="locked = false">
          <div class="word" :key="deck[0][0]" :class="{'selected': cardsSelected[0] || cardsSelected[1]}" @click="toggleCard(0)">
            <div>
              For 1 PT
              <h1>
                {{deck[0][0]}}
              </h1>
            </div>
          </div>
        </transition>
        <transition :name="animationMode" mode="out-in">
          <div class="word hard" :key="deck[0][1]" :class="{'selected': cardsSelected[1]}" @click="toggleCard(1)">
            <div>
              For 3 PTS
              <h1>
                {{deck[0][1]}}
              </h1>
            </div>
          </div>
        </transition>
        <button @click="biff()" :disabled="locked" :style="{color: 'red', borderColor: 'red'}">
          <strong>Skip/Biff</strong><br>
          1 PT to {{getOtherTeam().name}}
        </button>
        <button class="score" :disabled="!(cardsSelected[0] || cardsSelected[1])" @click="winCard(Math.max(+ cardsSelected[0], + cardsSelected[1] * 3))">
          <strong v-if="cardsSelected[0] || cardsSelected[1]">Score</strong>
          <strong v-else>Card unguessed</strong>
          <br>
          <p v-if="cardsSelected[0] || cardsSelected[1]">
            {{ Math.max(+ cardsSelected[0], + cardsSelected[1] * 3) }} PT{{ Math.max(+ cardsSelected[0], + cardsSelected[1] * 3) == 1 ? '' : 'S' }}
          </p>
        </button>
      </div>
    </main>
    <main v-if="view == 'switchteam'">
      <div class="inner">
        <div :style="{color: getOtherTeam().color, borderColor: getOtherTeam().color}">
          <p>
            Switching Teams
          </p>
          <h1>Starting {{ getOtherTeam().name }}'s turn</h1>
        </div>
        <div class="flexy">
          <button @click="view = 'game'">
            Never mind
          </button>
          <button @click="confirmSwitch()" :style="{color: getOtherTeam().color, borderColor: getOtherTeam().color}">
            Start
          </button>
        </div>
      </div>
    </main>
    <main v-if="view == 'scores'" class="scores">
      <div class="close" @click="view = 'game'">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="close-button">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </div>
      <div class="scroll">
        <div class="scoregrid">
          <div class="total" :style="{color: getTeam('a').color}">
            {{ getTeam('a').name }}
            <h1 >
              {{ getTeam('a').score }}
            </h1>
          </div>
          <div class="total" :style="{color: getTeam('b').color}">
            {{ getTeam('b').name }}
            <h1 >
              {{ getTeam('b').score }}
            </h1>
          </div>
          <div class="cardlist">
            <div class="winentry" v-for="win in getTeam('a').bank">
              <div class="tinycard" :style="{color: getTeam(win.team).color, borderColor: getTeam(win.team).color}">
                <div>
                  {{ win.card[0] }}
                </div>
                <div>
                  {{ win.card[1] }}
                </div>
              </div>
              <h2 :style="{color: getTeam('a').color}">
                +{{ win.score }}
              </h2>
            </div>
          </div>
          <div class="cardlist">
            <div class="winentry" v-for="win in getTeam('b').bank">
              <div class="tinycard" :style="{color: getTeam(win.team).color, borderColor: getTeam(win.team).color}">
                <div>
                  {{ win.card[0] }}
                </div>
                <div>
                  {{ win.card[1] }}
                </div>
              </div>
              <h2 :style="{color: getTeam('b').color}">
                +{{ win.score }}
              </h2>
            </div>
          </div>
        </div>
      </div>
    </main>
    <main class="rules" v-if="view == 'rules'">
      <div class="close" @click="view = 'game'">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="close-button">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </div>
      <div class="scroll">
        <h1>
          Haikus for Troglodytes
        </h1>
        <p>
          Game by hubret based on <em>Poetry for Neanderthals</em><br>
          <a href="https://github.com/hubret/haikus-for-troglodytes">source code</a>
        </p>
        <h2>
          Setup
        </h2>
        <ul>
          <li>
            This game is played more fairly if there are an even number of players
          </li>
          <li>
            Roll up a magazine, or grab a clean oven mitt, paper towel roll, pillow, or similar, to <em>Bonk</em> people with
          </li>
          <li>
            Sit in a circle
          </li>
          <li>
            Divide the group into two teams, go around the circle and assign every other person to Team A, and the rest to Team B
          </li>
        </ul>
        <h2>
          Playing
        </h2>
        <ul>
          <li>
            <em>The Trog</em>: enlightened cave dweller explaining concepts to modern day humans
            <ul>
              <li>
                Explain the words on the cards to your team using single syllable words (Talk like man from cave)
              </li>
              <li>
                Once your team guesses the word on the <em>Top Card</em>, you are allowed to use it to explain the <em>Bottom Card</em>
              </li>
              <li>
                You have 60 seconds
              </li>
              <li>
                <em>Biffing It</em>: Using multisyllabic words or saying the words on the card makes you liable to be <em>Bonked</em> by the <em>Clubber</em>. The Trog must skip the current card.
              </li>
            </ul>
          </li>
          <li>
            <em>The Clubber</em>: The person beside The Trog who shall <em>Bonk</em> them if they <em>Biff It</em>
          </li>
          <li>
            <em>The Busybody</em>: The person beside The Trog who tells them when they are out of time.
            <ul>
              <li>
                The Busybody has to notice that time is up, and is not allowed to be notified when time is up.
              </li>
              <li>
                Best done with a small hourglass
              </li>
            </ul>
          </li>
          <li>
            After your turn is over, pass the phone to the Clubber. They become The Next Trog
          </li>
        </ul>
      </div>
    </main>
  </div>
</template>

<style scoped>

.win-enter-active, .win-leave-active, .skip-enter-active, .skip-leave-active {
  transition: all 0.25s ease;
}

.win-enter-from, .skip-enter-from {
  opacity: 0 !important;
  transform: translateX(100%);
}

.win-leave-to {
  opacity: 0 !important;
  transform: translateY(-100%);
}

.skip-leave-to {
  /* opacity: 0 !important; */
  animation: shake 0.5s ease-in-out;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-20px); }
  20%, 40%, 60%, 80% { transform: translateX(20px); }
}

h1{
  margin: 0;
  /* font-size: ; */
}

table{
  width: 100%;
}

.info{
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: stretch;
}

.menu{
  display: flex;
  gap: 10px;
  width: 100%;
  justify-content: space-between;
  padding: 0 10px;
  box-sizing: border-box;
  align-items: center;
}

.buttons{
  display: flex;
  gap: 20px;
}

.flexy{
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  justify-content: center;
}

button{
  all: unset;
  box-sizing: border-box;
  padding: 20px 20px;
  border-width: 3px;
  border-style: solid;
  border-radius: 16px;
  text-align: center;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  /* font-size: 1.4rem; */
}

button.small{
  padding: 6px 20px;
}

button strong, button p{
  display: contents;
}

button.score {
  animation: blink 0.25s infinite;
  color: limegreen;
  border-color: limegreen;
}

@keyframes blink {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

button:disabled{
  animation: none;
  opacity: 0.4;
  border-style: dashed;
  color: white;
  border-color: white;
}

.page{
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px;
  gap: 10px;
  box-sizing: border-box;
}

header{
  box-sizing: border-box;
  /* padding: 10px 20px; */
  max-width: 500px;
  width: 100%;
  margin: auto;
  /* border: 1px solid grey; */
  display: flex;
  flex-direction: column;
  gap: 10px;
  grid-column: span 2;
}

.scoreboard{
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 10px;
}

.scorecard{
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #111;
  border-radius: 16px;
  color: var(--team-color);
}

.scorecard.current{
  background-color: var(--team-color);
  color: black !important;
  /* flex-grow: 1; */
}

.scorecard input{
  background: transparent;
  border: 0;
  color: inherit;
  text-align: center;
  width: 100%;
  box-sizing: border-box;
  font-weight: bold;
  /* border: 1px solid white; */
  padding: 10px;
  /* border-radius: 16px; */
}

.scorecard input.top{
  /* border-top-left-radius: 10px;
  border-top-right-radius: 10px; */
  /* padding-bottom: 5px; */
  border-bottom: 2px dotted black;
}

.scorecard input.bottom{
  /* padding-top: 5px; */
  font-size: 2rem;
  /* border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px; */
}

main{
  box-sizing: border-box;
  max-width: 500px;
  width: 100%;
  height: 100%;
  margin: auto;
  overflow-x: hidden;
}

main > .inner{
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  align-items: stretch;
  justify-content: center;
  gap: 20px;
  text-align: center;
}

.grid{
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto 1fr 1fr auto;
  grid-template-areas: 
  "score score"
  "c1 c1"
  "c2 c2"
  "c3 c4";
  /* grid-template-rows: 1fr 1fr; */
  gap: 10px;
}

.word{
  grid-column: span 2;
  opacity: 0.5;
  /* min-height: 25vh; */
  box-sizing: border-box;
  /*border: 1px solid hsl(35, 100%, 66%);
  color: hsl(35, 100%, 66%);*/
  padding: 20px;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border: 3px solid var(--team-color);
  color: var(--team-color);
}

.word.selected{
  background: url('/checkmark.svg') no-repeat center / 110% 110%, linear-gradient(to right, var(--team-color), var(--team-color));
  color: black;
}

.word.hard{
  opacity: 1;
  /*border: 1px solid hsl(35, 100%, 50%);
  color: hsl(35, 100%, 50%);*/
}

footer{
  box-sizing: border-box;
  /* padding: 20px; */
  max-width: 500px;
  width: 100%;
  margin: auto;
  /* border: 1px solid grey; */
  display: flex;
  flex-direction: column;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  /* display: none; <- Crashes Chrome on hover */
  -webkit-appearance: none;
  margin: 0; /* <-- Apparently some margin are still there even though it's hidden */
}

input[type=number] {
  -moz-appearance:textfield; /* Firefox */
}


.scores{
  overflow: hidden;
}

.close{
  display: inline-block;
  padding: 10px;
  position: fixed;
  background-color: black;
}

.scroll{
  height: 100%;
  overflow: scroll;
  padding-top: 50px;
  box-sizing: border-box;
}

.scoregrid{
  display: grid;
  grid-template-columns: 1fr 1fr;
  justify-items: center;
}

.total{
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 20px;

}

.cardlist{
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.winentry{
  display: flex;
  align-items: center;
  gap: 20px;
}

.tinycard{
  border-radius: 16px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  /* align-items: center; */
  border-style: solid;
  border-width: 3px;
}


.rules{
  line-height: 1.4;
}

li{
  padding: 6px 0;
}

li em{
  color: orange;
}

li ul{
  padding-top: 6px;
}

</style>