export const QUERY_KEY = {
  // cat
  CATS: ['cat', 'all'],

  // category
  CATEGORIES: ['category', 'all'],

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
};

export const LOCAL_STORAGE_KEY = {
  PUSH_FOCUS_ENABLED: 'isPushFocusEnabled',
  ONBOARDING_COMPLETED: 'isOnboardingCompleted',
  GUIDE_SHOWN: 'isGuideShown',
  FOCUSED_TIME: 'focusedTime',
  RESTED_TIME: 'restedTime',
  MODE: 'mode',
};
