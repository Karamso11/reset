// All of Karam's plan lives in this file.
// To change the plan, edit the text here — the website reads everything from it.

export const PLAN_START = '2026-10-26'; // Monday of week 1
export const WEEKS = 13;
export const RACE = { name: 'Burj2Burj Half Marathon', date: '2027-01-24', start: '06:30',
  note: 'Cut-offs reported for the race: about 3 hours overall and the Al Wasl point (around km 10) by 07:40. Confirm both in the official race-instructions email.' };

export const GOALS = [
  'Weight back to 91–93 kg by May 2027 (about 0.6–0.7 kg a week)',
  'High, steady energy through the workday',
  'Finish Burj2Burj on 24 January 2027',
  'Back on Street Parking WODs, built up safely',
];

// ---------- Mornings: walk-run toward Burj2Burj ----------
// easy = Mon, Wed, Fri · intervals = Tue, Thu · sat = Saturday before work · long = Sunday
export const RUN_WEEKS = {
  1:  { focus: 'Get out the door', easy: 'Brisk walk, 20–30 min', intervals: 'Brisk walk, 30 min', sat: 'Walk, 40 min', long: 'Walk, 45–60 min' },
  2:  { focus: 'First jogs', easy: 'Easy walk, 30 min', intervals: '5 min walk, then 6 × (1 min jog + 3 min walk)', sat: 'Walk, 45 min', long: '60 min walk with 6 × 1 min jog spread through it' },
  3:  { focus: 'More jog, same effort', easy: 'Easy walk, 30 min', intervals: '5 min walk, then 8 × (1 min jog + 2 min walk)', sat: '45 min walk with 8 × 1 min jog', long: '≈7 km walk-run: 1 min jog / 3 min walk' },
  4:  { focus: 'Two-minute jogs', easy: 'Easy walk, 30 min', intervals: '5 min walk, then 6 × (2 min jog + 2 min walk)', sat: '45 min walk-run: 1 min jog / 2 min walk', long: '8 km walk-run: 1 min jog / 2 min walk' },
  5:  { focus: 'Building the base', easy: 'Easy walk, 30 min', intervals: '5 min walk, then 6 × (3 min jog + 2 min walk)', sat: '5 km walk-run: 2 min jog / 2 min walk', long: '9 km walk-run: 2 min jog / 2 min walk' },
  6:  { focus: 'Building the base', easy: 'Easy walk, 30–35 min', intervals: '5 min walk, then 5 × (4 min jog + 2 min walk)', sat: '5–6 km walk-run: 3 min jog / 2 min walk', long: '10 km walk-run: 3 min jog / 2 min walk' },
  7:  { focus: 'Double digits', easy: 'Easy walk, 35 min', intervals: '5 min walk, then 5 × (5 min jog + 2 min walk)', sat: '6 km walk-run: 3 min jog / 1 min walk', long: '12 km walk-run: 3 min jog / 1 min walk' },
  8:  { focus: 'Easy week — recover', easy: 'Easy walk, 30 min', intervals: '5 min walk, then 5 × (3 min jog + 2 min walk)', sat: '5 km easy walk-run', long: '9 km easy walk-run: 3 min jog / 1 min walk' },
  9:  { focus: 'Longer runs', easy: 'Easy walk, 35 min', intervals: '5 min walk, then 5 × (6 min jog + 1 min walk)', sat: '6 km walk-run: 4 min jog / 1 min walk', long: '14 km walk-run: 4 min jog / 1 min walk' },
  10: { focus: 'Longer runs', easy: 'Easy walk, 35 min', intervals: '5 min walk, then 4 × (8 min jog + 1 min walk)', sat: '7 km walk-run: 4 min jog / 1 min walk', long: '15 km walk-run: 4 min jog / 1 min walk' },
  11: { focus: 'Race rhythm', easy: 'Easy walk, 35 min', intervals: '5 min walk, then 3 × (10 min jog + 1 min walk)', sat: '7 km walk-run: 5 min jog / 1 min walk', long: '17 km at race rhythm (5 jog / 1 walk). Same breakfast, shoes and kit you will race in.' },
  12: { focus: 'Taper — trust the work', easy: 'Easy walk, 30 min', intervals: '5 min walk, then 3 × (8 min jog + 1 min walk)', sat: '5 km easy', long: '12 km walk-run: 5 min jog / 1 min walk' },
  13: { focus: 'Race week', easy: 'Easy walk, 20–30 min', intervals: '20 min easy, with 4 × (3 min jog + 1 min walk)', sat: '15 min easy walk, lay out race kit', long: 'RACE DAY — Burj2Burj. Start slower than feels right. 5 jog / 1 walk from the gun.' },
};

export const RUN_RULES = [
  'Jog pace = you could still talk in short sentences. If you can\'t, slow down or walk.',
  'Walking is part of the plan, not failure. Walk-run is how you finish strong at 110 kg.',
  'Knee or shin pain that changes how you move: stop jogging, walk home, and take the next day as an easy walk.',
  'Shoes: proper running shoes, not gym trainers. Replace around 600–800 km.',
  'Drink water before you leave and after. From week 7, carry water on the Sunday long session.',
];

// ---------- Evenings: home gym ----------
// Each session has a full version and a 10-minute minimum version for bad nights.
export const SESSIONS = {
  P1a: {
    name: 'Show up', time: '15 min',
    full: [
      'Row 5 min easy (Concept 2, conversational pace)',
      '3 rounds, rest as needed:',
      '• 5 push-ups — hands on the bench',
      '• 8 dumbbell rows each arm — 10 kg, one hand on the bench',
      '• 8 squats to the bench — hold a 10 kg dumbbell at your chest',
      '• 15 sec hang from the pull-up bar',
      'Stop there, even if you could do more.',
    ],
    minimum: ['Row 5 min easy', '1 round of the circuit'],
  },
  P1b: {
    name: 'Show up', time: '18 min',
    full: [
      'Row 5 min easy',
      '4 rounds, rest as needed:',
      '• 6 push-ups — hands on the bench',
      '• 8 dumbbell rows each arm — 12 kg',
      '• 10 squats to the bench — 10–12 kg dumbbell at your chest',
      '• 20 sec hang from the pull-up bar',
    ],
    minimum: ['Row 5 min easy', '1 round of the circuit'],
  },
  P2A: {
    name: 'Rebuild — A', time: '30 min',
    full: [
      'Row 5 min easy',
      'Goblet squat to the bench — 3 × 10 (12 kg)',
      'Dumbbell bench press — 3 × 10 (10–12 kg each)',
      'Chest-supported dumbbell row (bench on incline) — 3 × 10',
      'Plank — 3 × 20–30 sec',
      'Finish: row 5 × (1 min steady + 1 min easy)',
    ],
    minimum: ['Row 5 min easy', '1 set each: goblet squat, bench press, row'],
  },
  P2B: {
    name: 'Rebuild — B', time: '30 min',
    full: [
      'Row 5 min easy',
      'Dumbbell Romanian deadlift — 3 × 10 (2 × 12 kg), flat back, soft knees',
      'Split squat — 2 × 8 each leg (bodyweight, then hold 8 kg dumbbells)',
      'Push-ups — 3 × 6–8, hands on the bench (lower the incline as they get easy)',
      'Pull-up bar: 3 × 20 sec hang. From week 5: 3 × 2 slow negatives (jump up, lower in 3 sec)',
      'Side plank — 2 × 20 sec each side',
      'Finish: row 500 m, steady',
    ],
    minimum: ['Row 5 min easy', '1 set each: RDL, split squat, push-ups'],
  },
  P3A: {
    name: 'Build — A', time: '35 min',
    full: [
      'Row 5 min easy, then 10 empty-bar squats',
      'Back squat in the rack — 4 × 6. Start with the 20 kg bar, safety arms set just below the bottom position. Add 2.5–5 kg a week while every rep looks the same.',
      'Dumbbell bench press — 3 × 8 (12 kg each, or the barbell from 30 kg)',
      'Bent-over barbell row — 3 × 8 (start 15 kg bar, add 2.5 kg a week)',
      'Finish: 10 min, every minute: odd minutes 12 cal row, even minutes 10 squats to the bench',
    ],
    minimum: ['Row 5 min easy', '2 sets of squats, 2 sets of rows'],
  },
  P3B: {
    name: 'Build — B', time: '35 min',
    full: [
      'Row 5 min easy',
      'Barbell Romanian deadlift — 3 × 8 (start 30 kg, add 2.5–5 kg a week)',
      'Reverse lunge — 3 × 8 each leg, 10 kg dumbbells',
      'Push-ups — 4 sets, stop 2 reps before failure (floor if you can, bench if not)',
      'Pull-up negatives — 3 × 3, plus one long hang at the end',
      'Finish: 4 rounds — 250 m row, 8 dumbbell deadlifts (12 kg), 6 push-ups',
    ],
    minimum: ['Row 5 min easy', '2 sets of RDL, 2 sets of push-ups'],
  },
  P3D: {
    name: 'Easy week', time: '25 min',
    full: [
      'Same exercises as Build A/B, 2 sets only, weights you can lift for 4 more reps than asked.',
      'Skip the finisher. Walk 10 min after instead.',
    ],
    minimum: ['Row 5 min easy', 'Hang from the bar 3 × 20 sec'],
  },
  SP: {
    name: 'Street Parking (scaled)', time: '≤ 35 min',
    full: [
      'Do today\'s Street Parking workout in its most scaled version.',
      'Cap it at 30 minutes. Stop when the clock stops, wherever you are.',
      'Any jumping (box jumps, burpee jumps, double-unders) → swap for rowing calories.',
      'Heavy overhead lifts (push press, thrusters, snatch) → only after the doctor clears the neck. Until then swap for goblet squats or dumbbell bench press.',
      'Friday WOD heavy on legs? Do Build A instead — Sunday\'s long session comes first.',
    ],
    minimum: ['Row 5 min easy', 'The first 5 minutes of the WOD, then stop'],
  },
  REST: { name: 'Rest', time: '—', full: ['No session tonight.'], minimum: ['10 min stretch or a slow walk with the family, if you want.'] },
};

// Which session on which evening, per week. Keys: mon, wed, fri.
export function eveningSession(week, day) {
  const map = (a, b, c) => ({ mon: a, wed: b, fri: c });
  let plan;
  if (week <= 1) plan = map('P1a', 'P1a', 'P1a');
  else if (week === 2) plan = map('P1b', 'P1b', 'P1b');
  else if (week <= 6) plan = week % 2 ? map('P2A', 'P2B', 'P2A') : map('P2B', 'P2A', 'P2B');
  else if (week === 8) plan = map('P3D', 'P3D', 'REST');
  else if (week <= 10) plan = week % 2 ? map('P3A', 'P3B', 'P3A') : map('P3B', 'P3A', 'P3B');
  else if (week === 11) plan = map('SP', 'SP', 'SP');
  else if (week === 12) plan = map('SP', 'P3D', 'REST');
  else plan = map('P3D', 'REST', 'REST');
  return plan[day] || 'REST';
}

export const PHASES = [
  { weeks: '1–2', name: 'Show up', text: 'Tiny sessions. The only job is the habit. No deadlifts, no barbell, nothing overhead.' },
  { weeks: '3–6', name: 'Rebuild', text: 'Dumbbells and bodyweight, two sessions (A and B) alternating. Add weight only when every set feels easy.' },
  { weeks: '7–10', name: 'Build', text: 'Barbell comes in: squat in the rack, Romanian deadlift, rows. Short finishers on the rower. Week 8 is an easy week.' },
  { weeks: '11–13', name: 'Street Parking, scaled', text: 'Daily WOD on Mon/Wed/Fri, capped at 30 min, scaled, no jumping. Fewer sessions in the race taper.' },
];

export const TRAINING_RULES = [
  'Mon, Wed, Fri evenings. Tue and Thu evenings are free — 10 min stretching if you feel like it.',
  'CEO call in the middle? Pause, take it, finish after. A paused session still counts.',
  'Bad night? Do the 10-minute minimum. A minimum is a done session, never a skipped one.',
  'Never miss twice. Missed one? The next one happens, even if it\'s the minimum.',
  'Every set ends with 2–3 reps still in the tank. Nothing to failure for the first 10 weeks.',
  'Neck: no heavy overhead pressing until a doctor has looked at the disc.',
];

// ---------- Food ----------
export const FOOD_DAY = [
  { time: '06:00', what: 'Black coffee. Nothing else needed.' },
  { time: '12:00', what: 'Lunch box from the office fridge: 200 g cooked chicken or beef, 1 cup cooked rice / freekeh / potato, vegetables, sauce. Heat and eat at the desk or away from it — but eat it.' },
  { time: '16:00', what: 'Snack: 200 g Greek yogurt or cottage cheese + one fruit. Or 2 boiled eggs + fruit.' },
  { time: '19:30', what: 'Dinner box, heated the moment you walk in — before anyone opens the delivery app. 200 g protein, vegetables, half an avocado or a small carb.' },
  { time: 'Late', what: 'Still hungry? Cottage cheese or Greek yogurt. That\'s the only late-night food.' },
];

export const FOOD_RULES = [
  'Eating window is roughly 12:00–20:00. Hungry before noon? Have the yogurt. No guilt, no failed fast.',
  'Sun–Fri your food comes from the boxes. No apps for your meals.',
  'One planned family order night a week (default: Saturday). Order normally, eat until satisfied, back to the boxes next meal.',
  'Teammate brings food? A small taste is fine. Your lunch is in the fridge.',
  'Water: 3 litres a day. Keep a 1.5 L bottle on the desk and finish it twice.',
  'Coffee stays black. Sugary drinks and juices are out.',
];

export const PREP = {
  when: 'Sunday afternoon, after the long walk-run. About 2–3 hours.',
  makes: '6 lunches + 6 dinners (Mon–Sat).',
  safety: 'Cooked meat keeps 3–4 days in the fridge. Put Mon–Wed boxes in the fridge and Thu–Sat boxes in the freezer. Move the next day\'s boxes from freezer to fridge every night.',
  shopping: [
    'Chicken breast — 1.8 kg raw',
    'Lean beef (steak or 5% mince) — 1.5 kg raw',
    'Rice and/or freekeh — 600 g dry',
    'Potatoes — 1.5 kg',
    'Chickpeas — 2 tins',
    'Vegetables for roasting: eggplant, zucchini, peppers, green beans, broccoli — about 2.5 kg',
    'Green peas (frozen) — 1 bag',
    'Avocados — 4',
    'Greek yogurt — 2 kg tub (or 6–7 pots)',
    'Cottage cheese — 2 tubs',
    'Eggs — 12',
    'Fruit for 6 snacks',
    'Olive oil, lemons, garlic, spices (seven spice, cumin, paprika, za\'atar), tahini, hot sauce',
    '12 meal-prep boxes if you don\'t have them',
  ],
  steps: [
    'Rice / freekeh on the stove first.',
    'Potatoes and vegetables into the oven: cubed, olive oil, salt, spices, 200 °C for 35–40 min.',
    'Chicken: marinate (olive oil, lemon, garlic, seven spice), grill or oven 200 °C ~20 min until cooked through.',
    'Beef: steaks seared and sliced, or mince browned with cumin, paprika and chickpeas.',
    'Weigh 200 g cooked protein per box. Add carbs and vegetables. Label the day on each lid.',
    'Make a tahini-lemon or yogurt-garlic sauce in small pots. Sauces stop boredom.',
  ],
  rotation: [
    'Week A: shawarma-spiced chicken + freekeh · beef kofta mince with chickpeas + potatoes',
    'Week B: lemon-garlic chicken + rice · sliced steak + roasted potatoes and green beans',
    'Week C: paprika chicken + rice and peas · beef with eggplant and tomato (msaqa\'a style)',
  ],
  backup: 'Sunday fell apart? Order a weekly meal plan (Kcal or similar) for that week, or buy rotisserie chicken + ready rice + bagged salad for the first two days and prep Tuesday night.',
};

export const ORDER_NIGHT = [
  'Pick the grilled option over fried, every time.',
  'Burger night: single patty, skip the fries or share them, no soft drink.',
  'Pizza night: 2–3 slices with a side salad, not the whole box.',
  'Sandwich place: protein-heavy sandwich or bowl, water instead of juice.',
];

// ---------- Nicotine ----------
export const NICOTINE = [
  { weeks: '1–2', step: 'No cigarettes. IQOS and vape stay for now. Log the counts honestly.' },
  { weeks: '3–6', step: 'No IQOS or vape in the car and none in bed. Coffee in bed stays; the stick waits until after you\'re dressed.' },
  { weeks: '7+', step: 'Cut IQOS by 1–2 sticks every two weeks. Vape is the backup, not a second habit. Talk to a doctor about support to stop fully.' },
];

// ---------- Rules (the one-page sheet) ----------
export const RULES = [
  { title: 'Up at 05:00, out the door', text: 'Shoes by the bed. The walk counts even if it\'s 15 minutes.' },
  { title: 'Food is decided on Sunday', text: 'Lunch and dinner come from the boxes. The app is for the family, not for me.' },
  { title: 'Heat my dinner first', text: 'Box in the microwave the moment I walk in, before anyone orders.' },
  { title: 'Mon, Wed, Fri: train', text: 'Full session or the 10-minute minimum. Pause for calls, then finish.' },
  { title: 'Never miss twice', text: 'One bad day is life. Two in a row is a new habit.' },
  { title: 'Phone out of bed', text: 'Charging outside the bedroom by 22:00. Lights out 22:30.' },
  { title: 'Log it every night', text: 'Sixty seconds. What gets logged gets done.' },
  { title: 'No cigarettes', text: 'Cut the worst one first. The rest comes later.' },
];

export const SURVIVAL = {
  when: 'A family emergency, a crisis at work, travel, illness — any week where the full plan is impossible.',
  keep: [
    'A 20-minute walk every day, any time of day.',
    'Protein at every meal, even if it\'s ordered.',
    'Water: 2–3 litres.',
    'Log every day, even if the log says "survival mode".',
    'In bed by 23:00.',
  ],
  drop: 'Everything else — training sessions, meal prep, nicotine steps. They come back when the week is over.',
  back: 'When it passes, restart at the current week\'s plan with minimum sessions for 3 days. Don\'t "make up" missed sessions.',
};
