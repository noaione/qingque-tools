<template>
  <main class="pt-2 pb-8">
    <QingqueIcon />
    <div class="flex flex-col mt-4 mb-5 items-center">
      <h1 class="text-3xl font-bold">Qingque Tools</h1>
      <p class="text-lg mt-2 text-center">A collection of tools for Honkai: Star Rail</p>
    </div>
    <hr class="border-gray-500 mt-2" />
    <div class="flex flex-row flex-wrap justify-center items-center mt-4 gap-8 mx-2">
      <NavButton
        title="Scoring"
        target="/scores"
        description="A web editor for scoring system used by Qingque Bot"
      />
      <NavButton
        title="Randomizer"
        target="/randomizer"
        description="Gamble your MoC progress with a character randomizer."
      />
      <NavButton title="Messages" target="/messages" description="See/interact with in-game messages" />
    </div>
  </main>
</template>
