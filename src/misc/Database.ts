import SQLite, { SQLiteDatabase } from "react-native-sqlite-storage";
import {
  audioType,
  documentType,
  fileType,
  folderType,
  imageType,
  infoType,
  todoType,
} from "./types";

SQLite.enablePromise(true);

//! Start Folder
const openFolder = async (): Promise<SQLiteDatabase> => {
  const db = await SQLite.openDatabase({ name: "database.db" });
  await db.executeSql(`CREATE TABLE IF NOT EXISTS folders (
    _id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    icon TEXT NOT NULL,
    color TEXT
  );
`);
  return db;
};

export const insertIntoFolders = async (
  title: string,
  icon: string,
  color: string
) => {
  try {
    const db = await openFolder();

    db.executeSql(`INSERT INTO folders (title, icon, color) VALUES (?,?,?)`, [
      title,
      icon,
      color,
    ]);
  } catch (err) {
    console.error("Error inserting data into folders table", err);
  }
};

export const selectFromFolders = async (
  setFunc: (data: folderType[]) => void
) => {
  try {
    const db = await openFolder();
    const [results] = await db.executeSql(`SELECT * FROM folders`);
    const dataArray: folderType[] = results.rows.raw().map((row) => ({
      _id: row._id,
      title: row.title,
      icon: row.icon,
      color: row.color,
    }));

    setFunc(dataArray);
  } catch (err) {
    console.error("Error Select data from folders table", err);
  }
};

export const updateFolders = async (
  title: string,
  icon: string,
  color: string,
  _id: number
) => {
  try {
    const db = await openFolder();

    db.executeSql(
      `UPDATE folders SET title = ?, color = ?, icon = ? WHERE _id = ${_id}`,
      [title, color, icon]
    );
  } catch (err) {
    console.error("Error update folder item", err);
  }
};

export const deleteFolder = async (_id: number) => {
  try {
    const db = await openFolder();

    await deleteFilesFolder(_id);

    db.executeSql(`DELETE FROM folders WHERE _id = ${_id}`);
  } catch (err) {
    console.error("Error delete folder", err);
  }
};

//! Start Files
const openFile = async () => {
  const db = await SQLite.openDatabase({ name: "database.db" });
  await db.executeSql(`CREATE TABLE IF NOT EXISTS files (
          _id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT,
          desc INTEGER,
          color TEXT,
          folder_id INTEGER,
          FOREIGN KEY (folder_id) REFERENCES folders (_id)
      )`);
  return db;
};

export const insertIntoFiles = async (
  title: string,
  desc: string,
  folder_id: number,
  color: string
) => {
  try {
    const db = await openFile();

    db.executeSql(
      `INSERT INTO files (title, desc, folder_id, color) VALUES (?,?,?,?)`,
      [title, desc, folder_id, color]
    );
  } catch (err) {
    console.error("Error inserting data into files table", err);
  }
};

export const selectFromFiles = async (
  setFunc: (data: fileType[]) => void,
  folder_id: number
) => {
  try {
    const db = await openFile();
    const [results] = await db.executeSql(
      `SELECT * FROM files WHERE folder_id = ${folder_id}`
    );
    const dataArray: fileType[] = results.rows.raw().map((row) => ({
      _id: row._id,
      title: row.title,
      desc: row.desc,
      color: row.color,
    }));

    setFunc(dataArray);
  } catch (err) {
    console.error("Error Select data from files table", err);
  }
};

export const updateFiles = async (
  title: string,
  desc: string,
  _id: number,
  color: string
) => {
  try {
    const db = await openFile();

    db.executeSql(
      `UPDATE files SET title = ?, desc = ?, color = ? WHERE _id = ${_id}`,
      [title, desc, color]
    );
  } catch (err) {
    console.error("Error update files item", err);
  }
};

export const deleteFileComponent = async (_id: number) => {
  await deleteInfo(_id);
  await deleteTodo(_id);
  await deleteImages(_id);
  await deleteAudio(_id);
  await deleteDocuments(_id);
};

export const deleteFile = async (_id: number) => {
  try {
    const db = await openFile();

    await deleteFileComponent(_id);

    db.executeSql(`DELETE FROM files WHERE _id = ${_id}`);
  } catch (err) {
    console.error("Error delete file item", err);
  }
};

export const deleteFilesFolder = async (parent_id: number) => {
  try {
    const db = await openFile();

    const [results] = await db.executeSql(
      `SELECT _id FROM  files WHERE folder_id = ${parent_id}`
    );

    for (const file of results.rows.raw()) await deleteFile(file._id);
  } catch (err) {
    console.error("Error delete files inside folder", err);
  }
};

//! Start Info

const openInfo = async (): Promise<SQLiteDatabase> => {
  const db = await SQLite.openDatabase({ name: "database.db" });
  await db.executeSql(`CREATE TABLE IF NOT EXISTS info (
    _id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    info TEXT NOT NULL,
    withBorder INTEGER,
    file_id INTEGER,
    FOREIGN KEY (file_id) REFERENCES files (_id)
  );
`);
  return db;
};

export const insertIntoInfo = async (
  title: string,
  info: string,
  withBorder: boolean,
  file_id: number
) => {
  try {
    const db = await openInfo();

    db.executeSql(
      `INSERT INTO info (title, info, withBorder, file_id) VALUES (?,?,?,?)`,
      [title, info, withBorder ? 1 : 0, file_id]
    );
  } catch (err) {
    console.error("Error inserting data into Info table", err);
  }
};

export const selectFromInfo = async (
  setFunc: (data: infoType[]) => void,
  parent_id: number
) => {
  try {
    const db = await openInfo();
    const [results] = await db.executeSql(
      `SELECT * FROM info WHERE file_id = ${parent_id}`
    );
    const dataArray: infoType[] = results.rows.raw().map((row) => ({
      _id: row._id,
      title: row.title,
      info: row.info,
      withBorder: row.withBorder === 1 ? true : false,
    }));

    setFunc(dataArray);
  } catch (err) {
    console.error("Error Select data from info table", err);
  }
};

export const select1FromInfo = async (
  setFunc: (data: string | undefined) => void,
  parent_id: number
) => {
  try {
    const db = await openInfo();
    const [results] = await db.executeSql(
      `SELECT info FROM info WHERE file_id = ${parent_id} LIMIT 1`
    );

    results.rows.raw()[0]
      ? setFunc(results.rows.raw()[0].info)
      : setFunc(undefined);
  } catch (err) {
    console.error("Error select 1 data from info table", err);
  }
};

export const updateInfo = async (
  _id: number,
  title: string,
  info: string,
  withBorder: string
) => {
  try {
    const db = await openInfo();

    db.executeSql(
      `UPDATE folders SET title = ?, info = ?, withBorder = ? WHERE _id = ${_id}`,
      [title, info, withBorder]
    );
  } catch (err) {
    console.error("Error update info item", err);
  }
};

export const deleteInfo = async (parent_id: number) => {
  try {
    const db = await openInfo();
    db.executeSql(`DELETE FROM info WHERE file_id = ${parent_id}`);
  } catch (err) {
    console.error("Error deleting info", err);
  }
};

//! Start audio

const openAudio = async (): Promise<SQLiteDatabase> => {
  const db = await SQLite.openDatabase({ name: "database.db" });
  await db.executeSql(`CREATE TABLE IF NOT EXISTS audio (
    _id INTEGER PRIMARY KEY AUTOINCREMENT,
    uri TEXT NOT NULL,
    filename TEXT NOT NULL,
    withBorder INTEGER,
    file_id INTEGER,
    FOREIGN KEY (file_id) REFERENCES files (_id)
  );
`);
  return db;
};

export const insertIntoAudio = async (
  uri: string,
  filename: string,
  file_id: number,
  withBorder: boolean
) => {
  try {
    const db = await openAudio();

    db.executeSql(
      `INSERT INTO audio (uri, filename, withBorder ,file_id) VALUES (?,?,?, ?)`,
      [uri, filename, withBorder ? 1 : false, file_id]
    );
  } catch (err) {
    console.error("Error inserting data into Audio table", err);
  }
};

export const selectFromAudio = async (
  setFunc: (data: audioType[]) => void,
  parent_id: number
) => {
  try {
    const db = await openAudio();
    const [results] = await db.executeSql(
      `SELECT * FROM audio WHERE file_id = ${parent_id} `
    );
    const dataArray: audioType[] = results.rows.raw().map((row) => ({
      _id: row._id,
      uri: row.uri,
      withBorder: row.withBorder === 1 ? true : false,
      filename: row.filename,
    }));

    setFunc(dataArray);
  } catch (err) {
    console.error("Error Select data from audio table", err);
  }
};

export const deleteAudio = async (parent_id: number) => {
  try {
    const db = await openAudio();
    db.executeSql(`DELETE FROM audio WHERE file_id = ${parent_id}`);
  } catch (err) {
    console.error("Error deleting audio", err);
  }
};

//! Start image

const openImage = async (): Promise<SQLiteDatabase> => {
  const db = await SQLite.openDatabase({ name: "database.db" });
  await db.executeSql(`CREATE TABLE IF NOT EXISTS image (
    _id INTEGER PRIMARY KEY AUTOINCREMENT,
    uri TEXT NOT NULL,
    title TEXT,
    info TEXT,
    withBorder INTEGER,
    file_id INTEGER,
    FOREIGN KEY (file_id) REFERENCES files (_id)
  );
`);
  return db;
};

export const insertIntoImage = async (
  uri: string,
  info: string,
  withBorder: boolean,
  title: string,
  file_id: number
) => {
  try {
    const db = await openImage();

    db.executeSql(
      `INSERT INTO image (uri, info, title, withBorder, file_id) VALUES (?,?,?,?,?)`,
      [uri, info, title, withBorder ? 1 : 0, file_id]
    );
  } catch (err) {
    console.error("Error inserting data into image table", err);
  }
};

export const selectFromImage = async (
  setFunc: (data: imageType[]) => void,
  parent_id: number
) => {
  try {
    const db = await openImage();
    const [results] = await db.executeSql(
      `SELECT * FROM image WHERE file_id = ${parent_id}`
    );
    const dataArray: imageType[] = results.rows.raw().map((row) => ({
      _id: row._id,
      uri: row.uri,
      info: row.info,
      title: row.title,
      withBorder: row.withBorder === 1 ? true : false,
    }));

    setFunc(dataArray);
  } catch (err) {
    console.error("Error Select data from image table", err);
  }
};

export const select1FromImage = async (
  setFunc: (src: string | undefined) => void,
  parent_id: number
) => {
  try {
    const db = await openImage();
    const [results] = await db.executeSql(
      `SELECT uri FROM image WHERE file_id = ${parent_id} LIMIT 1`
    );

    results.rows.raw()[0]
      ? setFunc(results.rows.raw()[0].uri)
      : setFunc(undefined);
  } catch (err) {
    console.error("Error select 1 data from image table", err);
  }
};

export const deleteImages = async (parent_id: number) => {
  try {
    const db = await openTodo();
    db.executeSql(`DELETE FROM image WHERE file_id = ${parent_id}`);
  } catch (err) {
    console.error("Error deleting image", err);
  }
};

//! Start todo list

const openTodo = async (): Promise<SQLiteDatabase> => {
  const db = await SQLite.openDatabase({ name: "database.db" });
  await db.executeSql(`CREATE TABLE IF NOT EXISTS todo (
    _id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    checked INTEGER,
    file_id INTEGER,
    FOREIGN KEY (file_id) REFERENCES files (_id)
  );
`);
  return db;
};

export const insertIntoTodo = async (
  title: string,
  checked: boolean,
  file_id: number
) => {
  try {
    const db = await openTodo();

    db.executeSql(`INSERT INTO todo (title, checked, file_id) VALUES (?,?,?)`, [
      title,
      checked ? 1 : 0,
      file_id,
    ]);
  } catch (err) {
    console.error("Error inserting data into todo table", err);
  }
};

export const selectFromTodo = async (
  setFunc: (data: todoType[]) => void,
  parent_id: number
) => {
  try {
    const db = await openTodo();
    const [results] = await db.executeSql(
      `SELECT * FROM todo WHERE file_id = ${parent_id}`
    );
    const dataArray: todoType[] = results.rows.raw().map((row) => ({
      _id: row._id,
      title: row.title,
      checked: row.checked === 1 ? true : false,
    }));

    setFunc(dataArray);
  } catch (err) {
    console.error("Error Select data from todo table", err);
  }
};

export const selectSomeFromTodo = async (
  setFunc: (data: { title: string; checked: boolean }[]) => void,
  parent_id: number
) => {
  try {
    const db = await openTodo();
    const [results] = await db.executeSql(
      `SELECT title, checked FROM todo WHERE file_id = ${parent_id} LIMIT 3`
    );

    const dataArray = results.rows.raw().map((row) => ({
      title: row.title,
      checked: row.checked === 1 ? true : false,
    }));

    setFunc(dataArray);
  } catch (err) {
    console.error("Error select some from Todo", err);
  }
};

export const updateCheckedInTodo = async (_id: number, checked: boolean) => {
  try {
    const db = await openTodo();
    await db.executeSql(`UPDATE todo SET checked = ? WHERE _id = ${_id}`, [
      checked ? 1 : 0,
    ]);
  } catch (err) {
    console.error("Error update todo checked", err);
  }
};

export const deleteTodo = async (parent_id: number) => {
  try {
    const db = await openTodo();
    db.executeSql(`DELETE FROM todo WHERE file_id = ${parent_id}`);
  } catch (err) {
    console.error("Error deleting list", err);
  }
};

//! Start Documents

const openDocuments = async (): Promise<SQLiteDatabase> => {
  const db = await SQLite.openDatabase({ name: "database.db" });
  await db.executeSql(`CREATE TABLE IF NOT EXISTS documents (
    _id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    uri TEXT NOT NULL,
    type TEXT,
    file_id INTEGER,
    FOREIGN KEY (file_id) REFERENCES files (_id)
  );
`);
  return db;
};

export const insertIntoDocuments = async (
  title: string,
  file_id: number,
  uri: string,
  type: string
) => {
  try {
    const db = await openDocuments();

    db.executeSql(
      `INSERT INTO documents (title, uri, type, file_id) VALUES (?,?,?,?)`,
      [title, uri, type, file_id]
    );
  } catch (err) {
    console.error("Error inserting data into documents table", err);
  }
};

export const selectFromDocuments = async (
  setFunc: (data: documentType[]) => void,
  parent_id: number
) => {
  try {
    const db = await openDocuments();
    const [results] = await db.executeSql(
      `SELECT * FROM documents WHERE file_id = ${parent_id}`
    );
    const dataArray: documentType[] = results.rows.raw().map((row) => ({
      _id: row._id,
      title: row.title,
      uri: row.uri,
      type: row.type,
    }));

    setFunc(dataArray);
  } catch (err) {
    console.error("Error Select data from documents table", err);
  }
};

export const deleteDocuments = async (parent_id: number) => {
  try {
    const db = await openDocuments();
    db.executeSql(`DELETE FROM documents WHERE file_id = ${parent_id}`);
  } catch (err) {
    console.error("Error deleting documents", err);
  }
};

//! control

export const callEveryThing = async () => {
  try {
    let db1 = await openFolder();
    let db2 = await openFile();
    let db3 = await openInfo();
    let db4 = await openTodo();
    let db5 = await openDocuments();
    let db6 = await openAudio();
    let db7 = await openImage();

    const [results1] = await db1.executeSql(`SELECT _id from folders`);
    const [results2] = await db2.executeSql(`SELECT title from files`);
    const [results3] = await db3.executeSql(`SELECT title from info`);
    const [results4] = await db4.executeSql(`SELECT filename from audio`);
    const [results5] = await db5.executeSql(`SELECT title from image`);
    const [results6] = await db6.executeSql(`SELECT title from todo`);
    const [results7] = await db7.executeSql(`SELECT title from documents`);

    console.log("Folders \n:", results1.rows.raw());
    console.log("Files \n:", results2.rows.raw());
    console.log("Info \n:", results3.rows.raw());
    console.log("Audio \n:", results4.rows.raw());
    console.log("Image \n:", results5.rows.raw());
    console.log("List \n:", results6.rows.raw());
    console.log("Documents \n:", results7.rows.raw());
  } catch (err) {
    console.error("Error Calling ", err);
  }
};

export const clearDB = async () => {
  const db = await SQLite.openDatabase({ name: "database.db" });

  try {
    db.executeSql(`DROP TABLE IF EXISTS documents`);
    db.executeSql(`DROP TABLE IF EXISTS todo`);
    db.executeSql(`DROP TABLE IF EXISTS image`);
    db.executeSql(`DROP TABLE IF EXISTS audio`);
    db.executeSql(`DROP TABLE IF EXISTS info`);

    db.executeSql(`DROP TABLE IF EXISTS files`);

    db.executeSql(`DROP TABLE IF EXISTS folders`);
  } catch (err) {
    console.error("Error clear data from db", err);
  }
};
