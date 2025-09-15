import { format } from 'date-fns';
import Dexie, { Table } from 'dexie';
import { Pomodoro } from 'shared/type';

import { createErrorResponse } from './error';
import { isoDurationToMs, msToIsoDuration } from './iso-duration';
import { pick } from './object';

import { Cat } from '@/entities/cat';
import { Category } from '@/entities/category';
import { Stats } from '@/entities/stats';
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
    this.version(2).stores({
      user: 'registeredDeviceNo',
      cat: 'no',
      category: 'no, title, isSelected',
      pomodoro: 'clientFocusTimeId, categoryNo, startedAt',
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

const formatDate = (date: Date) => format(date, 'yyyy-MM-dd');

export const getStatsByDate = async (targetDate: Date) => {
  // 1. 통계에 필요한 날짜 범위 계산
  // - targetDate의 시작과 끝
  const startOfDay = new Date(targetDate);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(targetDate);
  endOfDay.setHours(23, 59, 59, 999);

  // - 주간 트렌드 및 랭킹을 위한 최근 7일 범위
  const weekStartDate = new Date(startOfDay);
  weekStartDate.setDate(weekStartDate.getDate() - 6); // 오늘 포함 7일

  // 2. DB에서 필요한 데이터 한번에 가져오기
  // - 최근 7일간의 모든 뽀모도로 기록
  const weeklyPomodoros = await localDB.pomodoro
    .where('startedAt')
    .between(weekStartDate.toISOString(), endOfDay.toISOString())
    .toArray();

  const categories = await getCategories();
  const categoryMap = new Map(categories.map((c) => [c.no, c]));

  // 3. 오늘 자 데이터 가공
  const todayPomodoros = weeklyPomodoros.filter((p) => {
    const pDate = new Date(p.startedAt);
    return pDate >= startOfDay && pDate <= endOfDay;
  });

  const totalFocusTime = msToIsoDuration(
    todayPomodoros.reduce((sum, p) => sum + isoDurationToMs(p.focusedTime), 0),
  );
  const focusTimes = todayPomodoros.map((p, index) => {
    const category = categoryMap.get(p.categoryNo);
    return {
      no: index,
      category: {
        no: category?.no ?? 0,
        title: category?.title ?? '알 수 없음',
        iconType: category?.iconType ?? 'CAT',
      },
      totalFocusTime: p.focusedTime,
      startedAt: p.startedAt,
      doneAt: p.doneAt,
    };
  });

  // 4. 주간 집중 시간 트렌드 가공
  const dailyFocusMap = new Map<string, number>();
  for (let i = 0; i < 7; i++) {
    const date = new Date(weekStartDate);
    date.setDate(date.getDate() + i);
    dailyFocusMap.set(formatDate(date), 0);
  }

  weeklyPomodoros.forEach((p) => {
    const dateStr = formatDate(new Date(p.startedAt));
    const currentMinutes = dailyFocusMap.get(dateStr) ?? 0;
    dailyFocusMap.set(dateStr, currentMinutes + isoDurationToMs(p.focusedTime));
  });

  const dateToFocusTimeStatistics = Array.from(dailyFocusMap.entries()).map(
    ([date, totalMinutes]) => ({
      date,
      totalFocusTime: msToIsoDuration(totalMinutes),
    }),
  );

  // 5. 카테고리 랭킹 가공
  const categoryFocusMap = new Map<number, number>();
  weeklyPomodoros.forEach((p) => {
    const currentMinutes = categoryFocusMap.get(p.categoryNo) ?? 0;
    categoryFocusMap.set(p.categoryNo, currentMinutes + isoDurationToMs(p.focusedTime));
  });

  const rankingItems = Array.from(categoryFocusMap.entries())
    .map(([categoryNo, totalMinutes]) => ({
      category: categoryMap.get(categoryNo),
      totalFocusTime: msToIsoDuration(totalMinutes),
      totalMinutes,
    }))
    .sort((a, b) => b.totalMinutes - a.totalMinutes) // 집중 시간이 높은 순으로 정렬
    .map((item, index) => {
      const category = item.category;
      return {
        rank: index + 1,
        category: {
          no: category?.no ?? 0,
          title: category?.title ?? '알 수 없음',
          iconType: category?.iconType ?? 'CAT',
        },
        totalFocusTime: item.totalFocusTime,
      };
    });

  // 6. 최종 결과 조합
  const stats: Stats = {
    date: formatDate(targetDate),
    totalFocusTime,
    focusTimes,
    weeklyFocusTimeTrend: {
      startDate: formatDate(weekStartDate),
      endDate: formatDate(endOfDay),
      dateToFocusTimeStatistics,
    },
    categoryRanking: {
      startDate: formatDate(weekStartDate),
      endDate: formatDate(endOfDay),
      rankingItems,
    },
  };

  return stats;
};
