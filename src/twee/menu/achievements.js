// Persistent Achievement API
// Achievements are stored as a JSON array in localStorage.achievements

window.setup = window.setup || {};

const key = story.name+"_achievements"; // <- the attribute in localStorage where

setup.getAchievements = () => {
  const achievements = JSON.parse(localStorage.getItem(key));
  if (Array.isArray(achievements)) {
    return achievements;
  } else {
    setup.resetAchievements();
    return [];
  }
}
setup.addAchievement = (name) => {
  let achievements = setup.getAchievements();
  if (!achievements.includes(name)) {
    achievements = [...achievements, name]
  }
  localStorage.setItem(key, JSON.stringify(achievements));
}
setup.resetAchievements = () => {
  localStorage.setItem(key, JSON.stringify([]))
}