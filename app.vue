<template>
  <div class="page">
    <header>
      <div class="scoreboard">
        <div class="scorecard" :class="[{current: currentTeam == 'a'}]">
          <input class="top" v-model="names.a" @blur="names.a ? null : names.a = 'Team A'">
          <input class="bottom" type="number" v-model="scores.a" @blur="scores.a ? null : scores.a = 0">
        </div>
        <div class="scorecard" :class="[{current: currentTeam == 'b'}]">
          <input class="top" v-model="names.b" @blur="names.b ? null : names.b = 'Team B'">
          <input class="bottom" type="number" v-model="scores.b" @blur="scores.b ? null : scores.b = 0">
        </div>
      </div>
      <!-- <div class="buttons">
        <div class="button" @click="addScore({a: -1})">
          -1
        </div>
        <div class="button" @click="addScore({a: 1})">
          +1
        </div>
        <div class="button" @click="addScore({a: 3})">
          +3
        </div>
      </div>
      <div class="buttons">
        <div class="button" @click="addScore({b: -1})">
          -1
        </div>
        <div class="button" @click="addScore({b: 1})">
          +1
        </div>
        <div class="button" @click="addScore({b: 3})">
          +3
        </div>
      </div> -->
      <div class="flexy">
        <strong>You are on {{currentTeam == 'a' ? names.a : names.b}}</strong>
        <div class="button" @click="currentTeam = currentTeam == 'a' ? 'b' : 'a'">
            Switch team
        </div>
      </div>
    </header>
    <main>
      <div class="word">
        <div>
          For 1 PT
          <h1>
            {{words[currentWord][0]}}
          </h1>
        </div>
        <div class="button" @click="winCard({[currentTeam]: 1})">
          +1 PT to {{currentTeam == 'a' ? names.a : names.b}}
        </div>
      </div>
      <div class="word hard">
        <div>
          For 3 PTS
          <h1>
            {{words[currentWord][1]}}
          </h1>
        </div>
        <div class="button" @click="winCard({[currentTeam]: 3})">
          +3 PTS to {{currentTeam == 'a' ? names.a : names.b}}
        </div>
      </div>
    </main>
    <footer>
      <div class="button" @click="winCard({[currentTeam == 'a' ? 'b' : 'a']: 1})">
        Skip/Biff: 1 PT to {{currentTeam == 'a' ? names.b : names.a}}
      </div>
    </footer>
  </div>
</template>


<script setup>

const wordData = await useFetch('/api/words')
const words = wordData.data.value.sort(() => (Math.random() > .5) ? 1 : -1)

let currentWord = ref(0)

let currentTeam = ref('a')

let scores = ref({
  a: 0,
  b: 0
})

let names = ref({
  a: "Team A",
  b: "Team B"
})

let addScore = (scoreObj)=>{
  scores.value.a += scoreObj.a || 0
  scores.value.b += scoreObj.b || 0
}

let winCard = (scoreObj)=>{
  addScore(scoreObj)
  words.shift()
}

</script>

<style scoped>

h1{
  margin: 0;
  /* font-size: ; */
}

table{
  width: 100%;
}

.flexy{
  display: flex;
  gap: 20px;
  align-items: center;
  justify-content: center;
}

.buttons{
  display: flex;
  gap: 20px;
}

.button{
  box-sizing: border-box;
  padding: 10px 20px;
  border-width: 1px;
  border-style: solid;
  border-radius: 10px;
  text-align: center;
  cursor: pointer;
  display: inline-block;
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
}

.scoreboard{
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.scorecard{
  display: flex;
  flex-direction: column;
  align-items: center;
}

.scorecard.current{
  /* border: 1px solid white; */
}

.scorecard input{
  background: #111;
  border: 0;
  color: white;
  text-align: center;
  width: 100px;
  /* border: 1px solid white; */
  padding: 10px;
  /* border-radius: 10px; */
}

.scorecard input.top{
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  padding-bottom: 5px;
}

.scorecard input.bottom{
  padding-top: 5px;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
}

main{
  box-sizing: border-box;
  /* border: 1px solid grey; */
  max-width: 500px;
  width: 100%;
  flex-grow: 1;
  display: grid;
  grid-template-rows: 1fr 1fr;
  gap: 10px;
  /* padding: 20px; */
  margin: auto;
  /* height: 100%; */
}

.word{
  box-sizing: border-box;
  border: 1px solid hsl(35, 100%, 66%);
  color: hsl(35, 100%, 66%);
  padding: 20px;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.word.hard{
  border: 1px solid hsl(35, 100%, 50%);
  color: hsl(35, 100%, 50%);
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

</style>