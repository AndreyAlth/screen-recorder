import Store from 'electron-store';

export interface SavePath {
  id: string;
  namePath: string;
  path: string;
}

// Define your schema for type safety
interface StoreSchema {
  paths: SavePath[];
  selectedPathId: string;
}

const store = new Store<StoreSchema>({
    defaults: {
        paths: [
            { id: 'default', namePath: 'Downloads', path: '/home/andreyalth/Descargas/' }
        ],
        selectedPathId: 'default',
    }
}); 

export default store;