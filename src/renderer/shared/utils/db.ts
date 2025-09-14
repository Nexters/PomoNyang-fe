import Dexie, { Table } from 'dexie';
import { Pomodoro } from 'shared/type';

import { createErrorResponse } from './error';
import { pick } from './object';

import { Cat } from '@/entities/cat';
import { Category } from '@/entities/category';
import { User } from '@/entities/user';

const USER_ID = 1;
const DEFAULT_CATEGORY_ID = 1;

class LocalDB extends Dexie {
  user!: Table<User>;
  cat!: Table<Cat>;
  category!: Table<Category>;
  pomodoro!: Table<Pomodoro>;

  constructor() {
    super('localDB');
    this.version(1).stores({
      user: 'registeredDeviceNo, isPushEnabled, cat, createdAt',
      cat: 'no, type, name',
      category: 'no, title, focusTime, restTime, position, iconType, isSelected',
      pomodoro: 'clientFocusTimeId, categoryNo, focusedTime, restedTime, startedAt, doneAt',
    });
    this.insertDefaultData();
  }

  insertDefaultData = async () => {
    const user = await this.user.get(USER_ID);
    if (user) return;

    await this.user.add({
      registeredDeviceNo: USER_ID,
      isPushEnabled: false,
      cat: null,
      createdAt: new Date().toISOString(),
    });
    await this.cat.bulkAdd([
      {
        no: 1,
        type: 'CHEESE',
        name: '치즈냥',
      },
      {
        no: 2,
        type: 'BLACK',
        name: '까만냥',
      },
      {
        no: 3,
        type: 'THREE_COLOR',
        name: '삼색냥',
      },
    ]);
    await this.category.add({
      no: DEFAULT_CATEGORY_ID,
      title: '기본',
      focusTime: 'PT25M',
      restTime: 'PT10M',
      position: 1,
      iconType: 'CAT',
      isSelected: true,
    });
  };
}

const localDB = new LocalDB();

// user & cat

export const getUser = async () => {
  const user = await localDB.user.get(USER_ID);
  if (!user) throw 'internal error';
  return user;
};

export const getCats = async () => {
  const cats = await localDB.cat.toArray();
  return cats;
};

export const renameCat = async (newName: string) => {
  const user = await getUser();
  if (user.cat) {
    return await localDB.user.update(USER_ID, { cat: { ...user.cat, name: newName } });
  }
};

export const selectCat = async (catNo: Cat['no']) => {
  const cat = await localDB.cat.get(catNo);
  return await localDB.user.update(USER_ID, { cat });
};

// category

export const getCategories = async () => {
  const categories = await localDB.category.toArray();
  return categories;
};

export const getCategory = async (no: Category['no']) => {
  const category = await localDB.category.get(no);
  if (!category) throw 'internal error';
  return category;
};

export const createCategory = async (body: Pick<Category, 'title' | 'iconType'>) => {
  const sameTitleCount = await localDB.category.where('title').equals(body.title).count();
  if (sameTitleCount > 0) {
    throw createErrorResponse('동일한 카테고리 이름이 존재합니다.');
  }

  const count = await localDB.category.count();
  const category: Category = {
    no: Date.now(),
    title: body.title,
    iconType: body.iconType,
    position: count + 1,
    focusTime: 'PT25M',
    restTime: 'PT10M',
    isSelected: false,
  };
  return await localDB.category.add(category);
};

export const updateCategory = async (
  no: Category['no'],
  body: Partial<Pick<Category, 'title' | 'focusTime' | 'restTime' | 'iconType'>>,
) => {
  const changes = pick(body, Boolean);
  return await localDB.category.update(no, changes);
};

export const deleteCategories = async (nos: Category['no'][]) => {
  await localDB.category.bulkDelete(nos);

  // 선택된 게 사라졌다면 기본 카테고리 선택되도록
  const categories = await getCategories();
  if (categories.every((c) => !c.isSelected)) {
    await localDB.category.update(DEFAULT_CATEGORY_ID, { isSelected: true });
  }
};

export const selectCategory = async (selectNo: Category['no']) => {
  // TODO: 데이터 구조를 바꿔서 업데이트 로직 개선
  const categories = await getCategories();
  return await localDB.category.bulkUpdate(
    categories.map((category) => {
      return {
        key: category.no,
        changes: { isSelected: category.no === selectNo },
      };
    }),
  );
};

// pomodoro

export const addPomodoro = async (pomodoro: Pomodoro[]) => {
  return await localDB.pomodoro.bulkAdd(pomodoro);
};

// TODO:
export const getStatsByDate = () => {
  // const getPomodoro = () => {
  //   return localDB.pomodoro.where('focusTime').between()
  // }
};
