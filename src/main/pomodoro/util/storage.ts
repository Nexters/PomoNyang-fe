import { app } from 'electron';
import fs from 'fs';
import path from 'path';

export class SimpleStorage {
  storagePath: string;
  data: Record<string, string>;

  constructor() {
    const userDataPath = app.getPath('userData');
    this.storagePath = path.join(userDataPath, 'storage.json');
    this.data = {};
    this._load(); // 초기 데이터 로드
  }

  // storage.json 파일이 존재하면 데이터를 로드
  _load() {
    if (fs.existsSync(this.storagePath)) {
      try {
        const fileContent = fs.readFileSync(this.storagePath, 'utf8');
        this.data = JSON.parse(fileContent);
      } catch (error) {
        console.error('저장소 로드 실패:', error);
        this.data = {};
      }
    }
  }

  // 데이터를 JSON 파일에 저장
  _save() {
    try {
      fs.writeFileSync(this.storagePath, JSON.stringify(this.data, null, 2));
    } catch (error) {
      console.error('저장소 저장 실패:', error);
    }
  }

  // key와 value를 저장 (localStorage.setItem과 동일)
  setItem(key: string, value: string) {
    this.data[key] = value;
    this._save();
  }

  // key에 해당하는 값을 가져옴 (localStorage.getItem과 동일)
  getItem(key: string): string | null {
    return this.data[key] ?? null;
  }

  // key에 해당하는 데이터를 삭제 (localStorage.removeItem과 동일)
  removeItem(key: string) {
    delete this.data[key];
    this._save();
  }

  // 모든 데이터를 삭제 (localStorage.clear와 동일)
  clear() {
    this.data = {};
    this._save();
  }
}
