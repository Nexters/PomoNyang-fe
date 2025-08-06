export const QUERY_KEY = {
  // cat
  CATS: ['cat', 'all'],

  // category
  CATEGORIES: ['category', 'all'],

  // stats
  STATS: ['stat', 'all'],

  // user
  ME: ['me'],

  // auth
  MACHINE_ID: ['machineId'],
  AUTH_TOKEN: ['authToken'],
};

export const MUTATION_KEY = {
  // cat
  RENAME_SELECTED_CAT: ['renameSelectedCat'],
  SELECT_CAT: ['selectCat'],

  // category
  UPDATE_CATEGORY: ['updateCategory'],
  CREATE_CATEGORY: ['createCategory'],
  SELECT_CATEGORY: ['selectCategory'],
  DELETE_CATEGORY: ['deleteCategory'],
};

export const LOCAL_STORAGE_KEY = {
  PUSH_FOCUS_ENABLED: 'isPushFocusEnabled',
  ONBOARDING_COMPLETED: 'isOnboardingCompleted',
  GUIDE_SHOWN: 'isGuideShown',
  FOCUSED_TIME: 'focusedTime',
  RESTED_TIME: 'restedTime',
  MODE: 'mode',
  POMODORO_CYCLES: 'pomodoroCycles',
  POMODORO_TIME: 'pomodoroTime',
  POMODORO_CALLED_ONCE_FOR_EXCEED_TIME: 'pomodoroCalledOnceForExceedTime',
};
