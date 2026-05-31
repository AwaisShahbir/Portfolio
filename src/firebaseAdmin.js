import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import app from "./firebase";

export const auth = getAuth(app);
export const storage = getStorage(app);
