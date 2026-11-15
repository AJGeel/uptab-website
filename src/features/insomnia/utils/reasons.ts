const FIXED = [
  "Replayed an awkward conversation from 2014. In HD.",
  "Wondered if the sheep were unionised, and whether they get breaks.",
  "Remembered a keyboard shortcut I never learned.",
  "Had 47 browser tabs open in my head.",
  "A mosquito was holding a one-bug concert.",
  "Decided 3 a.m. was the perfect time to reorganise my bookmarks.",
  "Could not stop thinking about whether a hot dog is a sandwich.",
  "The fridge hummed in B flat, and I can’t unhear it.",
  "Googled “is it normal to be awake” and found 12 million opinions.",
  "Rehearsed a speech for an award I haven’t won.",
  "The pillow’s cool side ran out.",
  "Remembered I never replied to a message from last March.",
  "Counted sheep. Lost count at 83. Started again. Lost count at 83.",
  "Argued with a stranger in my head and won, narrowly.",
  "Wondered what the weather is doing right now. Checked. Same as before.",
  "Heard a noise. It was me, turning over.",
  "Had a brilliant idea. Forgot it. Now trying to remember it.",
  "Stared at the ceiling until it stared back.",
  "Just one more episode, then sleep. That was four episodes ago.",
  "My brain opened a new tab and I can’t find the close button.",
] as const;

const WORDS = {
  animal: ["a mosquito", "an owl", "a raccoon", "a very confident pigeon", "a neighbour’s cat", "a moth", "a sheep on a break", "a cricket", "a seagull", "a hamster on a wheel", "a squirrel with a deadline", "a bat doing laps", "a goose with opinions", "a very loud frog", "a fly with no sense of direction", "a spider on night shift"],
  sound: ["the fridge", "a distant car alarm", "my own heartbeat", "the radiator", "a dripping tap", "the neighbour’s bass", "a smoke detector chirping", "my phone, face down", "the wind", "a floorboard", "the upstairs footsteps", "a delivery van at the worst hour", "the dishwasher’s final cycle", "a ticking clock", "someone’s distant karaoke", "the ceiling creaking", "a lone motorbike"],
  worry: [
    "whether a hot dog is a sandwich",
    "that email from last March",
    "an awkward conversation from {year}",
    "whether penguins have knees",
    "if I left the oven on (I don’t own an oven)",
    "what the weather is doing right now",
    "how many tabs are too many tabs",
    "whether I’d survive in a nature documentary",
    "a word I can’t remember",
    "if my password is still “password1”",
    "what dogs think about all day",
    "whether the moon is following me",
    "whether I should have said hi back",
    "if cereal counts as soup",
    "how fish know when to stop",
    "whether I’m the main character or an extra",
    "what my houseplants say about me",
    "if the cloud looked like a duck or a rabbit",
    "how many steps I’ll take in my lifetime",
    "if a calendar invite is binding",
    "whether autocorrect is judging me",
  ],
  topic: ["medieval plumbing", "the plot of a film I’ve never seen", "bread", "the origin of the word “moist”", "competitive cheese rolling", "lighthouses", "the Dutch tax system", "dinosaurs with jobs", "a perfect sandwich", "how elevators know", "the history of socks", "parallel parking", "what ducks do in winter", "the economics of vending machines", "a very dramatic spoon", "the smell of rain", "alternative uses for a stapler", "a cheese I once met", "the secret life of printers"],
  snack: ["a bowl of cereal", "cold pizza", "three crackers", "a suspicious yoghurt", "a whole sleeve of biscuits", "toast, twice", "a pickle", "leftover pasta", "a banana with commitment issues", "cold noodles", "a handful of cornflakes", "a cheese cube", "half a croissant"],
  show: ["one more episode", "a documentary about octopuses", "a cooking show about soup", "a video of someone restoring a rusty knife", "a 40-minute video essay about fonts", "a documentary about bridges", "a video on how pencils are made", "a cooking show I’ve already seen", "a podcast about nothing"],
  hour: ["1:12", "2:34", "3:07", "3:33", "3:47", "4:20", "4:44", "5:01", "5:55", "12:58", "1:45", "2:22", "3:15", "4:08", "4:59"],
  year: ["2009", "2011", "2014", "2016", "2018", "2019"],
  number: ["12", "47", "83", "112", "365", "1,024", "9", "23", "200", "57", "1,337", "600"],
  fix: ["rearranged my bookmarks", "alphabetised my spice rack", "renamed every file on my desktop", "drafted a very long reply to nobody", "cleared 900 notifications", "sorted my tabs by vibe", "watered a plant that wasn’t mine", "reorganised my cables", "checked the weather in three cities", "read the terms of a coffee machine", "wrote a to-do list titled “later”"],
};

type Slot = keyof typeof WORDS;

const TEMPLATES = [
  "Heard {sound} at {hour} a.m. and now we’re on a first-name basis.",
  "{animal} was holding a concert. I was not invited, but I heard all of it.",
  "Spent until {hour} a.m. wondering about {worry}.",
  "Got up for {snack}. Came back with a new opinion about {topic}.",
  "Started {show} at midnight. Looked up and it was {hour} a.m.",
  "Googled “is it normal to be awake at {hour}” and read {number} opinions.",
  "At {hour} a.m. I suddenly had thoughts on {topic}. Strong ones.",
  "Counted sheep. Lost count at {number}. Started again.",
  "Blamed {sound} for the first hour and {animal} for the second.",
  "Lay there thinking about {worry}. Then about {worry}. Then about {topic}.",
  "Decided {hour} a.m. was a good time to have {snack}.",
  "Convinced myself I could crack {topic} if I stayed up long enough.",
  "{sound} started at {hour} a.m. I {fix}. It kept going.",
  "Made {snack} at {hour} a.m. and thought about {topic} the whole time.",
  "Was fine until {animal} reminded me of {topic}.",
  "Had a brilliant idea about {topic}. Forgot it by {hour} a.m.",
  "At {hour} a.m. I {fix}. It did not help.",
  "{sound} and {animal} were arguing. I took no side. I was awake for all of it.",
  "Stared at the ceiling until it started to look like {topic}.",
  "Spent {number} minutes composing the perfect comeback for {year}.",
  "Tried to sleep. Then {sound} said no.",
  "Wondered what {animal} knows about {topic}. Probably more than me.",
  "Wasn’t tired, then a thought about {topic} showed up uninvited.",
];

const pick = <T>(items: readonly T[], random: () => number) => items[Math.floor(random() * items.length)];

const fill = (template: string, random: () => number): string =>
  template.replace(/\{(\w+)\}/g, (_, slot: Slot) => fill(pick(WORDS[slot], random), random));

/** A fixed line one time in ten; otherwise an ad-lib with the blanks filled in at random. */
export const pickReason = (random = Math.random) =>
  random() < 0.1 ? pick(FIXED, random) : fill(pick(TEMPLATES, random), random);

export const countSheep = (random = Math.random) => Math.floor(random() * 10_000);
