// Persistent Achievement API
// Achievements are stored as a JSON array in localStorage.achievements

window.setup = window.setup || {};

setup._achievementsKey = "LoTP_achievements";

setup.getAchievements = () => {
  const key = setup._achievementsKey;
  try {
    const achievements = JSON.parse(localStorage.getItem(key));
    return achievements;
  } catch {
    setup.resetAchievements();
    return [];
  }
}
setup.addAchievement = (name) => {
  const key = setup._achievementsKey;
  let achievements = setup.getAchievements();
  if (!setup.getAchievements().includes(name)) {
    achievements = [...achievements, name]
  }
  localStorage.setItem(key, JSON.stringify(achievements));
}
setup.resetAchievements = () => {
  localStorage.setItem(setup._achievementsKey, JSON.stringify([]))
}