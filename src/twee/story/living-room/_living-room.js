window.setup = window.setup || {}; // setup: global object
const party = (window.setup.party = window.setup.party || {}); // setup.party


// wow, the code that controls this part sucks. -->
party.getPartyMessage = () => {
  const state = +story.state.partyFlavorState|0;
  if (state == 0) { // first passage
    return `You head into the living room. It's a high-ceilinged room where dozens of furs of every size and species are busy getting drunk and grooving.\n\nYou decide to join them.`;
  } 
  if (state == 1) { // second passage
    return `You move to the music blaring from the living room speakers.\n\nYou're usually a little uncomfortable in big groups, but right now, you're feeling pretty confident, actually!`;
  }
  return party.getDanceMessage() + "\n\n" + party.getFlavorMessage();
};

party.danceLiterals = [
  `The sound system blares with the shouty vocals and distorted guitar of "groupie gas (ft. some snack idk)" by LOÜD GRÜMBLE.`,
  `A grey wolf with a huge protruding gut accidentally bumps into you. "'Scuse me," she mutters as she walks away.`,
  `You notice a tiny white mouse on the floor, darting anxiously between people's feet. It scampers off toward the snack table and **the punch bowl**.`,
  `There aren't many other prey at this party. You feel a little small by comparison to all the huge anthros here.`,
  `A **big brown <%-R.Basil?"stallion":"mare"%>** in a green jacket seems to take notice of your dancing, and winks at you from across the room. <%-R.Basil?"He":"She"%> looks a little familiar.`,
  `The speakers start playing a techno remix of Marie Predatora's latest rap single: "Belly Drop, Belly Drop (Belly Drop)."`,
  `A heavy-set bear with a selfie stick is recording herself as she shakes her massive hips. You try not to stare, but it's absolutely hypnotic.`,
  `A drunk Labrador begins nuzzling you. "Oh my gooood dudes, this rabbit is soooo soft..." You blush. Surprisingly, his fur is extremely soft as well.`,
  `A lioness whispers to her friend, "Did you know there's a rabbit here?" They snicker. "Woah. Do you think it has a vore fetish?"`,
  `You see a cow boy eagerly following a lioness out of the room. They both seem quite excited.`,
  `There's a slight lull. A slightly chubby owl notices you from across the room and begins licking her beak.`,
  `A **tall black wolf** in a scarf and a flannel shirt brought an acoustic guitar to the party, and is noodling on it with an deeply thoughtful expression.`,
  `A slow-jam by the R&B duo, Thumper & Bang. You consider offering to dance with one of the guys around you, but most are several feet taller than you.`,
  `A green anaconda wags her tail in time with the music, and accidentally trips two people. "Oh, sorry!" she stammers, ",,,Sorry again!"`,
  `Tails wag and paws pump in the air as the subwoofer wubs and dubs the bass-drop of that one dubstep song, yet again. **Is the playlist looping?**`,
];
// Returns a message from the above array, based on story.state.partyDanceState
party.getFlavorMessage = () => {
  // edge case: if we're about to get the "One last punch" message
  if (story.state.punchCount == 4 && !story.state.sawCatTeaser) {
    story.state.sawCatTeaser = true;
    story.state.partyFlavorState--; // go back by 1.
    return "A **pair of black cats** watch in awe as a dog proudly presents his enormous, swollen belly. They toast with their cups of punch.";
  }
  let arr = party.danceLiterals;
  let index = (+story.state.partyFlavorState | 0) - 2;
  return arr[index % arr.length];
};

party.getDanceMessage = () => {
  const isDrunk = story.state.punchCount > 1;
  if (!isDrunk) {
    return (
      // combine one of these...
      either("You dance some more.", "You keep on dancing.") +
      " " + // with one of these.
      either("Why stop now?", "Feels good.", "This is fun!")
    );
  } else {
    return (
      either(
        // combine one of these...
        "You wiggle your hips as you dance.",
        "You try out some new moves.",
        "You shake your tail flamboyantly, to the delight of onlookers."
      ) +
      " " +
      either(
        // with one of these.
        "It's probably the alcohol, but it feels like you're dancing really well.",
        "You're starting to attract some attention.",
        "Anthros around you are looking on with interest.",
        "Someone cheers as they watch you.",
        "One more drink couldn't hurt, right?",
        `You hear someone murmur, "Woah, I'd like a piece of that..."`
      )
    );
  }
};



party.advanceState = () => {
  // const s = story.state;
  story.state.partyFlavorState = (+story.state.partyFlavorState | 0) + 1; // increment
  // The number of times we've looped through this
  story.state.partyFlavorsLooped = Math.floor(
    story.state.partyFlavorState / party.danceLiterals.length
  );

  const text = party.getFlavorMessage()||"";
  // set some flags, in case i want to hook any of these messages into their own routes
  // currently these are used to alter the text of the "dance more" command

  if (text.includes("in a green jacket")) {
    story.state.seenBasil = true;
  }
  if (text.includes("tall black wolf")) {
    story.state.seenByron = true;
  }
  if (text.includes("punch")) {
    story.state.seenPunch = true;
  }
  return text;
};

party.getDanceCommand = () => {
  const text = party.getFlavorMessage()||"";
  if (text.includes("accidentally bumps into you")) return "N-no problem!";
  else if (text.includes("this rabbit is soooo soft")) return "Y-you too?";
  else if (story.state.partyFlavorsLooped > 2) return "Dance, dance, dance.";
  else return "Dance a little more.";
};

party.getPunchCommand = () => {
  const punchCount = +story.state.punchCount|0;
  switch (punchCount + 1) {
    case 1:
      return "Grab some punch.";
    case 2:
      return "Grab some more punch.";
    case 3:
      return "Grab a third punch.";
    case 4:
      return "Grab a fourth punch.";
    case 5:
    default:
      return "Just one more punch...";
  }
};
