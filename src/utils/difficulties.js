const difficulties = [
    {
      name: 'Easy',
      text: '8 cards',
      cards: 8,
      level: 1,
    },
    {
      name: 'Medium',
      text: '12 cards',
      cards: 12,
      level: 2,
    },
    {
      name: 'Hard',
      text: '16 cards',
      cards: 16,
      level: 3,
    },
    {
      name: 'Extreme',
      text: '20 cards',
      cards: 20,
      level: 4,
    },
    {
      name: 'Impossible',
      text: '24 cards',
      cards: 24,
      level: 5, 
    },
    {
      name: 'Legendary',
      text: '30 cards',
      cards: 30,
      level: 6,
    },
    {
      name: 'Mythical',
      text: '36 cards',
      cards: 36,
      level: 7,
    },
    {
      name: 'Divine',
      text: '42 cards',
      cards: 42,
      level: 8,
    },
    {
      name: 'Godlike',
      text: '50 cards',
      cards: 50,
      level: 9,
    }
];

function getMaxDifficulty() {
  return difficulties[difficulties.length - 1];
}
  
export { difficulties, getMaxDifficulty };
  